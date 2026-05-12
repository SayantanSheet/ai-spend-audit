import SpendInputForm from "@/components/SpendInputForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 font-sans p-4">
      <main className="w-full max-w-4xl py-12">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-2 text-slate-900">AI Spend Audit</h1>
        <p className="text-lg text-center text-slate-500 mb-8">Calculate your overspend and find optimal plans instantly.</p>
        <SpendInputForm />
      </main>
    </div>
  );
}
