'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  FileSpreadsheet,
  FileImage,
  FileText,
  Mail,
  Share2,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Mock data
const mockReports = [
  {
    id: '1',
    name: 'Q4 2024 Progress Report',
    type: 'progress',
    generatedAt: '2024-01-15T10:30:00Z',
    status: 'completed',
    summary: {
      overallProgress: 78,
      tasksCompleted: 145,
      tasksInProgress: 42,
      budgetUsed: 68,
      issues: 2
    },
    fileUrl: '/reports/q4-2024-progress.pdf',
    fileSize: '2.4 MB'
  },
  {
    id: '2',
    name: 'Financial Analysis 2024',
    type: 'financial',
    generatedAt: '2024-01-14T14:22:00Z',
    status: 'completed',
    summary: {
      overallProgress: 82,
      tasksCompleted: 168,
      tasksInProgress: 38,
      budgetUsed: 71,
      issues: 1
    },
    fileUrl: '/reports/financial-analysis-2024.xlsx',
    fileSize: '1.8 MB'
  },
  {
    id: '3',
    name: 'Resource Utilization Report',
    type: 'resource',
    generatedAt: '2024-01-13T09:15:00Z',
    status: 'completed',
    summary: {
      overallProgress: 75,
      tasksCompleted: 132,
      tasksInProgress: 51,
      budgetUsed: 65,
      issues: 3
    },
    fileUrl: '/reports/resource-utilization.pdf',
    fileSize: '3.1 MB'
  }
];

const reportTypes = [
  { id: 'progress', name: 'Progress Report', icon: BarChart3, description: 'Project progress and milestones' },
  { id: 'financial', name: 'Financial Report', icon: DollarSign, description: 'Budget and cost analysis' },
  { id: 'resource', name: 'Resource Report', icon: Users, description: 'Team workload and availability' },
  { id: 'timeline', name: 'Timeline Report', icon: Clock, description: 'Project schedules and deadlines' },
  { id: 'risk', name: 'Risk Assessment', icon: TrendingUp, description: 'Project risks and mitigation' }
];

