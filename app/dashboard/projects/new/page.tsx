'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload, ArrowRight, ArrowLeft, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<(string | number | boolean | null)[][] | null>(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        parseFile(acceptedFiles[0]);
      }
    },
  });

  const parseFile = async (file: File) => {
    try {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      // Show first 5 rows as preview
      setPreviewData(data.slice(0, 6));
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to parse file',
      });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'GanttFlow_Project_Template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download template',
      });
    }
  };

  const handleSubmit = async () => {
    if (!file || !projectName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectName', projectName);
    formData.append('description', description);
    formData.append('isPublic', isPublic.toString());

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
        router.push(`/dashboard/projects/${data.project.id}`);
      } else {
        throw new Error(data.error || 'Failed to create project');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create project',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Create New Project</h1>
        <p className="text-gray-600 font-medium">Follow the steps to create your Gantt chart</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transition-all ${
                step >= s ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/30' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > s ? <CheckCircle className="h-6 w-6" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-32 h-2 mx-3 rounded-full ${
                  step > s ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Download Template */}
      {step === 1 && (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileSpreadsheet className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
              Step 1: Download Template
            </h2>
            <p className="text-gray-600 font-medium">
              Download our Excel template and fill it with your project data
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-200/50">
            <h3 className="font-bold text-gray-900 mb-4">Template Columns:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/50 backdrop-blur-xl p-4 rounded-xl">
                <p className="font-bold text-gray-900">ID</p>
                <p className="text-gray-600 font-medium">Unique task identifier</p>
              </div>
              <div className="bg-white/50 backdrop-blur-xl p-4 rounded-xl">
                <p className="font-bold text-gray-900">Task Name</p>
                <p className="text-gray-600 font-medium">Name of the task</p>
              </div>
              <div className="bg-white/50 backdrop-blur-xl p-4 rounded-xl">
                <p className="font-bold text-gray-900">Duration (days)</p>
                <p className="text-gray-600 font-medium">How long the task takes</p>
              </div>
              <div className="bg-white/50 backdrop-blur-xl p-4 rounded-xl">
                <p className="font-bold text-gray-900">Start Date</p>
                <p className="text-gray-600 font-medium">When the task begins (DD-MM-YY)</p>
              </div>
              <div className="bg-white/50 backdrop-blur-xl p-4 rounded-xl">
                <p className="font-bold text-gray-900">Finish Date</p>
                <p className="text-gray-600 font-medium">When the task ends (DD-MM-YY)</p>
              </div>
              <div className="bg-white/50 backdrop-blur-xl p-4 rounded-xl">
                <p className="font-bold text-gray-900">Predecessors</p>
                <p className="text-gray-600 font-medium">Task IDs that must finish first</p>
              </div>
              <div className="bg-white/50 backdrop-blur-xl p-4 rounded-xl">
                <p className="font-bold text-gray-900">Resource Names</p>
                <p className="text-gray-600 font-medium">Who is responsible</p>
              </div>
              <div className="bg-white/50 backdrop-blur-xl p-4 rounded-xl">
                <p className="font-bold text-gray-900">Progress (%)</p>
                <p className="text-gray-600 font-medium">Completion percentage (0-100)</p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30"
            onClick={handleDownloadTemplate}
          >
            <Download className="h-5 w-5 mr-2" />
            Download Template
          </Button>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep(2)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Upload File */}
      {step === 2 && (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Upload className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
              Step 2: Upload Your File
            </h2>
            <p className="text-gray-600 font-medium">
              Upload the filled Excel template (.xlsx, .xls, or .csv, max 5MB)
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg shadow-blue-500/30'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br from-gray-50 to-blue-50'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="font-bold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Drag and drop your file here, or click to select
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports .xlsx and .xls files
                </p>
              </div>
            )}
          </div>

          {previewData && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Data Preview:</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200/50 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                      {previewData[0]?.map((header, idx: number) => (
                        <th key={idx} className="px-4 py-3 text-left border border-gray-200/50 font-bold text-gray-900">
                          {String(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row, rowIdx: number) => (
                      <tr key={rowIdx} className="border-t border-gray-200/50 hover:bg-gradient-to-r from-gray-50 to-blue-50 transition-all">
                        {row.map((cell, cellIdx: number) => (
                          <td key={cellIdx} className="px-4 py-3 border border-gray-200/50 text-gray-700 font-medium">
                            {cell !== null ? String(cell) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!file} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30">
              Continue
              <ArrowRight className="h-4 w-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Name Project */}
      {step === 3 && (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
              Step 3: Name Your Project
            </h2>
            <p className="text-gray-600 font-medium">Give your project a name and optional description</p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <div>
              <Label htmlFor="projectName" className="text-sm font-bold text-gray-700">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="My Construction Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of your project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded w-5 h-5 accent-purple-500"
              />
              <Label htmlFor="isPublic" className="font-medium text-gray-900">Make this chart publicly shareable</Label>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
              <ArrowLeft className="h-4 w-5 mr-2" />
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={!projectName || loading} className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30">
              {loading ? 'Creating...' : 'Generate Gantt Chart'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
