import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-slate-500 mt-0.5">Last updated: January 1, 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-400 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-white mb-3">1. Information We Collect</h2>
            <p>QueryAI collects only the information necessary to provide you with SQL optimization services. This includes your email address and name when you create an account, and the SQL queries you submit for optimization. We do not collect any personally identifiable information beyond what is strictly required for account management.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>Your information is used exclusively to provide, maintain, and improve the QueryAI service. SQL queries submitted for optimization are processed in real time and stored only to populate your personal query history. We do not use your queries to train AI models or share them with third parties.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">3. Data Storage and Security</h2>
            <p>All data is stored securely using Supabase infrastructure with industry-standard encryption at rest and in transit. Access to your data is protected by row-level security policies — your data is visible only to you.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">4. Third-Party Services</h2>
            <p>QueryAI uses Groq to process SQL optimization requests. Query content is transmitted to Groq's API solely to generate optimization results. Please review <a href="https://groq.com/privacy" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">Groq's privacy policy</a> for details on how they handle data.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">5. Data Retention</h2>
            <p>Your query history is retained for as long as your account is active. You may delete individual history records at any time from the History page. Account deletion removes all associated data permanently.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, use the account settings or contact us directly. We will respond to all legitimate requests within 30 days.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">7. Contact</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <span className="text-blue-400">privacy@queryai.dev</span>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
