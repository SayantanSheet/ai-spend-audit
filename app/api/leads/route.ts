import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

// Basic in-memory rate limiting (Note: in production, Redis or Upstash should be used)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // max 5 requests per minute
const WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const windowData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - windowData.lastReset > WINDOW_MS) {
        windowData.count = 0;
        windowData.lastReset = now;
    }

    if (windowData.count >= RATE_LIMIT) {
        return true;
    }

    windowData.count += 1;
    rateLimitMap.set(ip, windowData);
    return false;
}

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';

        // 1. Rate Limiting Protection
        if (isRateLimited(ip)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const { email, totalSpend, savings, alternatives, usernameHoneypot } = await req.json();

        // 2. Honeypot Abuse Protection
        // 'usernameHoneypot' is meant to be a visually hidden field. If a bot fills it, it's rejected.
        if (usernameHoneypot) {
            // Fake a success to fool the bot without doing actual work
            return NextResponse.json({ success: true, message: 'Lead captured' }, { status: 200 });
        }

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 3. Save Lead to Supabase
        const { error: dbError } = await supabase
            .from('leads')
            .insert([{ email, total_spend: totalSpend, potential_savings: savings }]);

        if (dbError && dbError.code !== '23505') {
            // Ignore unique constraint violation for duplicate emails to avoid leaking user info, log others
            console.error('Supabase error:', dbError);
            return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
        }

        // 4. Generate AI Summary (Deterministic via strict prompting)
        let aiSummaryText = "Based on your audit, you have significant room to optimize your SaaS spend. Consider switching to the suggested tools to reclaim your budget.";
        try {
            if (process.env.ANTHROPIC_API_KEY) {
                const msg = await anthropic.messages.create({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 150,
                    system: "You are a financial advisor specializing in SaaS cost optimization. Output a strict 100-word summary highlighting overspend and alternatives. No greeting.",
                    messages: [
                        {
                            role: "user",
                            content: `Current Spend: $${totalSpend}\nSavings: $${savings}\nAlternatives: ${JSON.stringify(alternatives)}`
                        }
                    ]
                });
                if (msg.content[0].type === 'text') {
                    aiSummaryText = msg.content[0].text;
                }
            }
        } catch (aiError) {
            console.error('AI generation fallback triggered:', aiError);
            // Fallback is used if generation fails
        }

        // 5. Send welcome / report email via Resend
        try {
            if (process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: 'Audit Tool <onboarding@resend.dev>',
                    to: email,
                    subject: 'Your AI Spend Audit Report',
                    html: `<p>Thank you for using the AI Spend Audit.</p><p><strong>Summary:</strong> ${aiSummaryText}</p><p>You can view your full report by returning to the platform.</p>`
                });
            }
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        return NextResponse.json({ success: true, summary: aiSummaryText }, { status: 200 });
    } catch (err) {
        console.error('Unhandled request error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
