// Comprehensive mock data for GanttFlow application

export const mockProjects = [
  {
    id: 'proj-1',
    name: 'Skyline Tower Construction',
    description: '25-story commercial building with mixed-use spaces',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-05-01T10:30:00Z',
    isPublic: true,
    shareToken: 'share-abc123',
    status: 'active',
    budget: 25000000,
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    location: 'Downtown Business District',
    client: 'Metro Development Corp',
    progress: 42,
    tasks: [
      {
        id: 1,
        taskId: 1,
        taskName: 'Site Preparation & Excavation',
        duration: 15,
        startDate: '2026-03-01',
        endDate: '2026-03-15',
        predecessors: '',
        resourceNames: 'Civil Crew',
        progress: 100,
        cost: 450000,
        priority: 'high'
      },
      {
        id: 2,
        taskId: 2,
        taskName: 'Foundation Work',
        duration: 20,
        startDate: '2026-03-16',
        endDate: '2026-04-04',
        predecessors: '1',
        resourceNames: 'Civil Crew',
        progress: 100,
        cost: 1200000,
        priority: 'high'
      },
      {
        id: 3,
        taskId: 3,
        taskName: 'Steel Structure - Ground Floor',
        duration: 18,
        startDate: '2026-04-05',
        endDate: '2026-04-22',
        predecessors: '2',
        resourceNames: 'Steel fixers',
        progress: 100,
        cost: 680000,
        priority: 'high'
      },
      {
        id: 4,
        taskId: 4,
        taskName: 'Steel Structure - Upper Floors',
        duration: 45,
        startDate: '2026-04-23',
        endDate: '2026-06-06',
        predecessors: '3',
        resourceNames: 'Steel fixers',
        progress: 75,
        cost: 2100000,
        priority: 'high'
      },
      {
        id: 5,
        taskId: 5,
        taskName: 'Concrete Work - Floors 1-5',
        duration: 30,
        startDate: '2026-05-01',
        endDate: '2026-05-30',
        predecessors: '3',
        resourceNames: 'Concrete team',
        progress: 60,
        cost: 1500000,
        priority: 'medium'
      },
      {
        id: 6,
        taskId: 6,
        taskName: 'Formwork & Steel Reinforcement',
        duration: 25,
        startDate: '2026-05-15',
        endDate: '2026-06-08',
        predecessors: '4',
        resourceNames: 'Formwork+Steel',
        progress: 40,
        cost: 890000,
        priority: 'medium'
      },
      {
        id: 7,
        taskId: 7,
        taskName: 'MEP Installation - Lower Floors',
        duration: 35,
        startDate: '2026-06-01',
        endDate: '2026-07-05',
        predecessors: '5',
        resourceNames: 'Management',
        progress: 20,
        cost: 1800000,
        priority: 'medium'
      },
      {
        id: 8,
        taskId: 8,
        taskName: 'Exterior Glass Curtain Wall',
        duration: 40,
        startDate: '2026-06-15',
        endDate: '2026-07-24',
        predecessors: '4',
        resourceNames: 'Formwork+Steel',
        progress: 10,
        cost: 3200000,
        priority: 'medium'
      },
      {
        id: 9,
        taskId: 9,
        taskName: 'Interior Finishing - Lower Floors',
        duration: 45,
        startDate: '2026-07-10',
        endDate: '2026-08-23',
        predecessors: '7',
        resourceNames: 'Management',
        progress: 0,
        cost: 2400000,
        priority: 'low'
      },
      {
        id: 10,
        taskId: 10,
        taskName: 'Roofing & Waterproofing',
        duration: 20,
        startDate: '2026-07-20',
        endDate: '2026-08-08',
        predecessors: '8',
        resourceNames: 'Civil Crew',
        progress: 0,
        cost: 650000,
        priority: 'medium'
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Highway Bridge Expansion',
    description: 'Widening and strengthening of existing highway bridge',
    createdAt: '2026-02-10T09:15:00Z',
    updatedAt: '2026-04-28T14:20:00Z',
    isPublic: false,
    shareToken: null,
    status: 'active',
    budget: 8500000,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    location: 'Interstate 95 - Mile Marker 42',
    client: 'State Transportation Authority',
    progress: 35,
    tasks: [
      {
        id: 11,
        taskId: 1,
        taskName: 'Traffic Management Setup',
        duration: 7,
        startDate: '2026-04-01',
        endDate: '2026-04-07',
        predecessors: '',
        resourceNames: 'Management',
        progress: 100,
        cost: 120000,
        priority: 'high'
      },
      {
        id: 12,
        taskId: 2,
        taskName: 'Demolition of Existing Structures',
        duration: 14,
        startDate: '2026-04-08',
        endDate: '2026-04-21',
        predecessors: '1',
        resourceNames: 'Civil Crew',
        progress: 100,
        cost: 380000,
        priority: 'high'
      },
      {
        id: 13,
        taskId: 3,
        taskName: 'Foundation Strengthening',
        duration: 21,
        startDate: '2026-04-22',
        endDate: '2026-05-12',
        predecessors: '2',
        resourceNames: 'Concrete team',
        progress: 90,
        cost: 920000,
        priority: 'high'
      },
      {
        id: 14,
        taskId: 4,
        taskName: 'Steel Beam Installation',
        duration: 28,
        startDate: '2026-05-13',
        endDate: '2026-06-09',
        predecessors: '3',
        resourceNames: 'Steel fixers',
        progress: 45,
        cost: 1450000,
        priority: 'high'
      },
      {
        id: 15,
        taskId: 5,
        taskName: 'Bridge Deck Construction',
        duration: 25,
        startDate: '2026-06-10',
        endDate: '2026-07-04',
        predecessors: '4',
        resourceNames: 'Concrete team',
        progress: 20,
        cost: 1100000,
        priority: 'medium'
      },
      {
        id: 16,
        taskId: 6,
        taskName: 'Safety Barrier Installation',
        duration: 14,
        startDate: '2026-07-05',
        endDate: '2026-07-18',
        predecessors: '5',
        resourceNames: 'Formwork+Steel',
        progress: 0,
        cost: 340000,
        priority: 'medium'
      },
      {
        id: 17,
        taskId: 7,
        taskName: 'Road Surface Paving',
        duration: 10,
        startDate: '2026-07-19',
        endDate: '2026-07-28',
        predecessors: '6',
        resourceNames: 'Civil Crew',
        progress: 0,
        cost: 280000,
        priority: 'medium'
      },
      {
        id: 18,
        taskId: 8,
        taskName: 'Final Inspection & Testing',
        duration: 7,
        startDate: '2026-07-29',
        endDate: '2026-08-04',
        predecessors: '7',
        resourceNames: 'Management',
        progress: 0,
        cost: 85000,
        priority: 'low'
      }
    ]
  },
  {
    id: 'proj-3',
    name: 'Residential Complex Phase 2',
    description: 'Luxury apartment buildings with amenities',
    createdAt: '2026-03-05T11:30:00Z',
    updatedAt: '2026-05-01T16:45:00Z',
    isPublic: true,
    shareToken: 'share-def456',
    status: 'planning',
    budget: 18000000,
    startDate: '2026-06-01',
    endDate: '2027-03-31',
    location: 'Riverside District',
    client: 'Premium Living Properties',
    progress: 15,
    tasks: [
      {
        id: 19,
        taskId: 1,
        taskName: 'Architectural Finalization',
        duration: 30,
        startDate: '2026-06-01',
        endDate: '2026-06-30',
        predecessors: '',
        resourceNames: 'Management',
        progress: 80,
        cost: 450000,
        priority: 'high'
      },
      {
        id: 20,
        taskId: 2,
        taskName: 'Permit Acquisition',
        duration: 45,
        startDate: '2026-07-01',
        endDate: '2026-08-14',
        predecessors: '1',
        resourceNames: 'Management',
        progress: 20,
        cost: 180000,
        priority: 'high'
      },
      {
        id: 21,
        taskId: 3,
        taskName: 'Site Grading & Utilities',
        duration: 20,
        startDate: '2026-08-15',
        endDate: '2026-09-03',
        predecessors: '2',
        resourceNames: 'Civil Crew',
        progress: 0,
        cost: 680000,
        priority: 'medium'
      },
      {
        id: 22,
        taskId: 4,
        taskName: 'Building Structure - Tower A',
        duration: 90,
        startDate: '2026-09-04',
        endDate: '2026-12-02',
        predecessors: '3',
        resourceNames: 'Steel fixers',
        progress: 0,
        cost: 4200000,
        priority: 'high'
      },
      {
        id: 23,
        taskId: 5,
        taskName: 'Building Structure - Tower B',
        duration: 90,
        startDate: '2026-10-01',
        endDate: '2026-12-29',
        predecessors: '3',
        resourceNames: 'Steel fixers',
        progress: 0,
        cost: 4200000,
        priority: 'high'
      },
      {
        id: 24,
        taskId: 6,
        taskName: 'Underground Parking',
        duration: 60,
        startDate: '2026-09-04',
        endDate: '2026-11-02',
        predecessors: '3',
        resourceNames: 'Concrete team',
        progress: 0,
        cost: 2800000,
        priority: 'medium'
      }
    ]
  },
  {
    id: 'proj-4',
    name: 'Hospital Renovation Project',
    description: 'Modernization of existing hospital facilities',
    createdAt: '2026-01-20T13:45:00Z',
    updatedAt: '2026-04-15T09:30:00Z',
    isPublic: false,
    shareToken: null,
    status: 'completed',
    budget: 12000000,
    startDate: '2026-02-01',
    endDate: '2026-05-15',
    location: 'City Medical Center',
    client: 'Healthcare Systems Inc',
    progress: 100,
    tasks: [
      {
        id: 25,
        taskId: 1,
        taskName: 'Phase 1 - East Wing',
        duration: 45,
        startDate: '2026-02-01',
        endDate: '2026-03-17',
        predecessors: '',
        resourceNames: 'Civil Crew',
        progress: 100,
        cost: 2800000,
        priority: 'high'
      },
      {
        id: 26,
        taskId: 2,
        taskName: 'Phase 2 - West Wing',
        duration: 45,
        startDate: '2026-03-18',
        endDate: '2026-05-01',
        predecessors: '1',
        resourceNames: 'Formwork+Steel',
        progress: 100,
        cost: 3200000,
        priority: 'high'
      },
      {
        id: 27,
        taskId: 3,
        taskName: 'Medical Equipment Installation',
        duration: 30,
        startDate: '2026-04-15',
        endDate: '2026-05-14',
        predecessors: '2',
        resourceNames: 'Management',
        progress: 100,
        cost: 4500000,
        priority: 'high'
      },
      {
        id: 28,
        taskId: 4,
        taskName: 'Final Commissioning',
        duration: 7,
        startDate: '2026-05-15',
        endDate: '2026-05-21',
        predecessors: '3',
        resourceNames: 'Management',
        progress: 100,
        cost: 150000,
        priority: 'medium'
      }
    ]
  },
  {
    id: 'proj-5',
    name: 'Shopping Mall Development',
    description: 'New retail complex with entertainment facilities',
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-05-01T12:15:00Z',
    isPublic: true,
    shareToken: 'share-ghi789',
    status: 'on-hold',
    budget: 35000000,
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    location: 'Suburban Commercial Zone',
    client: 'Retail Properties Group',
    progress: 8,
    tasks: [
      {
        id: 29,
        taskId: 1,
        taskName: 'Land Acquisition & Survey',
        duration: 14,
        startDate: '2026-07-01',
        endDate: '2026-07-14',
        predecessors: '',
        resourceNames: 'Management',
        progress: 100,
        cost: 850000,
        priority: 'high'
      },
      {
        id: 30,
        taskId: 2,
        taskName: 'Environmental Impact Study',
        duration: 21,
        startDate: '2026-07-15',
        endDate: '2026-08-04',
        predecessors: '1',
        resourceNames: 'Management',
        progress: 60,
        cost: 320000,
        priority: 'high'
      },
      {
        id: 31,
        taskId: 3,
        taskName: 'Design Development',
        duration: 60,
        startDate: '2026-08-05',
        endDate: '2026-10-03',
        predecessors: '2',
        resourceNames: 'Management',
        progress: 0,
        cost: 1200000,
        priority: 'medium'
      },
      {
        id: 32,
        taskId: 4,
        taskName: 'Site Preparation',
        duration: 30,
        startDate: '2026-10-04',
        endDate: '2026-11-02',
        predecessors: '3',
        resourceNames: 'Civil Crew',
        progress: 0,
        cost: 1800000,
        priority: 'medium'
      },
      {
        id: 33,
        taskId: 5,
        taskName: 'Foundation Work',
        duration: 45,
        startDate: '2026-11-03',
        endDate: '2026-12-17',
        predecessors: '4',
        resourceNames: 'Concrete team',
        progress: 0,
        cost: 3200000,
        priority: 'high'
      }
    ]
  }
];

export const mockResources = [
  {
    id: 'res-1',
    name: 'Civil Crew',
    type: 'team',
    totalMembers: 12,
    availableMembers: 8,
    hourlyRate: 45,
    skills: ['Excavation', 'Grading', 'Site Preparation', 'Road Work'],
    utilization: 75,
    currentProjects: 3,
    totalHours: 1920,
    completedHours: 1440
  },
  {
    id: 'res-2',
    name: 'Steel fixers',
    type: 'team',
    totalMembers: 8,
    availableMembers: 5,
    hourlyRate: 55,
    skills: ['Steel Installation', 'Welding', 'Rebar', 'Structural Steel'],
    utilization: 60,
    currentProjects: 2,
    totalHours: 1280,
    completedHours: 768
  },
  {
    id: 'res-3',
    name: 'Concrete team',
    type: 'team',
    totalMembers: 10,
    availableMembers: 7,
    hourlyRate: 42,
    skills: ['Concrete Pouring', 'Finishing', 'Formwork', 'Testing'],
    utilization: 85,
    currentProjects: 4,
    totalHours: 1600,
    completedHours: 1360
  },
  {
    id: 'res-4',
    name: 'Formwork+Steel',
    type: 'team',
    totalMembers: 6,
    availableMembers: 4,
    hourlyRate: 50,
    skills: ['Formwork', 'Rebar Installation', 'Shoring', 'Scaffolding'],
    utilization: 45,
    currentProjects: 2,
    totalHours: 960,
    completedHours: 432
  },
  {
    id: 'res-5',
    name: 'Management',
    type: 'team',
    totalMembers: 4,
    availableMembers: 3,
    hourlyRate: 85,
    skills: ['Project Management', 'Planning', 'Coordination', 'Inspection'],
    utilization: 90,
    currentProjects: 5,
    totalHours: 640,
    completedHours: 576
  }
];

export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Anderson',
    email: 'john.anderson@ganttflow.com',
    role: 'project-manager',
    avatar: '/avatars/john.jpg',
    department: 'Project Management',
    phone: '+1-555-0123',
    location: 'New York, NY',
    joinDate: '2025-03-15',
    status: 'active',
    projects: ['proj-1', 'proj-2'],
    skills: ['Project Planning', 'Risk Management', 'Budget Control'],
    certifications: ['PMP', 'PRINCE2'],
    languages: ['English', 'Spanish']
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@ganttflow.com',
    role: 'site-engineer',
    avatar: '/avatars/sarah.jpg',
    department: 'Engineering',
    phone: '+1-555-0124',
    location: 'Boston, MA',
    joinDate: '2025-06-20',
    status: 'active',
    projects: ['proj-1', 'proj-3'],
    skills: ['Structural Engineering', 'Quality Control', 'Site Supervision'],
    certifications: ['PE', 'OSHA'],
    languages: ['English', 'Mandarin']
  },
  {
    id: 'user-3',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@ganttflow.com',
    role: 'construction-manager',
    avatar: '/avatars/michael.jpg',
    department: 'Construction',
    phone: '+1-555-0125',
    location: 'Chicago, IL',
    joinDate: '2024-11-10',
    status: 'active',
    projects: ['proj-2', 'proj-4'],
    skills: ['Construction Management', 'Safety Management', 'Team Leadership'],
    certifications: ['CMA', 'OSHA'],
    languages: ['English', 'Spanish']
  },
  {
    id: 'user-4',
    name: 'Emily Thompson',
    email: 'emily.thompson@ganttflow.com',
    role: 'architect',
    avatar: '/avatars/emily.jpg',
    department: 'Design',
    phone: '+1-555-0126',
    location: 'San Francisco, CA',
    joinDate: '2025-01-08',
    status: 'active',
    projects: ['proj-3', 'proj-5'],
    skills: ['Architectural Design', '3D Modeling', 'Building Codes'],
    certifications: ['AIA', 'LEED AP'],
    languages: ['English', 'French']
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david.kim@ganttflow.com',
    role: 'quantity-surveyor',
    avatar: '/avatars/david.jpg',
    department: 'Cost Control',
    phone: '+1-555-0127',
    location: 'Seattle, WA',
    joinDate: '2025-09-12',
    status: 'active',
    projects: ['proj-1', 'proj-4', 'proj-5'],
    skills: ['Cost Estimation', 'Quantity Surveying', 'Value Engineering'],
    certifications: ['RICS', 'CCE'],
    languages: ['English', 'Korean']
  }
];

