import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';
import { parse } from 'date-fns';
import { toDate } from 'date-fns-tz';

// Get timezone from environment variable, default to UTC if not set
const TIMEZONE = process.env.TIMEZONE || 'UTC';

// Define the expected structure of an Excel row
interface ExcelRow {
  [key: string]: string | number | Date | undefined;
  date?: string | number | Date;
  Date?: string | number | Date;
  measurement1?: string | number;
  'measurement 1'?: string | number;
  'Measurement 1'?: string | number;
  measurement2?: string | number;
  'measurement 2'?: string | number;
  'Measurement 2'?: string | number;
  measurement3?: string | number;
  'measurement 3'?: string | number;
  'Measurement 3'?: string | number;
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Process form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Get the first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
    
    // Validate data structure
    if (!data.length) {
      return NextResponse.json({ error: 'No data found in the Excel file' }, { status: 400 });
    }
    
    // Process each row
    const entries = [];
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Excel rows start at 1, plus header row
      
      // Extract date and measurements
      const dateValue = row.date || row.Date;
      const measurement1 = row.measurement1 || row['measurement 1'] || row['Measurement 1'];
      const measurement2 = row.measurement2 || row['measurement 2'] || row['Measurement 2'];
      const measurement3 = row.measurement3 || row['measurement 3'] || row['Measurement 3'];
      
      if (!dateValue) {
        errors.push(`Row ${rowNum}: Missing date`);
        continue;
      }
      
      if (!measurement1 && !measurement2 && !measurement3) {
        errors.push(`Row ${rowNum}: No measurements found`);
        continue;
      }
      
      // Parse the date
      let baseDate;
      try {
        if (typeof dateValue === 'string') {
          // Try to parse date string in multiple formats
          baseDate = parse(dateValue, 'yyyy-MM-dd', new Date());
          
          if (isNaN(baseDate.getTime())) {
            baseDate = parse(dateValue, 'MM/dd/yyyy', new Date());
          }
          
          // Add support for dd.MM.yyyy format
          if (isNaN(baseDate.getTime())) {
            baseDate = parse(dateValue, 'dd.MM.yyyy', new Date());
          }

          // Manual parsing as fallback
          if (isNaN(baseDate.getTime())) {
            // Try to manually parse dd.MM.yyyy format
            const parts = dateValue.split('.');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
              const year = parseInt(parts[2], 10);
              
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                baseDate = new Date(year, month, day);
              }
            }
          }
          
          // Try parsing as Excel serial date number
          if (isNaN(baseDate?.getTime())) {
            const excelSerialDate = parseInt(dateValue, 10);
            if (!isNaN(excelSerialDate)) {
              // Convert Excel serial date to JavaScript Date
              baseDate = new Date(Date.UTC(1899, 11, 30 + excelSerialDate));
            }
          }
        } else if (typeof dateValue === 'number') {
          // Excel stores dates as numbers (days since Dec 30, 1899)
          console.log(`Parsing numeric date: ${dateValue}`);
          
          // Try using XLSX utility first
          baseDate = XLSX.SSF.parse_date_code(dateValue);
          
          // If that fails, use manual calculation
          if (!baseDate || isNaN(baseDate?.getTime?.())) {
            baseDate = new Date(Date.UTC(1899, 11, 30 + dateValue));
          }
        }
        
        if (isNaN(baseDate?.getTime?.() || NaN)) {
          errors.push(`Row ${rowNum}: Invalid date format - Could not parse "${dateValue}"`);
          continue;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error parsing date';
        errors.push(`Row ${rowNum}: Error parsing date - ${errorMessage}`);
        continue;
      }
      
      // Add entries for each measurement with the specified times
      if (measurement1 !== undefined && measurement1 !== null && measurement1 !== '') {
        // Create date with 8:00 AM in the configured timezone
        const dateStr = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')} 08:00:00`;
        const utcDate1 = toDate(dateStr, { timeZone: TIMEZONE });
        
        entries.push({
          value: typeof measurement1 === 'number' ? measurement1 : parseFloat(String(measurement1)),
          date: utcDate1,
          userId,
          notes: `Imported from Excel (Morning)`,
        });
      }
      
      if (measurement2 !== undefined && measurement2 !== null && measurement2 !== '') {
        // Create date with 12:00 PM in the configured timezone
        const dateStr = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')} 12:00:00`;
        const utcDate2 = toDate(dateStr, { timeZone: TIMEZONE });
        
        entries.push({
          value: typeof measurement2 === 'number' ? measurement2 : parseFloat(String(measurement2)),
          date: utcDate2,
          userId,
          notes: `Imported from Excel (Noon)`,
        });
      }
      
      if (measurement3 !== undefined && measurement3 !== null && measurement3 !== '') {
        // Create date with 8:00 PM in the configured timezone
        const dateStr = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')} 20:00:00`;
        const utcDate3 = toDate(dateStr, { timeZone: TIMEZONE });
        
        entries.push({
          value: typeof measurement3 === 'number' ? measurement3 : parseFloat(String(measurement3)),
          date: utcDate3,
          userId,
          notes: `Imported from Excel (Evening)`,
        });
      }
    }
    
    // Save entries to the database
    if (entries.length > 0) {
      await prisma.userEntry.createMany({
        data: entries,
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      imported: entries.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'An error occurred during import' }, { status: 500 });
  }
}