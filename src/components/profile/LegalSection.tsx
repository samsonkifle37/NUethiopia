'use client';

import Link from 'next/link';
import { Shield, FileText } from 'lucide-react';
import { ProfileSection } from './ProfileSection';

export function LegalSection() {
  return (
    <ProfileSection
      title="Legal & Privacy"
      description="View our policies and agreements"
      icon={<Shield className="w-5 h-5" />}
    >
      <div className="space-y-3">
        <Link
          href="/legal/privacy"
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Privacy Policy</p>
              <p className="text-xs text-gray-600">Last updated April 2026</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </Link>

        <Link
          href="/legal/terms"
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Terms of Service</p>
              <p className="text-xs text-gray-600">Last updated April 2026</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </Link>
      </div>
    </ProfileSection>
  );
}