export const mockActivities = [
  {
    id: 'act-1',
    type: 'task_completed',
    description: 'Foundation Work completed for Skyline Tower',
    projectId: 'proj-1',
    taskId: 2,
    userId: 'user-2',
    timestamp: '2026-05-01T09:15:00Z',
    metadata: {
      taskName: 'Foundation Work',
      completedBy: 'Sarah Chen',
      duration: '20 days',
      actualCost: '$1,185,000'
    }
  },
  {
    id: 'act-2',
    type: 'project_created',
    description: 'New project "Shopping Mall Development" created',
    projectId: 'proj-5',
    userId: 'user-1',
    timestamp: '2026-04-10T10:00:00Z',
    metadata: {
      createdBy: 'John Anderson',
      budget: '$35,000,000',
      expectedDuration: '12 months'
    }
  },
  {
    id: 'act-3',
    type: 'milestone_reached',
    description: '50% completion milestone reached for Highway Bridge',
    projectId: 'proj-2',
    userId: 'user-3',
    timestamp: '2026-04-28T14:20:00Z',
    metadata: {
      milestone: 'Foundation Strengthening Complete',
      progress: '50%',
      nextMilestone: 'Steel Beam Installation'
    }
  },
  {
    id: 'act-4',
    type: 'budget_update',
    description: 'Budget revised for Residential Complex Phase 2',
    projectId: 'proj-3',
    userId: 'user-5',
    timestamp: '2026-05-01T16:45:00Z',
    metadata: {
      previousBudget: '$16,500,000',
      newBudget: '$18,000,000',
      reason: 'Material cost increases',
      approvedBy: 'Finance Department'
    }
  },
  {
    id: 'act-5',
    type: 'task_delayed',
    description: 'Steel Structure - Upper Floors delayed by 5 days',
    projectId: 'proj-1',
    taskId: 4,
    userId: 'user-1',
    timestamp: '2026-04-25T11:30:00Z',
    metadata: {
      originalEnd: '2026-06-01',
      newEnd: '2026-06-06',
      reason: 'Weather conditions',
      impact: 'Minor delay to subsequent tasks'
    }
  }
];

