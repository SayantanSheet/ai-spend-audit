"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

interface AISummarySectionProps {
    totalSpend: number;
    savings: number;
    alternatives: string[];
}

export function AISummarySection({ totalSpend, savings, alternatives }: AISummarySectionProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    totalSpend,
                    savings,
                    alternatives,
                    usernameHoneypot: "", // Empty for humans
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate summary");

            setSummary(data.summary);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (summary) {
        return (
            <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        AI Executive Summary
                    </CardTitle>
                    <CardDescription>Generated specifically for your audit results.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-indigo max-w-none">
                        <p className="text-slate-700 leading-relaxed italic">"{summary}"</p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Full report and implementation plan sent to your email.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Get Your AI Summary
                </CardTitle>
                <CardDescription>
                    Enter your email to receive an AI-generated executive summary and your full optimization report.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="flex-1">
                        <Input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-slate-50 border-slate-200"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Generate Summary
                    </Button>
                </form>
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                <p className="text-xs text-slate-400 mt-4">
                    By clicking generate, you agree to receive a one-time audit report via email. We never spam.
                </p>
            </CardContent>
        </Card>
    );
}
