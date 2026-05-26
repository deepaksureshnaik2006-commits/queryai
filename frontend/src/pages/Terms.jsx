import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Terms of Service</h1>
            <p className="text-sm text-slate-500 mt-0.5">Last updated: January 1, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-slate-400 leading-relaxed">

          <section>
            <h2 className="text-sm font-bold text-white mb-2">Using QueryAI</h2>
            <p>QueryAI is a SQL optimization tool. By using it, you agree to use it for lawful purposes only. Do not submit queries that are designed to exfiltrate or manipulate data you don't have permission to access.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white mb-2">Your responsibility</h2>
            <p>QueryAI suggests optimizations — it does not apply them. You are fully responsible for reviewing any AI-generated SQL before running it against your database. Always test in a safe environment first.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white mb-2">Your account</h2>
            <p>Keep your login credentials secure. You are responsible for all activity under your account. Let us know immediately if you suspect unauthorized access.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white mb-2">Service availability</h2>
            <p>QueryAI is provided as-is. We do our best to keep it running but cannot guarantee uninterrupted access. We may update or modify the service at any time.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white mb-2">Contact</h2>
            <p>Questions about these terms? Email us at <a href="mailto:team.queryai564@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">team.queryai564@gmail.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