export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'deadline_approaching',
    title: 'Task Deadline Approaching',
    message: 'Steel Structure - Upper Floors deadline is in 3 days',
    projectId: 'proj-1',
    taskId: 4,
    userId: 'user-2',
    priority: 'high',
    read: false,
    timestamp: '2026-05-01T08:00:00Z',
    actionUrl: '/dashboard/projects/proj-1'
  },
  {
    id: 'notif-2',
    type: 'budget_alert',
    title: 'Budget Alert',
    message: 'Skyline Tower project has exceeded budget by 5%',
    projectId: 'proj-1',
    userId: 'user-1',
    priority: 'medium',
    read: false,
    timestamp: '2026-04-30T14:30:00Z',
    actionUrl: '/dashboard/projects/proj-1'
  },
  {
    id: 'notif-3',
    type: 'team_assignment',
    title: 'New Team Assignment',
    message: 'You have been assigned to Residential Complex Phase 2',
    projectId: 'proj-3',
    userId: 'user-4',
    priority: 'low',
    read: true,
    timestamp: '2026-04-28T10:15:00Z',
    actionUrl: '/dashboard/projects/proj-3'
  },
  {
    id: 'notif-4',
    type: 'document_shared',
    title: 'Document Shared',
    message: 'Updated architectural drawings for Shopping Mall',
    projectId: 'proj-5',
    userId: 'user-1',
    priority: 'low',
    read: true,
    timestamp: '2026-04-25T16:45:00Z',
    actionUrl: '/dashboard/projects/proj-5'
  }
];

