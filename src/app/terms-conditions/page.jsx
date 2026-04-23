"use client";


import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsConditions() {
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
          <FileText size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight">Terms & Conditions</h1>
        <p className="text-slate-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="glass-card p-8 sm:p-12 border-slate-100 shadow-sm bg-white/70 text-slate-600 font-medium leading-relaxed space-y-8">
        
        <section>
          <p className="text-lg">Please read these Terms and Conditions carefully before using Open16. By accessing or using our platform at www.open16.com, you confirm that you have read, understood, and agree to be bound by these terms. If you do not agree, please discontinue use of the platform immediately.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">1. Acceptance of Terms</h2>
          <p>These Terms and Conditions ("Terms") govern your access to and use of the Open16 personality assessment platform ("Platform," "we," "us," or "our"). These Terms constitute a legally binding agreement between you ("User," "you") and Open16. By using the Platform, you represent that you are at least 13 years of age (or 16 in jurisdictions with higher minimum age requirements) and have the legal capacity to enter into this agreement.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">2. Description of Service</h2>
          <p className="mb-3">Open16 provides a free, web-based personality assessment tool inspired by the Myers-Briggs Type Indicator (MBTI) framework. The Platform presents a series of questions designed to assess psychological preferences in how individuals perceive the world and make decisions, and returns a personality type classification along with a descriptive profile.</p>
          <p>The assessment is offered for personal, informational, and educational purposes only. Open16 is not a licensed psychological testing service and does not provide clinical diagnoses or professional mental health evaluations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">3. Educational & Entertainment Purpose</h2>
          <p className="mb-3">The personality types and descriptions provided by Open16 are for general self-reflection and entertainment purposes only. They are not clinically validated psychological assessments and should not be used as the basis for medical, psychiatric, employment, legal, or any other professional decision-making.</p>
          <p>Open16 makes no representations or warranties regarding the scientific accuracy, completeness, or clinical validity of the assessment results. Personality types are generalizations and do not represent a comprehensive picture of any individual's character, capabilities, or mental health.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">4. User Conduct and Responsibilities</h2>
          <p className="mb-4">By using Open16, you agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the Platform solely for lawful, personal, and non-commercial purposes</li>
            <li>Provide honest and genuine responses to the personality assessment questions</li>
            <li>Refrain from attempting to manipulate, reverse-engineer, or interfere with the Platform's functionality</li>
            <li>Not use automated tools, bots, scrapers, or scripts to access or interact with the Platform</li>
            <li>Not attempt to gain unauthorized access to any part of our systems, servers, or databases</li>
            <li>Not reproduce, distribute, or commercially exploit the assessment content, questions, or results without written permission</li>
            <li>Not use the Platform in any way that could harm, disable, or impair its availability or performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">5. Intellectual Property</h2>
          <p className="mb-4">All content on the Open16 Platform — including but not limited to the test questions, personality type descriptions, written content, graphic elements, logos, and underlying code — is the intellectual property of Open16 or its respective contributors, and is protected by applicable copyright, trademark, and intellectual property laws.</p>
          <p className="mb-4">You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for personal, non-commercial purposes. This license does not include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Any resale or commercial use of the Platform content or materials</li>
            <li>Reproduction or redistribution of test questions, results, or descriptions in any medium</li>
            <li>Creating derivative works based on the assessment framework without explicit written consent</li>
            <li>Framing or embedding any portion of the Platform on third-party websites without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">6. Disclaimer of Warranties</h2>
          <p className="mb-4">The Open16 Platform is provided on an "as is" and "as available" basis, without warranties of any kind — either express or implied. To the fullest extent permitted by applicable law, Open16 expressly disclaims all warranties, including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
            <li>Warranties that the Platform will be uninterrupted, error-free, or free of viruses or harmful components</li>
            <li>Warranties regarding the accuracy, reliability, completeness, or timeliness of any content or results</li>
            <li>Warranties that the assessment results will meet your expectations or requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">7. Limitation of Liability</h2>
          <p className="mb-4">To the maximum extent permitted by law, Open16, its operators, contributors, and hosting providers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Your use of or inability to use the Platform</li>
            <li>Reliance on any test results, personality descriptions, or content provided on the Platform</li>
            <li>Any decisions made based on the results of the personality assessment</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Any bugs, viruses, or technical failures in connection with the Platform</li>
          </ul>
          <p>In jurisdictions that do not allow the exclusion or limitation of liability for certain damages, our liability is limited to the greatest extent permitted by law.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">8. Third-Party Links and Services</h2>
          <p>The Platform may contain links to third-party websites or resources. Open16 does not endorse, control, or assume responsibility for the content, privacy practices, or terms of any third-party services. Your interactions with such services are governed solely by their respective terms and policies. We encourage you to review the terms and privacy policies of any third-party services you access.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">9. Platform Availability and Modifications</h2>
          <p className="mb-3">Open16 reserves the right to modify, suspend, or discontinue any aspect of the Platform at any time, with or without notice. We may update the assessment questions, results framework, descriptions, or user interface without prior notice.</p>
          <p>We do not guarantee continuous, uninterrupted availability of the Platform. Scheduled or unscheduled maintenance, hosting outages, or other factors may result in temporary unavailability. Open16 shall not be liable for any loss or inconvenience arising from such interruptions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">10. Age Restrictions</h2>
          <p>The Platform is not intended for use by individuals under the age of 13. Users between the ages of 13 and 18 should use the Platform with the awareness and guidance of a parent or legal guardian. By using Open16, you affirm that you meet the minimum age requirement applicable in your jurisdiction.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">11. Governing Law</h2>
          <p className="mb-3">These Terms shall be governed by and construed in accordance with applicable international internet law and the laws of the jurisdiction in which Open16 primarily operates. Any disputes arising under these Terms that cannot be resolved amicably shall be subject to the exclusive jurisdiction of the appropriate courts in that jurisdiction.</p>
          <p>If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions shall continue in full force and effect.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">12. Changes to These Terms</h2>
          <p>We reserve the right to revise these Terms at any time. Updated Terms will be posted on this page with a revised effective date. Your continued use of the Platform after any changes constitutes your acceptance of the new Terms. If you do not agree to the revised Terms, you must stop using the Platform.</p>
        </section>

        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">13. Contact Information</h2>
          <p className="mb-4">For questions, concerns, or legal inquiries related to these Terms and Conditions, please contact us:</p>
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
