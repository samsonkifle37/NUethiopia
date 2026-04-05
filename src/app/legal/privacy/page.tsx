'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="prose prose-sm sm:prose max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
            <p className="text-gray-700 mt-3">
              NU ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our mobile application and website.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                <p className="text-gray-700 mt-2">
                  We collect information you voluntarily provide, including name, email, phone number, and profile data.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">Automatically Collected Information</h3>
                <p className="text-gray-700 mt-2">
                  When you access the Application, we automatically collect device information, log data, and usage patterns.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            <p className="text-gray-700 mt-3">We use information to provide services, process transactions, send communications, and improve the Application.</p>
          </section>

          {/* Disclosure */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">4. Disclosure of Your Information</h2>
            <p className="text-gray-700 mt-3">
              We may share information with service providers, when required by law, or with your consent.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
            <p className="text-gray-700 mt-3">
              We implement appropriate measures to protect your personal information. However, no method is 100% secure.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">6. Contact Us</h2>
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
