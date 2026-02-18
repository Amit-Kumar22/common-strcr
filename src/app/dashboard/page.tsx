'use client';

import { useEffect, useState } from 'react';
import { useAuth, useAuthTokenMonitor } from '@/hooks';
import { Header, Sidebar, PageSection, ClientOnly } from '@/components';
import { ShoppingBagIcon, UsersIcon, TruckIcon, DollarSignIcon } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Monitor token expiration
  useAuthTokenMonitor();

  return (
    <ClientOnly 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </ClientOnly>
  );
}

function DashboardContent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please login to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Sales',
      value: '$24,500',
      change: '+12.5%',
      icon: DollarSignIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Products',
      value: '1,234',
      change: '+8.2%',
      icon: ShoppingBagIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Orders',
      value: '567',
      change: '+15.3%',
      icon: TruckIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Customers',
      value: '892',
      change: '+5.7%',
      icon: UsersIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your business today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <span className="text-xs font-medium text-green-600">{stat.change}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <PageSection
                title="Recent Orders"
                subtitle="Latest customer orders"
                className="h-fit"
              >
                <div className="space-y-3">
                  {[
                    { id: '#1234', customer: 'John Doe', amount: '$125.00', status: 'Completed' },
                    { id: '#1235', customer: 'Jane Smith', amount: '$89.50', status: 'Processing' },
                    { id: '#1236', customer: 'Mike Johnson', amount: '$245.75', status: 'Shipped' },
                  ].map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.id}</p>
                        <p className="text-xs text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">{order.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </PageSection>

              {/* Quick Actions */}
              <PageSection
                title="Quick Actions"
                subtitle="Common tasks and shortcuts"
                className="h-fit"
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: 'Add Product', icon: ShoppingBagIcon, color: 'bg-blue-600' },
                    { title: 'View Orders', icon: TruckIcon, color: 'bg-green-600' },
                    { title: 'Manage Users', icon: UsersIcon, color: 'bg-purple-600' },
                    { title: 'Reports', icon: DollarSignIcon, color: 'bg-orange-600' },
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className={`p-3 rounded-lg ${action.color} mb-3 mx-auto w-fit group-hover:scale-105 transition-transform`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{action.title}</p>
                      </button>
                    );
                  })}
                </div>
              </PageSection>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}