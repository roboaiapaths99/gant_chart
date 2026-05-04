'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Filter, 
  Search, 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  X, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { Project, User } from '@/types';

interface FilterOptions {
  searchTerm: string;
  status: string[];
  dateRange: string;
  budgetRange: string;
  location: string;
  teamMembers: string[];
  priority: string;
}

interface AdvancedFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  projects: Project[];
  users: User[];
}

export function AdvancedFilter({ onFilterChange, projects, users }: AdvancedFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    status: [],
    dateRange: '',
    budgetRange: '',
    location: '',
    teamMembers: [],
    priority: ''
  });

  const statusOptions = ['active', 'completed', 'on-hold', 'planning'];
  const budgetRanges = ['0-1M', '1M-5M', '5M-10M', '10M+'];
  const priorities = ['high', 'medium', 'low'];

  const handleFilterUpdate = (key: keyof FilterOptions, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    handleFilterUpdate('status', newStatus);
  };

  const handleTeamMemberToggle = (memberId: string) => {
    const newMembers = filters.teamMembers.includes(memberId)
      ? filters.teamMembers.filter(m => m !== memberId)
      : [...filters.teamMembers, memberId];
    handleFilterUpdate('teamMembers', newMembers);
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      status: [],
      dateRange: '',
      budgetRange: '',
      location: '',
      teamMembers: [],
      priority: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.status.length > 0) count++;
    if (filters.dateRange) count++;
    if (filters.budgetRange) count++;
    if (filters.location) count++;
    if (filters.teamMembers.length > 0) count++;
    if (filters.priority) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
            <CardDescription>
              Refine your search with detailed filters
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFilterCount()} active
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Search */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Search</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects, tasks, or team members..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterUpdate('searchTerm', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    filters.status.includes(status)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Date Range</Label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterUpdate('dateRange', e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="quarter">This quarter</option>
              <option value="year">This year</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Budget Range</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {budgetRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => handleFilterUpdate('budgetRange', range)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                    filters.budgetRange === range
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Location</Label>
            <Input
              placeholder="City, State, or Country"
              value={filters.location}
              onChange={(e) => handleFilterUpdate('location', e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Team Members */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Team Members</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {users.slice(0, 6).map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleTeamMemberToggle(user.id)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all flex items-center gap-2 ${
                    filters.teamMembers.includes(user.id)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Users className="h-3 w-3" />
                  {(user.name || 'User').split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Priority</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  onClick={() => handleFilterUpdate('priority', priority)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all capitalize ${
                    filters.priority === priority
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
              <Button onClick={() => setIsExpanded(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function GlobalSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const mockSuggestions = [
    'Skyline Tower Construction',
    'Highway Bridge Expansion',
    'John Anderson',
    'Civil Crew',
    'Foundation Work',
    'Budget Analysis',
    'Resource Utilization'
  ];

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length > 0) {
      const filtered = mockSuggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    onSearch(suggestion);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects, tasks, team members..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10"
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
              onSearch('');
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