const exportFormats = [
  { id: 'pdf', name: 'PDF', icon: FileText, description: 'Best for sharing and printing' },
  { id: 'excel', name: 'Excel', icon: FileSpreadsheet, description: 'For data analysis' },
  { id: 'png', name: 'PNG', icon: FileImage, description: 'For presentations' }
];

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [selectedReportType, setSelectedReportType] = useState('progress');
  const [dateRange, setDateRange] = useState('month');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport = {
      id: `report-${Date.now()}`,
      name: `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type: selectedReportType,
      generatedAt: new Date().toISOString(),
      status: 'completed',
      summary: {
        overallProgress: Math.floor(Math.random() * 30) + 70,
        tasksCompleted: Math.floor(Math.random() * 50) + 120,
        tasksInProgress: Math.floor(Math.random() * 20) + 30,
        budgetUsed: Math.floor(Math.random() * 20) + 60,
        issues: Math.floor(Math.random() * 3) + 1
      },
      fileUrl: `/reports/${selectedReportType}-${Date.now()}.${selectedFormat}`,
      fileSize: selectedFormat === 'pdf' ? '2.4 MB' : selectedFormat === 'excel' ? '1.8 MB' : '3.1 MB'
    };

    setReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
    
    toast({
      title: 'Report Generated',
      description: `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} report has been generated successfully`,
    });
  };

  const handleDownloadReport = (report: any) => {
    toast({
      title: 'Download Started',
      description: `Downloading ${report.name}`,
    });
  };

  const handleShareReport = (report: any) => {
    toast({
      title: 'Report Shared',
      description: `Report has been shared successfully`,
    });
  };

  const handleEmailReport = (report: any) => {
    if (!emailRecipient) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter an email address',
      });
      return;
    }
    
    toast({
      title: 'Report Sent',
      description: `Report has been sent to ${emailRecipient}`,
    });
    setEmailRecipient('');
  };

  const getReportIcon = (type: string) => {
    const reportType = reportTypes.find(t => t.id === type);
    return reportType ? reportType.icon : FileText;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'generating':
        return <Badge variant="secondary">Generating</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Reports</h1>
                <p className="text-gray-600 font-medium">Generate and manage project reports</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button onClick={handleGenerateReport} disabled={isGenerating} className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2">
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Generation */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Generate New Report</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">Choose report type and parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Report Type Selection */}
                    <div>
                      <Label className="text-sm font-bold text-gray-700">Report Type</Label>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        {reportTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.id}
                              onClick={() => setSelectedReportType(type.id)}
                              className={`p-5 border rounded-2xl text-left transition-all duration-300 ${
                                selectedReportType === type.id
                                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-500/30'
                                  : 'border-gray-200/50 bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-400 hover:shadow-lg'
                              }`}
                            >
                              <div className={`w-12 h-12 ${selectedReportType === type.id ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gradient-to-br from-blue-100 to-purple-100'} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                                <Icon className={`h-6 w-6 ${selectedReportType === type.id ? 'text-white' : 'text-blue-600'}`} />
                              </div>
                              <h3 className="font-bold text-gray-900 text-sm">{type.name}</h3>
                              <p className="text-xs text-gray-600 font-medium mt-1">{type.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date Range */}
                    <div>
                      <Label className="text-sm font-bold text-gray-700">Date Range</Label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200/50 rounded-xl mt-2 bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    {/* Export Format */}
                    <div>
                      <Label className="text-sm font-bold text-gray-700">Export Format</Label>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        {exportFormats.map((format) => (
                          <button
                            key={format.id}
                            onClick={() => setSelectedFormat(format.id)}
                            className={`p-4 border rounded-2xl text-center transition-all duration-300 ${
                              selectedFormat === format.id
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-500/30'
                                : 'border-gray-200/50 bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-400 hover:shadow-lg'
                            }`}
                          >
                            <div className={`w-10 h-10 ${selectedFormat === format.id ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gradient-to-br from-blue-100 to-purple-100'} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                              <format.icon className={`h-5 w-5 ${selectedFormat === format.id ? 'text-white' : 'text-blue-600'}`} />
                            </div>
                            <h3 className="font-bold text-gray-900 text-xs">{format.name}</h3>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card className="mt-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Recent Reports</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">Your recently generated reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map((report) => {
                      const Icon = getReportIcon(report.type);
                      return (
                        <div key={report.id} className="flex items-center justify-between p-5 border border-gray-200/50 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                              <Icon className="h-7 w-7 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 text-lg">{report.name}</h3>
                                {getStatusBadge(report.status)}
                              </div>
                              <p className="text-sm text-gray-600 font-medium">
                                Generated {new Date(report.generatedAt).toLocaleDateString()} • {report.fileSize}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
                                <span>{report.summary.tasksCompleted} tasks</span>
                                <span>•</span>
                                <span>{report.summary.overallProgress}% progress</span>
                                <span>•</span>
                                <span>{report.summary.budgetUsed}% budget</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadReport(report)}
                              className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShareReport(report)}
                              className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all"
                            >
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Email Report */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Report
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    Send reports directly to stakeholders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="stakeholder@example.com"
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30" 
                      onClick={() => handleEmailReport(reports[0])}
                      disabled={!emailRecipient || reports.length === 0}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Latest Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Report Templates */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Report Templates</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    Quick access to common report types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <FileText className="h-4 w-4 mr-2" />
                      Monthly Progress Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Budget Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Users className="h-4 w-4 mr-2" />
                      Resource Utilization
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Clock className="h-4 w-4 mr-2" />
                      Project Timeline
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduled Reports */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Scheduled Reports</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    Automated report generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Weekly Progress</h4>
                        <p className="text-sm text-gray-600 font-medium">Every Monday at 9:00 AM</p>
                      </div>
                      <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Monthly Summary</h4>
                        <p className="text-sm text-gray-600 font-medium">1st of each month</p>
                      </div>
                      <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500">Active</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-3 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Report Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <span className="text-sm text-gray-600 font-medium">Total Reports</span>
                      <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{reports.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <span className="text-sm text-gray-600 font-medium">This Month</span>
                      <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <span className="text-sm text-gray-600 font-medium">Shared Reports</span>
                      <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">8</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <span className="text-sm text-gray-600 font-medium">Scheduled</span>
                      <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
