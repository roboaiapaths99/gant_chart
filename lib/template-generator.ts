import * as XLSX from 'xlsx';

export function generateTemplate(): Buffer {
  const workbook = XLSX.utils.book_new();

  // Main sheet
  const data = [
    ['ID', 'Task Name', 'Duration (days)', 'Start Date', 'Finish Date', 'Predecessors', 'Resource Names', 'Progress (%)'],
    [1, 'PCC', 1, '13-04-26', '13-04-26', '', 'Civil Crew', 0],
    [2, 'RCC Raft Steel work', 3, '14-04-26', '16-04-26', '1', 'Steel Team', 0],
    [3, 'All Pedestrial Column Layout', 2, '17-04-26', '18-04-26', '2', 'Layout Team', 0],
  ];

  // Add empty rows for user to fill
  for (let i = 4; i <= 25; i++) {
    data.push([i, '', '', '', '', '', '', 0]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },   // ID
    { wch: 25 },  // Task Name
    { wch: 15 },  // Duration
    { wch: 15 },  // Start Date
    { wch: 15 },  // Finish Date
    { wch: 15 },  // Predecessors
    { wch: 20 },  // Resource Names
    { wch: 12 },  // Progress
  ];

  // Style header row (bold with blue background)
  const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].s = {
      fill: { fgColor: { rgb: '1E40AF' } },
      font: { bold: true, color: { rgb: 'FFFFFF' } },
    };
  }

  // Style sample rows with light gray background
  for (let row = 1; row <= 3; row++) {
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        fill: { fgColor: { rgb: 'F3F4F6' } },
      };
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

  // Add README sheet
  const readmeData = [
    ['GanttFlow Project Template - Instructions'],
    [''],
    ['How to fill this template:'],
    [''],
    ['1. ID: Unique identifier for each task (1, 2, 3, ...)'],
    ['2. Task Name: Name of the task (e.g., "Foundation", "Wall Construction")'],
    ['3. Duration (days): How many days the task takes (must be > 0)'],
    ['4. Start Date: When the task begins (format: DD-MM-YY, e.g., 13-04-26)'],
    ['5. Finish Date: When the task ends (format: DD-MM-YY, e.g., 13-04-26)'],
    ['   - If left blank, it will be calculated from Start Date + Duration'],
    ['6. Predecessors: Task IDs that must finish before this task starts'],
    ['   - Separate multiple IDs with commas (e.g., "1,2,3")'],
    ['7. Resource Names: Who is responsible for this task (e.g., "Civil Crew")'],
    ['8. Progress (%): Completion percentage (0-100)'],
    [''],
    ['Tips:'],
    ['- Dates can be in DD-MM-YY, DD-MM-YYYY, MM/DD/YYYY, or YYYY-MM-DD format'],
    ['- Skip weekends when calculating dates automatically'],
    ['- Maximum 500 tasks per file (depending on your plan)'],
    ['- Save as .xlsx file before uploading'],
  ];

  const readmeWorksheet = XLSX.utils.aoa_to_sheet(readmeData);
  readmeWorksheet['!cols'] = [{ wch: 60 }];
  XLSX.utils.book_append_sheet(workbook, readmeWorksheet, 'README');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
