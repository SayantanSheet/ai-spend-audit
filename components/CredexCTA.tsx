import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CredexCTA({ spend }: { spend: number }) {
    if (spend > 500) {
        return (
            <Card className="border-indigo-200 bg-indigo-50/50 shadow-sm mt-8">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-indigo-900 mb-1">
                                Enterprise Scale Detected
                            </h3>
                            <p className="text-indigo-800/80 mb-4 text-sm leading-relaxed">
                                You are spending over $500 monthly on fragmented AI tools. Credex offers enterprise-grade
                                consolidation, team management, and flat-rate API aggregation that could save your team
                                thousands of dollars annually while retaining all capabilities.
                            </p>
                            <a
                                href="https://calendly.com/credex-strategy-mock"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex bg-indigo-600 text-white px-5 py-2 rounded-md font-medium text-sm items-center gap-2 hover:bg-indigo-700 transition-colors"
                            >
                                Book Credex Strategy Call <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (spend < 100) {
        return (
            <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm mt-8">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-emerald-800 font-medium">
                            Honest Take: Your stack is incredibly lean. You are optimized nicely and likely don't need heavy enterprise tooling yet!
                        </h3>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return null; // Don't show specific messaging for moderate generic bounds
}
