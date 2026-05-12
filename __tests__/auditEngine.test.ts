import { calculateAudit, SpendData } from "../lib/auditEngine";

describe("auditEngine Deterministic Core", () => {
    it("1. calculates total monthly and annualized base values perfectly", () => {
        const data: SpendData = {
            tools: [
                { name: "Generic Tool A", cost: 100, billingCycle: "monthly" },
                { name: "Generic Tool B", cost: 1200, billingCycle: "annually" } // $100/mo
            ]
        };

        const result = calculateAudit(data);
        expect(result.totalMonthlySpend).toBe(200);
        expect(result.annualizedTotal).toBe(2400);
        expect(result.optimalMonthlySpend).toBe(200);
        expect(result.redFlags.length).toBe(0);
    });

    it("2. detects LLM redundancy and calculates correct overlap savings", () => {
        const data: SpendData = {
            tools: [
                { name: "ChatGPT Plus", cost: 20, billingCycle: "monthly" },
                { name: "Claude Pro", cost: 20, billingCycle: "monthly" },
                { name: "Perplexity Pro", cost: 20, billingCycle: "monthly" }
            ]
        };

        const result = calculateAudit(data);
        // 3 LLMs = 2 overlaps at $20 = $40 savings
        expect(result.totalMonthlySpend).toBe(60);
        expect(result.estimatedMonthlySavings).toBe(40);
        expect(result.optimalMonthlySpend).toBe(20);
        expect(result.redFlags[0]).toContain("consolidating to a single primary tool");
    });

    it("3. detects coding agent overlap and suggests standardization", () => {
        const data: SpendData = {
            tools: [
                { name: "GitHub Copilot", cost: 10, billingCycle: "monthly" },
                { name: "Cursor Pro", cost: 20, billingCycle: "monthly" }
            ]
        };

        const result = calculateAudit(data);
        expect(result.totalMonthlySpend).toBe(30);
        // 2 coding agents = 1 overlap at $15
        expect(result.estimatedMonthlySavings).toBe(15);
        expect(result.redFlags[0]).toContain("Multiple coding assistants detected");
    });

    it("4. triggers red flag on malformed ChatGPT Team spend bounds", () => {
        const data: SpendData = {
            tools: [
                { name: "ChatGPT Team", cost: 30, billingCycle: "monthly" }
            ]
        };

        const result = calculateAudit(data);
        expect(result.redFlags[0]).toContain("minimum seats");
    });

    it("5. bounds optimal monthly spend to never fall below zero", () => {
        const data: SpendData = {
            tools: [
                { name: "ChatGPT 1", cost: 0, billingCycle: "monthly" },
                { name: "ChatGPT 2", cost: 0, billingCycle: "monthly" },
                { name: "ChatGPT 3", cost: 0, billingCycle: "monthly" }
            ]
        };

        const result = calculateAudit(data);
        // Even though overlaps occur, math shouldn't drop optimal spend below 0
        expect(result.optimalMonthlySpend).toBe(0);
    });
});
