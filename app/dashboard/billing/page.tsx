'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Download,
  Star,
  Zap,
  Shield,
  Crown,
  ChevronRight
} from 'lucide-react';

// Mock data
const currentPlan = {
  id: 'professional',
  name: 'Professional',
  price: 49,
  interval: 'month',
  features: [
    'Up to 50 projects',
    'Unlimited team members',
    'Advanced Gantt charts',
    'Resource management',
    'Time tracking',
    'Priority support',
    'Custom reports',
    'API access'
  ],
  status: 'active',
  nextBillingDate: '2024-02-15',
  usage: {
    projects: 38,
    teamMembers: 24,
    storage: 68
  }
};

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    interval: 'month',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 10 projects',
      'Up to 5 team members',
      'Basic Gantt charts',
      'Task management',
      'Email support'
    ],
    icon: Star,
    color: 'bg-gray-500',
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    interval: 'month',
    description: 'Ideal for growing teams and businesses',
    features: [
      'Up to 50 projects',
      'Unlimited team members',
      'Advanced Gantt charts',
      'Resource management',
      'Time tracking',
      'Priority support',
      'Custom reports',
      'API access'
    ],
    icon: Zap,
    color: 'bg-blue-500',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    description: 'Complete solution for large organizations',
    features: [
      'Unlimited projects',
      'Unlimited team members',
      'Advanced Gantt charts',
      'Resource management',
      'Time tracking',
      'Dedicated support',
      'Custom reports',
      'API access',
      'SSO integration',
      'Custom branding',
      'Advanced analytics',
      'White-label options'
    ],
    icon: Crown,
    color: 'bg-purple-500',
    popular: false
  }
];

const billingHistory = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Professional Plan - Monthly',
    amount: 49,
    status: 'paid',
    method: 'Credit Card ending in 4242'
  },
  {
    id: '2',
    date: '2023-12-15',
    description: 'Professional Plan - Monthly',
    amount: 49,
    status: 'paid',
    method: 'Credit Card ending in 4242'
  },
  {
    id: '3',
    date: '2023-11-15',
    description: 'Professional Plan - Monthly',
    amount: 49,
    status: 'paid',
    method: 'Credit Card ending in 4242'
  }
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan.id);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const handleUpgradePlan = async (planId: string) => {
    toast({
      title: 'Plan Updated',
      description: 'Your subscription has been updated successfully',
    });
    setSelectedPlan(planId);
  };

  const handleCancelSubscription = async () => {
    toast({
      title: 'Subscription Cancelled',
      description: 'Your subscription will remain active until the end of the billing period',
    });
  };

  const handleUpdatePayment = async () => {
    toast({
      title: 'Payment Method Updated',
      description: 'Your payment method has been updated successfully',
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: 'Invoice Downloaded',
      description: 'Invoice has been downloaded successfully',
    });
  };

  const getPlanIcon = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.icon : CreditCard;
  };

  const getPlanColor = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.color : 'bg-gray-500';
  };

  const getAnnualPrice = (monthlyPrice: number) => {
    return Math.floor(monthlyPrice * 12 * 0.8); // 20% annual discount
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Billing</h1>
              <p className="text-gray-600 font-medium">Manage your subscription and billing</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Current Plan Overview */}
          <Card className="mb-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent flex items-center gap-3">
                    <div className={`w-10 h-10 ${getPlanColor(currentPlan.id)} rounded-xl flex items-center justify-center shadow-lg`}>
                      {(() => {
                        const Icon = getPlanIcon(currentPlan.id);
                        return <Icon className="h-5 w-5 text-white" />;
                      })()}
                    </div>
                    {currentPlan.name} Plan
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    ${currentPlan.price}/{currentPlan.interval} • Next billing on {currentPlan.nextBillingDate}
                  </CardDescription>
                </div>
                <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{currentPlan.usage.projects}</div>
                  <div className="text-sm text-gray-600 font-medium mt-1">Projects Used</div>
                  <div className="w-full bg-gray-200/50 rounded-full h-3 mt-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-lg" 
                      style={{ width: `${(currentPlan.usage.projects / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{currentPlan.usage.teamMembers}</div>
                  <div className="text-sm text-gray-600 font-medium mt-1">Team Members</div>
                  <div className="w-full bg-gray-200/50 rounded-full h-3 mt-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-lg" 
                      style={{ width: `${Math.min((currentPlan.usage.teamMembers / 24) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">{currentPlan.usage.storage}%</div>
                  <div className="text-sm text-gray-600 font-medium mt-1">Storage Used</div>
                  <div className="w-full bg-gray-200/50 rounded-full h-3 mt-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full shadow-lg" 
                      style={{ width: `${currentPlan.usage.storage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Available Plans</h2>
              <div className="flex items-center gap-3">
                <Button
                  variant={billingInterval === 'month' ? 'default' : 'outline'}
                  onClick={() => setBillingInterval('month')}
                  className={billingInterval === 'month' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all'}
                >
                  Monthly
                </Button>
                <Button
                  variant={billingInterval === 'year' ? 'default' : 'outline'}
                  onClick={() => setBillingInterval('year')}
                  className={billingInterval === 'year' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all'}
                >
                  Annual (Save 20%)
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const price = billingInterval === 'year' ? getAnnualPrice(plan.price) : plan.price;
                const interval = billingInterval === 'year' ? 'year' : 'month';
                const isCurrentPlan = plan.id === currentPlan.id;
                const isSelected = plan.id === selectedPlan;

                return (
                  <Card 
                    key={plan.id} 
                    className={`relative bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ${plan.popular ? 'border-blue-500 shadow-xl shadow-blue-500/30' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <div className={`w-14 h-14 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-600 font-medium">{plan.description}</CardDescription>
                      <div className="mt-4">
                        <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                          ${price}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">per {interval}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        variant={isCurrentPlan ? 'outline' : 'default'}
                        onClick={() => handleUpgradePlan(plan.id)}
                        disabled={isCurrentPlan}
                        className={!isCurrentPlan ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all'}
                      >
                        {isCurrentPlan ? 'Current Plan' : billingInterval === 'year' ? 'Upgrade Annual' : 'Upgrade Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Method */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Payment Method</CardTitle>
                <CardDescription className="text-gray-600 font-medium">Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Credit Card</div>
                        <div className="text-sm text-gray-600 font-medium">Visa ending in 4242</div>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500">Default</Badge>
                  </div>
                  <Button onClick={handleUpdatePayment} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30">
                    Update Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Billing History</CardTitle>
                <CardDescription className="text-gray-600 font-medium">View your past invoices and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
                      <div>
                        <div className="font-bold text-gray-900">{invoice.description}</div>
                        <div className="text-sm text-gray-600 font-medium">{invoice.date} • {invoice.method}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${invoice.amount}</span>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          <Card className="mt-8 bg-white/80 backdrop-blur-xl border border-red-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-600">Danger Zone</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Irreversible actions regarding your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200/50 rounded-xl bg-gradient-to-r from-red-50 to-orange-50">
                  <div>
                    <h4 className="font-bold text-gray-900">Cancel Subscription</h4>
                    <p className="text-sm text-gray-600 font-medium">
                      Your subscription will remain active until the end of the billing period
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleCancelSubscription} className="bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-xl transition-all shadow-lg shadow-red-500/30">
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
