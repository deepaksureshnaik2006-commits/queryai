import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Terms of Service</h1>
            <p className="text-sm text-slate-500 mt-0.5">Last updated: January 1, 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-400 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using QueryAI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service. These terms apply to all users of the platform.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">2. Use of the Service</h2>
            <p>QueryAI is provided for lawful purposes only. You agree not to submit SQL queries that expose, exfiltrate, or manipulate production data without authorization. You are solely responsible for the SQL queries you submit and any resulting database changes you apply.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">3. Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. QueryAI is not liable for any loss or damage arising from unauthorized access to your account. Please notify us immediately if you suspect unauthorized use.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">4. Service Availability</h2>
            <p>QueryAI is provided on an "as-is" basis. We make no guarantees of uptime or availability. We reserve the right to modify, suspend, or discontinue the service at any time with reasonable notice.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>The QueryAI platform, including its design, code, and branding, is the intellectual property of QueryAI. The SQL optimization results generated for your queries belong to you. You grant QueryAI no license to your proprietary SQL schema or data.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>QueryAI provides optimization suggestions for informational purposes. You are solely responsible for reviewing, testing, and applying any changes to your database. QueryAI is not liable for any data loss, performance degradation, or system damage resulting from applying AI-generated query suggestions.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">7. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of material changes via email or in-app notification.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">8. Contact</h2>
            <p>Questions about these Terms of Service? Contact us at <span className="text-blue-400">team.queryai564@gmail.com</span>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
