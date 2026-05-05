'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Award, 
  Shield, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Filter,
  Search,
  Crown,
  Eye,
  Lock,
  CheckCircle,
  X
} from 'lucide-react';

const roles = [
  { id: 'admin', name: 'Admin', icon: Crown, color: 'bg-red-500', permissions: ['all'] },
  { id: 'project-manager', name: 'Project Manager', icon: Briefcase, color: 'bg-blue-500', permissions: ['manage_projects', 'view_reports'] },
  { id: 'site-engineer', name: 'Site Engineer', icon: Shield, color: 'bg-green-500', permissions: ['view_projects', 'update_tasks'] },
  { id: 'construction-manager', name: 'Construction Manager', icon: Award, color: 'bg-purple-500', permissions: ['view_projects', 'manage_resources'] },
  { id: 'architect', name: 'Architect', icon: Eye, color: 'bg-orange-500', permissions: ['view_projects', 'update_designs'] },
  { id: 'quantity-surveyor', name: 'Quantity Surveyor', icon: Lock, color: 'bg-gray-500', permissions: ['view_projects', 'manage_budget'] },
  { id: 'team-member', name: 'Team Member', icon: Users, color: 'bg-gray-400', permissions: ['view_assigned_tasks'] }
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('team-member');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          // Transform user data to match expected team member structure
          const mappedMembers = data.map((user: any) => ({
            id: user.id,
            name: user.name || 'Unknown User',
            email: user.email,
            role: user.plan === 'PRO' ? 'project-manager' : 'team-member',
            department: 'General',
            phone: 'N/A',
            location: 'Remote',
            joinDate: new Date(user.createdAt).toISOString().split('T')[0],
            status: 'active',
            projects: [],
            skills: [],
            certifications: [],
            languages: ['English'],
            avatar: user.image || ''
          }));
          setTeamMembers(mappedMembers);
        }
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter an email address',
      });
      return;
    }

    // Simulate sending invitation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newMember = {
      id: `member-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      department: 'General',
      phone: '',
      location: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      projects: [],
      skills: [],
      certifications: [],
      languages: ['English'],
      avatar: ''
    };

    setTeamMembers(prev => [...prev, newMember]);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('team-member');
    
    toast({
      title: 'Invitation Sent',
      description: `Invitation has been sent to ${inviteEmail}`,
    });
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
    
    toast({
      title: 'Role Updated',
      description: 'Member role has been updated successfully',
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    
    toast({
      title: 'Member Removed',
      description: 'Team member has been removed from the team',
    });
  };

  const getRoleIcon = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.icon : Users;
  };

  const getRoleColor = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.color : 'bg-gray-400';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Team Management</h1>
                <p className="text-gray-600 font-medium">Manage team members, roles, and permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button onClick={() => setShowInviteModal(true)} className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">{teamMembers.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Now</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mt-2">
                      {teamMembers.filter(m => m.status === 'active').length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/30">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent mt-2">
                      {teamMembers.filter(m => m.status === 'pending').length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mt-2">
                      {new Set(teamMembers.map(m => m.department)).size}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Team List */}
            <div className="lg:col-span-3">
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Team Members</CardTitle>
                      <CardDescription className="text-gray-600 font-medium">Manage your team and their roles</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search members..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64 bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200/50 rounded-xl text-sm bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Roles</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredMembers.map((member) => {
                      const RoleIcon = getRoleIcon(member.role);
                      const roleColor = getRoleColor(member.role);
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between p-5 border border-gray-200/50 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 ${roleColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                              <RoleIcon className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                                {getStatusBadge(member.status)}
                              </div>
                              <p className="text-sm text-gray-600 font-medium">{member.email}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="font-medium">{member.department}</span>
                                <span>•</span>
                                <span>{member.location}</span>
                                <span>•</span>
                                <span>Joined {member.joinDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <select
                              value={member.role}
                              onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                              className="px-4 py-2 border border-gray-200/50 rounded-xl text-sm bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
                            >
                              {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                              ))}
                            </select>
                            <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleRemoveMember(member.id)} className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200/50 hover:shadow-lg transition-all">
                              <Trash2 className="h-4 w-4" />
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
              {/* Role Overview */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Roles & Permissions</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">System roles and their access levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roles.map((role) => {
                      const RoleIcon = role.icon;
                      const memberCount = teamMembers.filter(m => m.role === role.id).length;
                      
                      return (
                        <div key={role.id} className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${role.color} rounded-xl flex items-center justify-center shadow-lg`}>
                              <RoleIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{role.name}</h4>
                              <p className="text-xs text-gray-500 font-medium">{memberCount} members</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
                            {role.permissions.length} permissions
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Department Breakdown */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Department Breakdown</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">Team distribution by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(teamMembers.map(m => m.department))).map((dept) => {
                      const deptMembers = teamMembers.filter(m => m.department === dept);
                      const percentage = (deptMembers.length / teamMembers.length) * 100;
                      
                      return (
                        <div key={dept} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">{dept}</span>
                            <span className="text-sm text-gray-600 font-medium">{deptMembers.length} members</span>
                          </div>
                          <div className="w-full bg-gray-200/50 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-lg" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Mail className="h-4 w-4 mr-2" />
                      Email All Members
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                      <Award className="h-4 w-4 mr-2" />
                      Assign Training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Invite Team Member</CardTitle>
              <CardDescription className="text-gray-600 font-medium">Send an invitation to join your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-sm font-bold text-gray-700">Role</Label>
                  <select
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleInviteUser} className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30">
                    Send Invitation
                  </Button>
                  <Button variant="outline" onClick={() => setShowInviteModal(false)} className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200/50 hover:shadow-lg transition-all">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
