import * as XLSX from 'xlsx';
import { ParsedTask, ParseResult } from '@/types';

export function parseExcelFile(buffer: Buffer, maxTasks: number = 500): ParseResult {
  const result: ParseResult = {
    success: false,
    tasks: [],
    errors: [],
    warnings: [],
  };

  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    
    if (!sheetName) {
      result.errors.push('File appears to be empty');
      return result;
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

    if (jsonData.length < 2) {
      result.errors.push('File must contain at least a header row and one data row');
      return result;
    }

    // Find header row (look for "Task Name" or "TaskName")
    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(jsonData.length, 5); i++) {
      const row = jsonData[i];
      if (row && row.some((cell: unknown) => 
        typeof cell === 'string' && (cell.includes('Task') || cell.includes('ID'))
      )) {
        headerRowIndex = i;
        break;
      }
    }

    const headers = (jsonData[headerRowIndex] as unknown[]).map((h: unknown) => String(h || '').trim().toLowerCase());
    
    // Map column indices
    const colMap: Record<string, number> = {};
    headers.forEach((h: string, idx: number) => {
      if (h.includes('id') && !h.includes('task')) colMap.id = idx;
      if (h.includes('task') && h.includes('name')) colMap.taskName = idx;
      if (h.includes('duration')) colMap.duration = idx;
      if (h.includes('start')) colMap.startDate = idx;
      if (h.includes('finish') || h.includes('end')) colMap.endDate = idx;
      if (h.includes('predecessor')) colMap.predecessors = idx;
      if (h.includes('resource')) colMap.resourceNames = idx;
      if (h.includes('progress')) colMap.progress = idx;
    });

    // Validate required columns
    if (colMap.taskName === undefined) result.errors.push('Missing required column: Task Name');
    if (colMap.startDate === undefined) result.errors.push('Missing required column: Start Date');
    if (colMap.duration === undefined) result.errors.push('Missing required column: Duration');

    if (result.errors.length > 0) {
      return result;
    }

    // Parse data rows
    let taskCount = 0;
    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue; // Skip empty rows

      // Skip if all cells are empty
      if (row.every((cell: unknown) => cell === undefined || cell === null || String(cell).trim() === '')) {
        continue;
      }

      taskCount++;
      if (taskCount > maxTasks) {
        result.warnings.push(`File contains more than ${maxTasks} tasks. Only first ${maxTasks} will be processed.`);
        break;
      }

      const rowErrors: string[] = [];
      const rowNum = i + 1;

      // Extract values
      const taskId = colMap.id !== undefined ? parseInt(String(row[colMap.id] || '')) || taskCount : taskCount;
      const taskName = String(row[colMap.taskName] || '').trim();
      const duration = parseInt(String(row[colMap.duration] || '0'));
      const startDateStr = String(row[colMap.startDate] || '').trim();
      const endDateStr = colMap.endDate !== undefined ? String(row[colMap.endDate] || '').trim() : '';
      const predecessors = colMap.predecessors !== undefined ? String(row[colMap.predecessors] || '').trim() : '';
      const resourceNames = colMap.resourceNames !== undefined ? String(row[colMap.resourceNames] || '').trim() : '';
      const progress = colMap.progress !== undefined ? parseFloat(String(row[colMap.progress] || '0')) : 0;

      // Validate
      if (!taskName) rowErrors.push('Task Name is required');
      if (duration <= 0) rowErrors.push('Duration must be a positive number');
      
      const startDate = parseDate(startDateStr);
      if (!startDate) rowErrors.push('Invalid Start Date format');
      
      let endDate = parseDate(endDateStr);
      if (!endDate && startDate && duration > 0) {
        endDate = addBusinessDays(startDate, duration);
        result.warnings.push(`Row ${rowNum}: Finish Date calculated from Start Date + Duration`);
      } else if (!endDate) {
        rowErrors.push('Invalid Finish Date format');
      }

      if (progress < 0 || progress > 100) rowErrors.push('Progress must be between 0 and 100');

      if (rowErrors.length > 0) {
        result.errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
        continue;
      }

      const task: ParsedTask = {
        taskId,
        taskName,
        duration,
        startDate: startDate!,
        endDate: endDate!,
        predecessors,
        resourceNames,
        progress,
      };

      result.tasks.push(task);
    }

    if (result.tasks.length === 0) {
      result.errors.push('No valid tasks found in file');
      return result;
    }

    result.success = true;
  } catch (error) {
    result.errors.push(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Try Excel serial number
  const serial = parseFloat(dateStr);
  if (!isNaN(serial) && serial > 0 && serial < 100000) {
    return excelDateToJSDate(serial);
  }

  // Try various date formats
  const formats = [
    /(\d{2})-(\d{2})-(\d{2})/, // DD-MM-YY
    /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
    /(\d{2})\/(\d{2})\/(\d{4})/, // MM/DD/YYYY
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      let year: number, month: number, day: number;
      
      if (format === formats[0]) { // DD-MM-YY
        day = parseInt(match[1]);
        month = parseInt(match[2]);
        year = 2000 + parseInt(match[3]);
      } else if (format === formats[1]) { // DD-MM-YYYY
        day = parseInt(match[1]);
        month = parseInt(match[2]);
        year = parseInt(match[3]);
      } else if (format === formats[2]) { // MM/DD/YYYY
        month = parseInt(match[1]);
        day = parseInt(match[2]);
        year = parseInt(match[3]);
      } else { // YYYY-MM-DD
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      }

      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  // Try native Date parsing
  const nativeDate = new Date(dateStr);
  if (!isNaN(nativeDate.getTime())) {
    return nativeDate;
  }

  return null;
}

function excelDateToJSDate(serial: number): Date {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  return dateInfo;
}

function addBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
      addedDays++;
    }
  }
  
  return result;
}
