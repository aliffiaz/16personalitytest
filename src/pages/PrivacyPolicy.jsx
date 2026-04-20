import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 sm:py-12 px-4"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600 mb-6">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="glass-card p-8 sm:p-12 border-slate-100 shadow-sm bg-white/70 text-slate-600 font-medium leading-relaxed space-y-8">
        
        <section>
          <p className="text-lg">Your privacy is important to us. This Privacy Policy explains what information Open16 collects when you use our personality assessment platform, how we use it, and your rights regarding that information. By using Open16, you agree to the practices described in this policy.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">1. Who We Are</h2>
          <p>Open16 is a free, open-access online platform that provides a Myers-Briggs Type Indicator (MBTI)-inspired 16 personality type assessment. The platform is designed to offer self-insight tools to users worldwide. Open16 operates as an independent project hosted.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">2. Information We Collect</h2>
          <p className="mb-4">We are committed to collecting only the minimum information necessary to deliver our services. The information we collect falls into the following categories:</p>
          
          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">2.1 Information You Provide Voluntarily</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Responses to personality test questions and questionnaire items submitted during the assessment</li>
            <li>Any optional feedback, comments, or survey responses you choose to submit</li>
            <li>Contact information (such as name or email address) if you reach out to us directly</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">2.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Browser type, version, and operating system</li>
            <li>IP address and approximate geographic location (country or region level)</li>
            <li>Pages visited, time spent, and interaction patterns within the platform</li>
            <li>Referring URLs and session identifiers</li>
            <li>Device type (desktop, mobile, tablet) and screen resolution</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">2.3 Cookies and Local Storage</h3>
          <p>Open16 may use browser cookies, session storage, or local storage to temporarily retain your test progress or results within a single session. We do not use persistent tracking cookies for advertising purposes. You may disable cookies through your browser settings; however, this may affect your ability to complete the test.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">Open16 uses the information collected solely for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To generate and display your personality type result and associated description</li>
            <li>To maintain and improve the quality, accuracy, and performance of the assessment</li>
            <li>To understand aggregate usage patterns and improve user experience</li>
            <li>To diagnose and resolve technical issues affecting the platform</li>
            <li>To comply with applicable legal obligations</li>
            <li>To respond to your inquiries or support requests</li>
          </ul>
          <p className="mt-4 font-bold text-slate-800">We do not sell, rent, trade, or otherwise transfer your personal information to third parties for marketing or commercial purposes, under any circumstances.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">4. Psychological & Sensitive Data</h2>
          <p className="mb-3">The responses you submit during the personality test may constitute psychological or sensitive personal data, as they reflect aspects of your personality, cognition, and behavioral tendencies. Open16 treats such data with the highest standard of care.</p>
          <p className="mb-3">We do not use your test responses to make any legally significant decisions about you, and we do not share individual response data with employers, third-party institutions, healthcare providers, or government agencies.</p>
          <p>Aggregate, anonymized data may be used for research purposes to improve the reliability and validity of the assessment instrument.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">5. Data Sharing and Third Parties</h2>
          <p className="mb-4">We may disclose information only in the following limited circumstances:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>When required by law, court order, or enforceable governmental request</li>
            <li>To protect the rights, property, or safety of Open16, our users, or the public</li>
            <li>In connection with a merger, acquisition, or sale of assets, in which case users will be notified</li>
          </ul>
          <p className="mt-4 font-bold text-slate-800">No analytics, advertising, or data-brokerage third parties are given access to your individual test data or personal information without your explicit consent.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">6. Data Retention</h2>
          <p className="mb-3">Test responses and results are primarily processed in-session and are not persistently stored on our servers beyond the duration required to generate your result. Anonymized or aggregated data may be retained indefinitely for research and platform improvement purposes.</p>
          <p>Any personal data you provide through direct communication (e.g., email) is retained only as long as necessary to address your request and is then securely deleted.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">7. Your Rights</h2>
          <p className="mb-4">Depending on your jurisdiction, you may have the following rights with respect to your personal data:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><span className="font-bold text-slate-800">Right of Access</span> — to request a copy of personal data we hold about you</li>
            <li><span className="font-bold text-slate-800">Right to Rectification</span> — to request correction of inaccurate data</li>
            <li><span className="font-bold text-slate-800">Right to Erasure</span> — to request deletion of your personal data</li>
            <li><span className="font-bold text-slate-800">Right to Restriction</span> — to limit the processing of your data in certain circumstances</li>
            <li><span className="font-bold text-slate-800">Right to Data Portability</span> — to receive your data in a machine-readable format</li>
            <li><span className="font-bold text-slate-800">Right to Object</span> — to object to processing based on legitimate interests</li>
            <li><span className="font-bold text-slate-800">Right to Withdraw Consent</span> — to withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p>To exercise any of these rights, please contact us using the details provided below. We will respond to your request within 30 days.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">8. Children's Privacy</h2>
          <p>Open16 is not directed at children under the age of 13 (or 16 in applicable jurisdictions, including the European Union). We do not knowingly collect personal information from minors. If you are a parent or guardian and believe your child has submitted personal information through our platform, please contact us immediately and we will promptly delete such data.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">9. Security</h2>
          <p className="mb-3">We take reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction. These measures include secure HTTPS transmission, infrastructure-level security provided, and limiting internal access to data.</p>
          <p>However, no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">10. Changes to This Policy</h2>
          <p>We reserve the right to update this Privacy Policy at any time. When we do, the revised date at the top of this page will be updated. We encourage you to review this policy periodically. Continued use of the platform following any update constitutes your acceptance of the revised policy.</p>
        </section>

        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">11. Contact Us</h2>
          <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please reach out to us:</p>
          <ul className="space-y-2 text-slate-600">
            <li><span className="font-bold text-slate-900">Platform:</span> Open16</li>
            <li><span className="font-bold text-slate-900">Website:</span> www.open16.com</li>
            <li><span className="font-bold text-slate-900">Contact:</span> +91 808 666 2026</li>
            <li><span className="font-bold text-slate-900">Address:</span> Finlytyx AI Labs Pvt Ltd. HiLITE Platino, 1st Floor, Shankar Nagar - off NH66, Kannadikadu, Ernakulam, Kerala. PIN 682304.</li>
          </ul>
        </section>

      </div>
    </motion.div>
  );
}
