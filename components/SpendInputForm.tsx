"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 1. Zod Schema
export const spendSchema = z.object({
  honey: z.string().max(0, "Bot detected").optional(),
  tools: z.array(
    z.object({
      name: z.string().min(1, "Tool name required"),
      cost: z.coerce.number().min(0, "Must be a positive number"),
      billingCycle: z.enum(["monthly", "annually"]).default("monthly"),
    })
  ).min(1, "Add at least one tool"),
});

export type SpendData = z.infer<typeof spendSchema>;

// 2. Zustand Store for Persistence
interface SpendStore {
  data: SpendData;
  setSpendData: (data: SpendData) => void;
}

export const useSpendStore = create<SpendStore>()(
  persist(
    (set) => ({
      data: { tools: [{ name: "", cost: 0, billingCycle: "monthly" }] },
      setSpendData: (data) => set({ data }),
    }),
    { name: "spend-audit-storage" }
  )
);

// 3. Form Component
export default function SpendInputForm() {
  const { data, setSpendData } = useSpendStore();
  const [mounted, setMounted] = useState(false);

  // Prevent Next.js hydration mismatch by only rendering after mount
  useEffect(() => setMounted(true), []);

  const form = useForm<SpendData>({
    resolver: zodResolver(spendSchema) as any,
    defaultValues: data,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  const onSubmit = (values: any) => {
    setSpendData(values);
    console.log("Locally saved data structure:", values);

    // Day 4 Integration: Trigger API
    // fetch('/api/audit', { method: 'POST', body: JSON.stringify(values) });
    // router.push(`/audit/mock123`);
  };

  if (!mounted) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Your AI Tech Stack</CardTitle>
        <CardDescription>Enter the AI tools your team uses to audit for overspend.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Honeypot field for abuse protection */}
            <input type="text" {...form.register("honey")} className="hidden" tabIndex={-1} autoComplete="off" />

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3 p-4 border rounded-lg bg-slate-50/50">
                <FormField
                  control={form.control}
                  name={`tools.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tool Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ChatGPT Team" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tools.${index}.cost`}
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <FormLabel>Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tools.${index}.billingCycle`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Billing</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "monthly"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ name: "", cost: 0, billingCycle: "monthly" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tool
            </Button>

            <div className="pt-6">
              <Button type="submit" className="w-full">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