export const mockReports = [
  {
    id: 'report-1',
    name: 'Monthly Progress Report - April 2026',
    type: 'progress',
    generatedAt: '2026-05-01T09:00:00Z',
    generatedBy: 'user-1',
    projectId: 'proj-1',
    status: 'completed',
    summary: {
      overallProgress: 42,
      tasksCompleted: 3,
      tasksInProgress: 4,
      budgetUsed: 68,
      issues: 2
    },
    fileUrl: '/reports/april-2026-proj1.pdf',
    fileSize: '2.4 MB'
  },
  {
    id: 'report-2',
    name: 'Resource Utilization Analysis',
    type: 'resource',
    generatedAt: '2026-04-30T15:30:00Z',
    generatedBy: 'user-5',
    projectId: null,
    status: 'completed',
    summary: {
      totalResources: 5,
      averageUtilization: 71,
      overbookedResources: 1,
      underutilizedResources: 2
    },
    fileUrl: '/reports/resource-analysis-april-2026.pdf',
    fileSize: '1.8 MB'
  },
  {
    id: 'report-3',
    name: 'Budget Forecast Q2 2026',
    type: 'financial',
    generatedAt: '2026-04-28T11:15:00Z',
    generatedBy: 'user-5',
    projectId: null,
    status: 'completed',
    summary: {
      totalBudget: '$78.5M',
      projectedSpend: '$45.2M',
      variance: '+3.2%',
      riskLevel: 'medium'
    },
    fileUrl: '/reports/budget-forecast-q2-2026.xlsx',
    fileSize: '3.1 MB'
  }
];

