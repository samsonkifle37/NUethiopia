'use client';

import { ReactNode } from 'react';

interface ProfileSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function ProfileSection({
  title,
  description,
  icon,
  children,
}: ProfileSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-start gap-3">
          {icon && <div className="text-gray-600 mt-1">{icon}</div>}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}
