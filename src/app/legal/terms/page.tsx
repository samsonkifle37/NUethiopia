'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  const lastUpdated = 'April 2026';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="prose prose-sm sm:prose max-w-none space-y-8">
          {/* Agreement to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
            <p className="text-gray-700 mt-3">
              By accessing and using NU ("Application"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Application.
            </p>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
            <p className="text-gray-700 mt-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on NU for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the Application</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">3. Disclaimer</h2>
            <p className="text-gray-700 mt-3">
              The materials on NU are provided on an 'as is' basis. NU makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          {/* Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">4. Limitations</h2>
            <p className="text-gray-700 mt-3">
              In no event shall NU or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NU, even if NU or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Accuracy of Materials */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">5. Accuracy of Materials</h2>
            <p className="text-gray-700 mt-3">
              The materials appearing on NU could include technical, typographical, or photographic errors. NU does not warrant that any of the materials on NU are accurate, complete, or current. NU may make changes to the materials contained on NU at any time without notice.
            </p>
          </section>

          {/* Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">6. Links</h2>
            <p className="text-gray-700 mt-3">
              NU has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by NU of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">7. Modifications</h2>
            <p className="text-gray-700 mt-3">
              NU may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">8. Governing Law</h2>
            <p className="text-gray-700 mt-3">
              These terms and conditions are governed by and construed in accordance with the laws of Ethiopia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">9. User-Generated Content</h2>
            <p className="text-gray-700 mt-3">
              By submitting content to NU (reviews, photos, comments, etc.), you grant NU a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute such content.
            </p>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">10. Prohibited Activities</h2>
            <p className="text-gray-700 mt-3">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
              <li>Harassing or causing distress or inconvenience to any person</li>
              <li>Offensive comments related to race, religion, or ethnicity</li>
              <li>Disrupting the normal flow of dialogue within the Application</li>
              <li>Posting obscene or adult content</li>
              <li>Commercial solicitation</li>
              <li>Any illegal activity</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">11. Termination of Service</h2>
            <p className="text-gray-700 mt-3">
              NU reserves the right to terminate your account and access to the Application at any time, in its sole discretion, for any reason including violation of these Terms of Service.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">12. Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-gray-900 font-semibold">NU Support Team</p>
              <p className="text-gray-700">Email: nuethiopia2026@gmail.com</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