// Helper functions to get mock data
export const getProjectById = (id: string) => {
  return mockProjects.find(p => p.id === id);
};

export const getTasksByProjectId = (projectId: string) => {
  const project = getProjectById(projectId);
  return project ? project.tasks : [];
};

export const getResourceWorkload = () => {
  return mockResources.map(resource => ({
    name: resource.name,
    color: getResourceColor(resource.name),
    utilization: resource.utilization,
    totalTasks: resource.currentProjects,
    completedTasks: Math.floor(resource.currentProjects * (resource.utilization / 100)),
    totalDuration: resource.totalHours / 8 // Convert to days
  }));
};

export const getResourceColor = (resourceName: string): string => {
  const colorMap: Record<string, string> = {
    'Civil Crew': '#6B7280',
    'Steel fixers': '#1E40AF',
    'Concrete team': '#D97706',
    'Formwork+Steel': '#7C3AED',
    'Management': '#059669'
  };
  return colorMap[resourceName] || '#9CA3AF';
};

export const getDashboardStats = () => {
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
  const avgProgress = Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length);
  const totalTasks = mockProjects.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = mockProjects.reduce((sum, p) => sum + p.tasks.filter(t => t.progress === 100).length, 0);
  const activeTasks = mockProjects.reduce((sum, p) => sum + p.tasks.filter(t => t.progress > 0 && t.progress < 100).length, 0);
  
  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalBudget,
    avgProgress,
    totalTasks,
    completedTasks,
    activeTasks,
    overdueTasks: 2, // Mock data
    upcomingDeadlines: 5 // Mock data
  };
};
