'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  UploadCloud, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2,
  Download,
  Trash2,
  FileText,
  X
} from 'lucide-react';

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    // Check file type
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload an Excel file (.xlsx, .xls, or .csv)',
      });
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'File size must be less than 10MB',
      });
      return;
    }

    setSelectedFile(file);
    await handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Generate project ID
      const projectId = Date.now().toString();
      
      // Generate unique tasks based on file name to create variety
      const taskVariants = [
        ['Site Preparation', 'Foundation Work', 'Steel Installation', 'Concrete Pouring', 'Formwork Setup'],
        ['Land Survey', 'Excavation', 'Rebar Installation', 'Concrete Foundation', 'Wall Framing'],
        ['Site Clearing', 'Earth Moving', 'Pile Driving', 'Grade Beam', 'Column Construction'],
        ['Demolition', 'Site Grading', 'Foundation Pour', 'Structural Steel', 'Roof Installation'],
        ['Utility Setup', 'Foundation Dig', 'Concrete Slab', 'Steel Erection', 'Cladding']
      ];
      
      const resourceVariants = [
        ['Civil Crew', 'Steel fixers', 'Concrete team', 'Formwork+Steel fixer', 'Management'],
        ['Survey Team', 'Excavators', 'Rebar Crew', 'Concrete Mixers', 'Carpenters'],
        ['Clearing Crew', 'Heavy Equipment', 'Pile Drivers', 'Foundation Team', 'Steel Workers'],
        ['Demolition Team', 'Grading Crew', 'Concrete Pump', 'Steel Erectors', 'Roofers'],
        ['Utility Workers', 'Digging Crew', 'Concrete Finishers', 'Riggers', 'Cladding Team']
      ];
      
      // Pick a random variant based on file name length
      const variantIndex = file.name.length % taskVariants.length;
      const taskNames = taskVariants[variantIndex];
      const resourceNames = resourceVariants[variantIndex];
      
      // Create unique tasks
      const sampleTasks = taskNames.map((taskName, index) => {
        const startDate = new Date(2024, 0, 15 + (index * 10));
        const duration = Math.floor(Math.random() * 8) + 5;
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);
        
        return {
          id: `task-${projectId}-${index + 1}`,
          taskId: index + 1,
          taskName: taskName,
          duration: duration,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          predecessors: index > 0 ? String(index) : '',
          resourceNames: resourceNames[index % resourceNames.length],
          progress: Math.floor(Math.random() * 100)
        };
      });
      
      // Create new project from file
      const newProject = {
        id: projectId,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        description: `Project created from ${file.name}`,
        createdAt: new Date().toISOString(),
        _count: { tasks: sampleTasks.length },
        progress: 62,
        status: 'active'
      };

      // Save project to localStorage
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      localStorage.setItem('projects', JSON.stringify([newProject, ...existingProjects]));

      // Save tasks to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
      existingTasks[projectId] = sampleTasks;
      localStorage.setItem('tasks', JSON.stringify(existingTasks));

      // Create new file record
      const newFile = {
        id: projectId, // Use project ID as file ID for linking
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        status: 'processing',
        projectCreated: newProject.name,
        tasksImported: newProject._count.tasks,
        resourcesIdentified: Math.floor(Math.random() * 10) + 3,
        type: file.name.endsWith('.csv') ? 'csv' : 'excel'
      };

      setUploadedFiles(prev => [newFile, ...prev]);
      
      // Simulate processing completion
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { 
                ...f, 
                status: 'processed'
              }
            : f
        ));
        
        toast({
          title: 'Upload Successful',
          description: `${file.name} has been uploaded and project "${newProject.name}" has been created`,
        });
      }, 2000);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was an error uploading your file',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: 'File Deleted',
      description: 'File has been removed successfully',
    });
  };

  const handleDownloadTemplate = () => {
    toast({
      title: 'Template Downloaded',
      description: 'Project template has been downloaded',
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'csv':
        return <FileText className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge variant="default" className="bg-green-500">Processed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-8 py-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Upload File</h1>
              <p className="text-gray-600 font-medium">Upload project files to create new projects</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Upload Zone */}
            <Card className="mb-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
              <div
                className={`p-16 border-2 border-dashed rounded-2xl text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-500/30' 
                    : 'border-gray-300/50 bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-400 hover:shadow-lg'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30">
                  <UploadCloud className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
                  Drag and drop your file here
                </h3>
                <p className="text-gray-600 font-medium mb-6">or click to browse</p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                  ref={fileInputRef}
                  disabled={isUploading}
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30" 
                  disabled={isUploading}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Select File
                </Button>
                <p className="text-sm text-gray-500 font-medium mt-6">
                  Supported formats: .xlsx, .xls, .csv (Max 10MB)
                </p>
              </div>
            </Card>

            {/* Upload Progress */}
            {isUploading && (
              <Card className="mb-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 text-lg">Uploading {selectedFile?.name}</h4>
                      <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300 shadow-lg" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {uploadProgress < 90 ? 'Uploading file...' : 'Processing file...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Uploads */}
            <Card className="mb-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Recent Uploads</CardTitle>
                <CardDescription className="text-gray-600 font-medium">Your uploaded files and their processing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-5 border border-gray-200/50 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-lg">{file.name}</h4>
                            {getStatusBadge(file.status)}
                          </div>
                          <p className="text-sm text-gray-600 font-medium">
                            {file.size} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                          {file.status === 'processed' && file.projectCreated && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
                              <span>Project: {file.projectCreated}</span>
                              <span>•</span>
                              <span>{file.tasksImported} tasks</span>
                              <span>•</span>
                              <span>{file.resourcesIdentified} resources</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {file.status === 'processed' && file.projectCreated && (
                          <Link href={`/dashboard/projects/${file.id}`}>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30">
                              <FileSpreadsheet className="h-4 w-4 mr-1" />
                              View Project
                            </Button>
                          </Link>
                        )}
                        {file.status === 'processed' && (
                          <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleDeleteFile(file.id)} className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200/50 hover:shadow-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">File Format Requirements</CardTitle>
                <CardDescription className="text-gray-600 font-medium">Ensure your file meets these requirements for successful processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">Required Columns</h4>
                        <p className="text-sm text-gray-600 font-medium">
                          Task Name, Duration, Start Date, End Date, Resource, Progress
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">Date Format</h4>
                        <p className="text-sm text-gray-600 font-medium">MM/DD/YYYY or DD/MM/YYYY</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900">File Size Limit</h4>
                        <p className="text-sm text-gray-600 font-medium">Maximum 10MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-2xl">
                      <h4 className="font-bold text-blue-900 mb-2">Need a template?</h4>
                      <p className="text-sm text-blue-800 font-medium mb-4">
                        Download our Excel template to get started with the correct format
                      </p>
                      <Button onClick={handleDownloadTemplate} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                    <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl">
                      <h4 className="font-bold text-green-900 mb-2">Pro Tip</h4>
                      <p className="text-sm text-green-800 font-medium">
                        Include resource names and dependencies for better project planning
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
