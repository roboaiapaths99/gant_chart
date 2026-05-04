'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Plus, Trash2, Save, FileSpreadsheet, Check } from 'lucide-react';

// Template headers based on typical project/task management structure
const TEMPLATE_HEADERS = [
  'Task ID',
  'Task Name',
  'Description',
  'Start Date',
  'End Date',
  'Duration',
  'Assigned To',
  'Priority',
  'Status',
  'Progress (%)',
  'Dependencies',
  'Resource',
  'Budget',
  'Notes'
];

// Initial template data with sample rows
const INITIAL_DATA = [
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
];

export default function SpreadsheetPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [projectName, setProjectName] = useState('New Project');
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    newData[rowIndex] = [...newData[rowIndex]];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const addRow = () => {
    const newRow = new Array(TEMPLATE_HEADERS.length).fill('');
    setData([...data, newRow]);
  };

  const deleteRow = (rowIndex: number) => {
    if (data.length > 1) {
      const newData = data.filter((_, index) => index !== rowIndex);
      setData(newData);
    }
  };

  const clearAll = () => {
    setData(INITIAL_DATA);
    setProjectName('New Project');
    setSavedStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate data
      const validRows = data.filter(row => 
        row.some(cell => cell.trim() !== '') && row[0].trim() !== ''
      );

      if (validRows.length === 0) {
        alert('Please enter at least one task with a Task ID');
        setIsSaving(false);
        return;
      }

      // Create project from spreadsheet data
      const projectData = {
        name: projectName,
        description: `Project created from spreadsheet with ${validRows.length} tasks`,
        tasks: validRows.map((row, index) => ({
          id: row[0] || `Task-${index + 1}`,
          name: row[1] || `Task ${index + 1}`,
          description: row[2] || '',
          startDate: row[3] || new Date().toISOString().split('T')[0],
          endDate: row[4] || '',
          duration: row[5] || '',
          assignedTo: row[6] || '',
          priority: row[7] || 'Medium',
          status: row[8] || 'Not Started',
          progress: parseInt(row[9]) || 0,
          dependencies: row[10] || '',
          resource: row[11] || '',
          budget: row[12] || '',
          notes: row[13] || ''
        }))
      };

      // Save to localStorage for demo purposes
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString(),
        _count: { tasks: validRows.length }
      };
      existingProjects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      
      // Store tasks separately
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
      const newTasks = projectData.tasks.map((task, index) => ({
        ...task,
        projectId: newProject.id,
        createdAt: new Date().toISOString()
      }));
      existingTasks[newProject.id] = newTasks;
      localStorage.setItem('tasks', JSON.stringify(existingTasks));
      
      setSavedStatus('success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Save failed:', error);
      setSavedStatus('error');
      setIsSaving(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      TEMPLATE_HEADERS.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Spreadsheet Entry</h1>
                <p className="text-sm text-gray-500 font-medium">Enter project data in Excel-like format</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={exportToCSV} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : savedStatus === 'success' ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {savedStatus === 'success' ? 'Saved!' : isSaving ? 'Saving...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Project Name Input */}
        <Card className="p-6 mb-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold text-gray-700 min-w-fit bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Project Name:
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all"
              placeholder="Enter project name"
            />
          </div>
        </Card>

        {/* Spreadsheet */}
        <Card className="p-6 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Task Data Entry</h3>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={addRow} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll} className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200/50 hover:shadow-lg transition-all">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
            <p className="text-sm text-blue-800 font-medium">
              <strong>Instructions:</strong> Enter your task data below. 
              Task ID and Task Name are required. Dates should be in YYYY-MM-DD format.
            </p>
          </div>

          {/* Spreadsheet Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200/50 shadow-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-left text-xs font-bold text-white">
                    #
                  </th>
                  {TEMPLATE_HEADERS.map((header, index) => (
                    <th key={index} className="border border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-left text-xs font-bold text-white">
                      {header}
                    </th>
                  ))}
                  <th className="border border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-center text-xs font-bold text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all">
                    <td className="border border-gray-200/50 bg-gray-50/50 p-3 text-center text-sm text-gray-600 font-medium">
                      {rowIndex + 1}
                    </td>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border border-gray-200/50 p-2">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-xl hover:bg-white/80 transition-all"
                          placeholder="Enter data"
                        />
                      </td>
                    ))}
                    <td className="border border-gray-200/50 p-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(rowIndex)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Validation Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50">
            <p className="text-sm text-yellow-800 font-medium">
              <strong>Note:</strong> Make sure to fill in Task ID and Task Name for each task. 
              Priority options: Low, Medium, High, Critical. 
              Status options: Not Started, In Progress, On Hold, Completed, Cancelled.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
