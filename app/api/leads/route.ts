import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import OpenAI from 'openai';

// Constants for Supabase and SDKs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const resendApiKey = process.env.RESEND_API_KEY || '';
const openrouterApiKey = process.env.OPENROUTER_API_KEY || '';
const openrouterModel = "nvidia/nemotron-3-super-120b-a12b:free";

// Rate limiting (basic in-memory)
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
        if (!supabaseUrl || !supabaseKey) {
            console.warn("Supabase not configured, skipping lead save.");
        } else {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { error: dbError } = await supabase
                .from('leads')
                .insert([{ email, total_spend: totalSpend, potential_savings: savings }]);

            if (dbError && dbError.code !== '23505') {
                console.error('Supabase error:', dbError);
            }
        }

        // 4. Generate AI Summary (Deterministic via strict prompting)
        let aiSummaryText = "Based on your audit, you have significant room to optimize your SaaS spend. Consider switching to the suggested tools to reclaim your budget.";
        try {
            if (openrouterApiKey) {
                const openai = new OpenAI({
                    apiKey: openrouterApiKey,
                    baseURL: "https://openrouter.ai/api/v1",
                    defaultHeaders: {
                        "HTTP-Referer": "http://localhost:3000", // Optional for OpenRouter
                        "X-Title": "AI Spend Audit", // Optional for OpenRouter
                    }
                });

                const completion = await openai.chat.completions.create({
                    model: openrouterModel,
                    messages: [
                        {
                            role: "system",
                            content: "You are a financial advisor specializing in SaaS cost optimization. Output a strict 100-word summary highlighting overspend and alternatives. No greeting."
                        },
                        {
                            role: "user",
                            content: `Current Spend: $${totalSpend}\nSavings: $${savings}\nAlternatives: ${JSON.stringify(alternatives)}`
                        }
                    ],
                });

                aiSummaryText = completion.choices[0].message.content || aiSummaryText;
            } else {
                console.warn("OpenRouter API key missing, using fallback summary.");
            }
        } catch (aiError) {
            console.error('AI generation fallback triggered:', aiError);
            // Fallback is used if generation fails
        }

        // 5. Send welcome / report email via Resend
        try {
            if (resendApiKey) {
                const resend = new Resend(resendApiKey);
                await resend.emails.send({
                    from: 'Audit Tool <onboarding@resend.dev>',
                    to: email,
                    subject: 'Your AI Spend Audit Report',
                    html: `<p>Thank you for using the AI Spend Audit.</p><p><strong>Summary:</strong> ${aiSummaryText}</p><p>You can view your full report by returning to the platform.</p>`
                });
            } else {
                console.warn("Resend API key missing, skipping email.");
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
