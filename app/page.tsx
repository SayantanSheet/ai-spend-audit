import SpendInputForm from "@/components/SpendInputForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center bg-slate-50 font-sans p-4">
      <main className="w-full max-w-4xl py-20">
        <div className="text-center mb-16 px-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6 lg:text-6xl">
            Stop Burning Cash on AI Tools.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            We audit your ChatGPT, Midjourney, and Anthropic subscriptions against optimal plans.
            Most startups save over <span className="font-bold text-indigo-600">$200/month</span> instantly.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left mt-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Deterministic Math</h3>
              <p className="text-sm text-slate-500">No AI "hallucinations" on pricing. Every number is traced to official vendor data.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">AI-Powered Summary</h3>
              <p className="text-sm text-slate-500">Get an executive summary for your CFO with one click.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Privacy First</h3>
              <p className="text-sm text-slate-500">We don't need your bank login. Just tell us what you use.</p>
            </div>
          </div>
        </div>

        <SpendInputForm />

        <div className="mt-20 text-center border-t pt-10 border-slate-200">
          <p className="text-sm text-slate-400">
            Free tool. No credit card required. Pricing traced to official URLs.
            <br />
            Last updated: May 2026
          </p>
        </div>
      </main>
    </div>
  );
}
