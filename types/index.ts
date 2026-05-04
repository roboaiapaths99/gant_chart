export interface User {
  id: string;
  name: string | null;
  email: string;
  plan: 'FREE' | 'PRO' | 'BUSINESS';
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  fileUrl: string | null;
  shareToken: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
}

export interface Task {
  id: string;
  projectId: string;
  taskId: number;
  taskName: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  predecessors: string | null;
  resourceNames: string | null;
  progress: number;
  color: string | null;
  createdAt: Date;
}

export interface ParsedTask {
  taskId: number;
  taskName: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  predecessors: string;
  resourceNames: string;
  progress: number;
}

export interface ParseResult {
  success: boolean;
  tasks: ParsedTask[];
  errors: string[];
  warnings: string[];
}

export interface PlanLimits {
  maxProjects: number;
  maxTasksPerProject: number;
  maxExportsPerMonth: number;
  publicShareLinks: boolean;
  customColors: boolean;
}
