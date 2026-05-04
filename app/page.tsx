import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, FileSpreadsheet, BarChart3, Shield, Zap, Users, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-b from-blue-50 to-white">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">GanttFlow</div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Upload a spreadsheet.<br />
            Get a professional Gantt chart.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your Excel project data into beautiful, interactive Gantt charts in seconds. Perfect for construction managers and project teams.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard/projects/new">
              <Button size="lg">
                Create Project
                <ArrowRight className="h-5 w-5 mr-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                <Play className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Download Template</h3>
              <p className="text-gray-600">
                Get our pre-formatted Excel template with all the columns you need
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Fill Your Data</h3>
              <p className="text-gray-600">
                Add your tasks, dates, dependencies, and resources to the spreadsheet
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Upload & Visualize</h3>
              <p className="text-gray-600">
                Upload your file and instantly get a beautiful, interactive Gantt chart
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Interactive Charts',
                description: 'Drag, resize, and edit tasks directly on the Gantt chart',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your data is encrypted and stored securely',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Generate charts in seconds, not hours',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Share your charts with stakeholders via public links',
              },
              {
                icon: FileSpreadsheet,
                title: 'Excel Integration',
                description: 'Works seamlessly with .xlsx and .xls files',
              },
              {
                icon: Check,
                title: 'Export Options',
                description: 'Download your charts as PDF or PNG images',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
                <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Start free, upgrade when you need more
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: [
                  '3 Projects',
                  '20 Tasks per project',
                  '5 Exports per month',
                  'Basic support',
                ],
                cta: 'Get Started',
              },
              {
                name: 'Pro',
                price: '$19',
                period: '/month',
                features: [
                  '25 Projects',
                  '200 Tasks per project',
                  '50 Exports per month',
                  'Public share links',
                  'Custom colors',
                  'Priority support',
                ],
                cta: 'Upgrade to Pro',
                popular: true,
              },
              {
                name: 'Business',
                price: '$49',
                period: '/month',
                features: [
                  'Unlimited Projects',
                  '500 Tasks per project',
                  'Unlimited Exports',
                  'Public share links',
                  'Custom colors',
                  'Priority support',
                ],
                cta: 'Contact Sales',
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-lg border-2 ${
                  plan.popular ? 'border-blue-600 relative' : 'border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your project management?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of construction managers using GanttFlow
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold text-white">GanttFlow</div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <div className="text-sm">
              © 2024 GanttFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
