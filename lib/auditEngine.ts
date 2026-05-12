export interface ToolSpend {
    name: string;
    cost: number;
    billingCycle: "monthly" | "annually";
}

export interface SpendData {
    tools: ToolSpend[];
}

export interface AuditResult {
    totalMonthlySpend: number;
    annualizedTotal: number;
    optimalMonthlySpend: number;
    estimatedMonthlySavings: number;
    redFlags: string[];
}

/**
 * Deterministic, rules-based engine comparing inputted spend vs optimal logic based strictly on PRICING_DATA.md.
 */
export function calculateAudit(data: SpendData): AuditResult {
    let totalMonthlySpend = 0;
    const redFlags: string[] = [];

    // Categorization helpers
    let llmCount = 0;
    let codeAgentCount = 0;

    for (const tool of data.tools) {
        const monthlyCost = tool.billingCycle === "annually" ? tool.cost / 12 : tool.cost;
        totalMonthlySpend += monthlyCost;

        const lowerName = tool.name.toLowerCase();

        if (lowerName.includes("chatgpt") || lowerName.includes("claude") || lowerName.includes("perplexity") || lowerName.includes("gemini")) {
            llmCount++;
            if (lowerName.includes("team") && monthlyCost < 60 && lowerName.includes("chatgpt")) {
                // Minimum team size is 2, so something is off or they are an individual paying for team erroneously
                redFlags.push(`Warning: ${tool.name} usually requires minimum seats. Verify your license usage.`);
            }
        }

        if (lowerName.includes("copilot") || lowerName.includes("cursor") || lowerName.includes("cody")) {
            codeAgentCount++;
        }
    }

    // Savings Logic purely deterministic
    let optimalMonthlySpend = totalMonthlySpend;

    // Rule 1: Consolidation overlap. No one needs 3 LLM subscriptions.
    if (llmCount > 1) {
        const overlappingSpend = (llmCount - 1) * 20; // Assume $20 standard baseline
        optimalMonthlySpend -= overlappingSpend;
        redFlags.push(`You are paying for ${llmCount} different conversational AI subscriptions. Consider consolidating to a single primary tool or an API aggregator to save ~$${overlappingSpend.toFixed(2)}/mo.`);
    }

    // Rule 2: Coding Agents overlap
    if (codeAgentCount > 1) {
        const overlappingSpend = (codeAgentCount - 1) * 15; // Rough average
        optimalMonthlySpend -= overlappingSpend;
        redFlags.push(`Multiple coding assistants detected. Standardizing on one platform (like Cursor or Copilot) across the team reduces context fragmentation and saves money.`);
    }

    // Protection against negative optimal
    if (optimalMonthlySpend < 0) optimalMonthlySpend = 0;

    return {
        totalMonthlySpend,
        annualizedTotal: totalMonthlySpend * 12,
        optimalMonthlySpend,
        estimatedMonthlySavings: totalMonthlySpend - optimalMonthlySpend,
        redFlags
    };
}
