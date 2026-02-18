'use client';

import Link from 'next/link';
import { ShieldXIcon, ArrowLeftIcon } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldXIcon className="h-8 w-8 text-red-600" />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6 text-sm">
            You don't have permission to access this page. Please contact your administrator 
            if you believe this is an error.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Go to Dashboard
            </Link>
            
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-xs text-gray-500">
          Error 403 - Forbidden Access
        </p>
      </div>
    </div>
  );
}