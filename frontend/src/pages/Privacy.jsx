import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-slate-500 mt-0.5">Last updated: January 1, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-slate-400 leading-relaxed">

          <section>
            <h2 className="text-sm font-bold text-white mb-2">What we collect</h2>
            <p>When you create an account, we store your name and email address. When you optimize a query, we store the SQL you submit and the result so it appears in your personal history. We collect nothing else.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white mb-2">How your queries are used</h2>
            <p>Your SQL queries are sent to Groq's API to generate optimization results. They are stored only in your own history and are never shared with other users, sold, or used to train AI models.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white mb-2">Data security</h2>
            <p>All data is stored in Supabase with row-level security. Only you can access your own queries and history. Connections are encrypted in transit.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white mb-2">Deleting your data</h2>
            <p>You can delete individual history entries at any time from the History page. To delete your account and all associated data, contact us and we will remove everything within 7 days.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white mb-2">Contact</h2>
            <p>Questions? Email us at <a href="mailto:team.queryai564@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">team.queryai564@gmail.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
