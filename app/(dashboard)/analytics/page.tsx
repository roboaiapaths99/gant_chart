'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectProgressChart } from '@/components/charts/ProjectProgressChart';
import { ResourceUtilizationChart } from '@/components/charts/ResourceUtilizationChart';
import { BudgetAnalysisChart } from '@/components/charts/BudgetAnalysisChart';
import { TaskTimelineChart } from '@/components/charts/TaskTimelineChart';
import { mockProjects, mockResources, getDashboardStats } from '@/lib/mock-data';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats, setStats] = useState(getDashboardStats());

  // Prepare chart data
  const projectProgressData = mockProjects.map(project => ({
    name: project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name,
    progress: project.progress,
    budget: project.budget,
    status: project.status
  }));

  const resourceUtilizationData = mockResources.map(resource => ({
    name: resource.name,
    utilization: resource.utilization,
    color: {
      'Civil Crew': '#6B7280',
      'Steel fixers': '#1E40AF',
      'Concrete team': '#D97706',
      'Formwork+Steel': '#7C3AED',
      'Management': '#059669'
    }[resource.name] || '#6B7280',
    totalTasks: resource.currentProjects,
    completedTasks: Math.floor(resource.currentProjects * (resource.utilization / 100))
  }));

  const budgetData = [
    { month: 'Jan', planned: 12000000, actual: 11500000, variance: -4.2 },
    { month: 'Feb', planned: 15000000, actual: 15800000, variance: 5.3 },
    { month: 'Mar', planned: 18000000, actual: 17200000, variance: -4.4 },
    { month: 'Apr', planned: 22000000, actual: 23500000, variance: 6.8 },
    { month: 'May', planned: 25000000, actual: 24800000, variance: -0.8 },
    { month: 'Jun', planned: 28000000, actual: 0, variance: 0 }
  ];

  const taskTimelineData = [
    { date: 'Jan 1', completed: 12, inProgress: 8, notStarted: 25, total: 45 },
    { date: 'Jan 15', completed: 18, inProgress: 12, notStarted: 20, total: 50 },
    { date: 'Feb 1', completed: 25, inProgress: 15, notStarted: 18, total: 58 },
    { date: 'Feb 15', completed: 32, inProgress: 18, notStarted: 15, total: 65 },
    { date: 'Mar 1', completed: 38, inProgress: 20, notStarted: 12, total: 70 },
    { date: 'Mar 15', completed: 45, inProgress: 22, notStarted: 10, total: 77 },
    { date: 'Apr 1', completed: 52, inProgress: 25, notStarted: 8, total: 85 },
    { date: 'Apr 15', completed: 58, inProgress: 27, notStarted: 6, total: 91 },
    { date: 'May 1', completed: 65, inProgress: 28, notStarted: 5, total: 98 }
  ];

  interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    color: string;
  }

  const StatCard = ({ title, value, change, icon: Icon, color }: StatCardProps) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                {change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          change={12.5}
          icon={BarChart3}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Budget"
          value={`$${(stats.totalBudget / 1000000).toFixed(1)}M`}
          change={8.2}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Active Tasks"
          value={stats.activeTasks}
          change={-3.1}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%`}
          change={5.7}
          icon={CheckCircle}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Progress Overview
            </CardTitle>
            <CardDescription>
              Current progress status across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectProgressChart data={projectProgressData} />
          </CardContent>
        </Card>

        {/* Resource Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Resource Utilization
            </CardTitle>
            <CardDescription>
              Team workload and capacity utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResourceUtilizationChart data={resourceUtilizationData} />
          </CardContent>
        </Card>

        {/* Budget Analysis Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget vs Actual Spending
            </CardTitle>
            <CardDescription>
              Planned vs actual expenditure over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetAnalysisChart data={budgetData} />
          </CardContent>
        </Card>

        {/* Task Timeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Task Completion Timeline
            </CardTitle>
            <CardDescription>
              Task status progression over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskTimelineChart data={taskTimelineData} />
          </CardContent>
        </Card>
      </div>

      {/* Project Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Status Summary</CardTitle>
          <CardDescription>
            Overview of all projects and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Budget: ${(project.budget / 1000000).toFixed(1)}M</span>
                    <span>Tasks: {project.tasks.length}</span>
                    <span>Progress: {project.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {project.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Performance</CardTitle>
          <CardDescription>
            Detailed performance metrics for all resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Resource</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Utilization</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Active Projects</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Team Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Hourly Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockResources.map((resource) => (
                  <tr key={resource.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: {
                            'Civil Crew': '#6B7280',
                            'Steel fixers': '#1E40AF',
                            'Concrete team': '#D97706',
                            'Formwork+Steel': '#7C3AED',
                            'Management': '#059669'
                          }[resource.name] || '#6B7280' }}
                        ></div>
                        {resource.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                resource.utilization > 80 ? 'bg-red-500' : 
                                resource.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${resource.utilization}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-gray-900">{resource.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{resource.currentProjects}</td>
                    <td className="py-3 px-4">{resource.totalMembers}</td>
                    <td className="py-3 px-4">${resource.hourlyRate}/hr</td>
                    <td className="py-3 px-4">
                      <Badge variant={resource.utilization > 80 ? 'destructive' : 'default'}>
                        {resource.utilization > 80 ? 'Overloaded' : 'Available'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
