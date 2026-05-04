'use client';

import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="text-2xl font-bold text-blue-600">
              GanttFlow
            </div>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/dashboard/projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
              <Link href="/dashboard/gantt" className="text-gray-600 hover:text-gray-900">Gantt View</Link>
              <Link href="/dashboard/team" className="text-gray-600 hover:text-gray-900">Team</Link>
              <Link href="/dashboard/upload" className="text-gray-600 hover:text-gray-900">Upload File</Link>
              <Link href="/dashboard/reports" className="text-gray-600 hover:text-gray-900">Reports</Link>
              <Link href="/dashboard/billing" className="text-gray-600 hover:text-gray-900">Billing</Link>
              <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900">Settings</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
