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
  const [previewData, setPreviewData] = useState<any[] | null>(null);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
        <p className="text-gray-600">Follow the steps to create your Gantt chart</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > s ? <CheckCircle className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-24 h-1 mx-2 ${
                  step > s ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Download Template */}
      {step === 1 && (
        <div className="bg-white rounded-lg border p-8">
          <div className="text-center mb-8">
            <FileSpreadsheet className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Step 1: Download Template
            </h2>
            <p className="text-gray-600">
              Download our Excel template and fill it with your project data
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Template Columns:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">ID</p>
                <p className="text-gray-600">Unique task identifier</p>
              </div>
              <div>
                <p className="font-medium">Task Name</p>
                <p className="text-gray-600">Name of the task</p>
              </div>
              <div>
                <p className="font-medium">Duration (days)</p>
                <p className="text-gray-600">How long the task takes</p>
              </div>
              <div>
                <p className="font-medium">Start Date</p>
                <p className="text-gray-600">When the task begins (DD-MM-YY)</p>
              </div>
              <div>
                <p className="font-medium">Finish Date</p>
                <p className="text-gray-600">When the task ends (DD-MM-YY)</p>
              </div>
              <div>
                <p className="font-medium">Predecessors</p>
                <p className="text-gray-600">Task IDs that must finish first</p>
              </div>
              <div>
                <p className="font-medium">Resource Names</p>
                <p className="text-gray-600">Who is responsible</p>
              </div>
              <div>
                <p className="font-medium">Progress (%)</p>
                <p className="text-gray-600">Completion percentage (0-100)</p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleDownloadTemplate}
          >
            <Download className="h-5 w-5 mr-2" />
            Download Template
          </Button>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep(2)}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Upload File */}
      {step === 2 && (
        <div className="bg-white rounded-lg border p-8">
          <div className="text-center mb-8">
            <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Step 2: Upload Your File
            </h2>
            <p className="text-gray-600">
              Upload the filled Excel template (.xlsx, .xls, or .csv, max 5MB)
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div>
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
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
              <h3 className="font-semibold text-gray-900 mb-2">Data Preview:</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-50">
                      {previewData[0]?.map((header: any, idx: number) => (
                        <th key={idx} className="px-4 py-2 text-left border">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row: any, rowIdx: number) => (
                      <tr key={rowIdx} className="border-t">
                        {row.map((cell: any, cellIdx: number) => (
                          <td key={cellIdx} className="px-4 py-2 border">
                            {cell || '-'}
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
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!file}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Name Project */}
      {step === 3 && (
        <div className="bg-white rounded-lg border p-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Step 3: Name Your Project
            </h2>
            <p className="text-gray-600">Give your project a name and optional description</p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="My Construction Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of your project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isPublic">Make this chart publicly shareable</Label>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={!projectName || loading}>
              {loading ? 'Creating...' : 'Generate Gantt Chart'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
