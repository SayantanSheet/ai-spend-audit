import { Metadata } from "next";
import { CredexCTA } from "@/components/CredexCTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// In Day 4 we will integrate Supabase here using the [id]. For Day 3, we mock the fetch.
// This allows scaffolding the full UI and OG/Meta tags without blocking on DB schema.

interface PageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: `AI Spend Audit Results | ${params.id}`,
        description: "View the personalized AI overspend report and optimization plan.",
        openGraph: {
            title: "Your AI Spend Audit Results",
            description: "See how much you can save by optimizing your AI tools.",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Audit Results OG" }],
        },
        twitter: {
            card: "summary_large_image",
            title: "AI Spend Audit Results",
            description: "I just found out how much I am overpaying for AI subscriptions. Check out my audit!",
            images: ["/og-image.png"],
        },
    };
}

export default function AuditResultsPage({ params }: PageProps) {
    // Mocking the result payload for Day 3 UI scaffolding
    const mockResult = {
        totalMonthlySpend: 620, // Let's test the >$500 threshold
        annualizedTotal: 7440,
        optimalMonthlySpend: 240,
        estimatedMonthlySavings: 380,
        redFlags: [
            "You are paying for 4 different conversational AI subscriptions. Consider consolidating to a single primary tool.",
            "Multiple coding assistants detected. Standardizing on one platform reduces context fragmentation."
        ],
    };

    return (
        <div className="flex flex-col min-h-screen items-center py-12 px-4 bg-slate-50 font-sans">
            <main className="w-full max-w-4xl space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Audit Results</h1>
                    <p className="text-slate-500">Report ID: {params.id}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2 text-slate-500 text-sm">Total Current Spend</CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">${mockResult.totalMonthlySpend}/mo</div>
                            <div className="text-xs text-slate-400 mt-1">${mockResult.annualizedTotal}/yr</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-emerald-50 border-emerald-100">
                        <CardHeader className="pb-2 text-emerald-600 text-sm font-medium">Optimal Spend</CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-900">${mockResult.optimalMonthlySpend}/mo</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-100">
                        <CardHeader className="pb-2 text-blue-600 text-sm font-medium">Estimated Savings</CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900">${mockResult.estimatedMonthlySavings}/mo</div>
                            <div className="text-xs text-blue-500/70 mt-1">${mockResult.estimatedMonthlySavings * 12}/yr</div>
                        </CardContent>
                    </Card>
                </div>

                {mockResult.redFlags.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                Red Flags Detected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {mockResult.redFlags.map((flag, idx) => (
                                    <li key={idx} className="flex gap-2 text-slate-700 bg-amber-50/50 p-3 rounded-md border border-amber-100">
                                        <span className="text-amber-500 font-bold">•</span>
                                        {flag}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <CredexCTA spend={mockResult.totalMonthlySpend} />

                <div className="flex justify-center pt-8">
                    <button className="text-slate-400 hover:text-slate-600 underline text-sm">
                        Copy public link to share this audit
                    </button>
                </div>
            </main>
        </div>
    );
}
