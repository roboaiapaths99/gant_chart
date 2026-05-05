'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { mockProjects, mockUsers, mockActivities } from '@/lib/mock-data';
import { 
  Users, 
  Share2, 
  Link, 
  Mail, 
  Copy, 
  Eye, 
  EyeOff, 
  Settings, 
  Calendar,
  MessageSquare,
  FileText,
  Activity,
  CheckCircle
} from 'lucide-react';

export default function CollaborationPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [users] = useState(mockUsers);
  const [activities] = useState(mockActivities);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleShareProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(projectId);
      setIsPublic(project.isPublic);
      if (project.shareToken && origin) {
        setShareLink(`${origin}/share/${project.shareToken}`);
      }
    }
  };

  const handleTogglePublic = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const newPublicStatus = !project.isPublic;
      
      // Update project state
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, isPublic: newPublicStatus } : p
      ));
      
      setIsPublic(newPublicStatus);
      
      // Generate share link if making public
      if (newPublicStatus) {
        const shareToken = `share-${Date.now()}`;
        setProjects(prev => prev.map(p => 
          p.id === projectId ? { ...p, shareToken } : p
        ));
        if (origin) {
          setShareLink(`${origin}/share/${shareToken}`);
        }
      }
      
      toast({
        title: 'Success',
        description: newPublicStatus ? 'Project is now public' : 'Project is now private',
      });
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast({
        title: 'Link copied',
        description: 'Share link has been copied to clipboard',
      });
    }
  };

  const handleSendInvite = (email: string) => {
    toast({
      title: 'Invitation sent',
      description: `Invitation sent to ${email}`,
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'project_created':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'milestone_reached':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'budget_update':
        return <Settings className="h-4 w-4 text-orange-500" />;
      case 'task_delayed':
        return <Activity className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collaboration</h1>
          <p className="text-gray-600">Share projects and collaborate with your team</p>
        </div>
        <Button className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Invite Team Members
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Sharing */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Project Sharing
              </CardTitle>
              <CardDescription>
                Manage sharing settings for your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <Badge variant={project.isPublic ? 'default' : 'secondary'}>
                          {project.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      {project.shareToken && (
                        <div className="flex items-center gap-2 mt-2">
                          <Link className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {origin}/share/{project.shareToken}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareProject(project.id)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                      <Button
                        variant={project.isPublic ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => handleTogglePublic(project.id)}
                      >
                        {project.isPublic ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                        {project.isPublic ? 'Make Private' : 'Make Public'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                Active team members and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.role}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{user.department}</Badge>
                      <p className="text-sm text-gray-500 mt-1">{user.projects?.length || 0} projects</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Share Settings */}
          {selectedProject && (
            <Card>
              <CardHeader>
                <CardTitle>Share Settings</CardTitle>
                <CardDescription>
                  Configure sharing for selected project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Project</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {projects.find(p => p.id === selectedProject)?.name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Visibility</label>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={isPublic ? 'default' : 'secondary'}>
                        {isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>

                  {isPublic && shareLink && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Share Link</label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          value={shareLink}
                          readOnly
                          className="text-sm"
                        />
                        <Button size="sm" onClick={handleCopyLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700">Invite by Email</label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        placeholder="colleague@example.com"
                        className="text-sm"
                      />
                      <Button size="sm" onClick={() => handleSendInvite('colleague@example.com')}>
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest collaboration activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Public Projects</span>
                  <span className="font-medium">
                    {projects.filter(p => p.isPublic).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Team Members</span>
                  <span className="font-medium">{users.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Today</span>
                  <span className="font-medium">
                    {activities.filter(a => {
                      const today = new Date().toDateString();
                      return new Date(a.timestamp).toDateString() === today;
                    }).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
