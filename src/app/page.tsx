'use client';

import Link from 'next/link';
import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from 'lucide-react';
import { useAuth } from '@/hooks';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Modern E-commerce
              <span className="block text-blue-600">Built for Scale</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12">
              Production-ready Next.js architecture with TypeScript, Tailwind CSS, 
              Redux Toolkit, and enterprise-grade authentication.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-300 shadow-lg"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for Modern Applications
          </h2>
          <p className="text-xl text-gray-600">
            Scalable architecture for e-commerce and food delivery platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* E-commerce Feature */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              E-commerce Ready
            </h3>
            <p className="text-gray-600">
              Complete shopping cart, product catalog, order management, 
              and payment integration ready to use.
            </p>
          </div>

          {/* Food Delivery Feature */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <TruckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Food Delivery
            </h3>
            <p className="text-gray-600">
              Location-based services, real-time tracking, restaurant management,
              and delivery optimization features.
            </p>
          </div>

          {/* Security Feature */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Enterprise Security
            </h3>
            <p className="text-gray-600">
              JWT authentication, role-based access control, automatic token refresh,
              and secure session management.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Production-Ready Tech Stack
            </h2>
            <p className="text-gray-600">
              Modern technologies chosen for performance, scalability, and developer experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'Next.js 15',
              'TypeScript Strict',
              'Tailwind CSS',
              'Redux Toolkit',
              'RTK Query',
              'JWT Auth',
              'Middleware Protection',
              'Responsive Design'
            ].map((tech) => (
              <div key={tech} className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-2">
                  <span className="text-sm font-medium text-gray-900">{tech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-400">
              © 2026 HiproTech. Built with Next.js, TypeScript, and modern best practices.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
