import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const teacherColumns = [
  'email',
  'password',
  'name',
  'createdAt',
  'gender',
  'telNumber',
  'address',
  'subjects',
  'dateBirth',
  'joiningDate',
  'status',
  'classes',
];

const studentColumns = [
  'email',
  'password',
  'name',
  'createdAt',
  'telNumber',
  'parentPhoneNumber',
  'parentName',
  'status',
  'gender',
  'address',
  'dateOfBirth',
  'classes',
];

const workbook = XLSX.utils.book_new();

// Create Teachers sheet with headers and example data
const teacherData = [
  teacherColumns,
  ['teacher1@example.com', 'pass123', 'Ahmed Hassan', '2024-01-15', 'Male', '01023456789', '123 School St', 'Math, Physics', '1985-06-20', '2023-09-01', 'Active', 'Class A, Class B'],
  ['teacher2@example.com', 'pass456', 'Fatima Mohamed', '2024-02-10', 'Female', '01123456789', '456 Education Ave', 'English, Literature', '1990-03-15', '2023-10-15', 'Active', 'Class C, Class D'],
  ['teacher3@example.com', 'pass789', 'Ibrahim Ali', '2024-03-05', 'Male', '01223456789', '789 Academy Rd', 'Chemistry, Biology', '1988-11-25', '2024-01-01', 'Active', 'Class E, Class F'],
];
const teacherSheet = XLSX.utils.aoa_to_sheet(teacherData);
XLSX.utils.book_append_sheet(workbook, teacherSheet, 'Teachers');

// Create Students sheet with headers and example data
const studentData = [
  studentColumns,
  ['student1@example.com', 'pass123', 'Karim Hassan', '2024-01-20', '01512345678', '01098765432', 'Ahmed Hassan', 'Active', 'Male', '123 Student St', '2008-05-12', 'Class A'],
  ['student2@example.com', 'pass456', 'Layla Mohamed', '2024-02-15', '01612345678', '01198765432', 'Fatima Mohamed', 'Active', 'Female', '456 Student Ave', '2009-08-08', 'Class B'],
  ['student3@example.com', 'pass789', 'Youssef Ali', '2024-03-10', '01712345678', '01298765432', 'Ahmed Hassan', 'Active', 'Male', '789 Student Rd', '2007-12-03', 'Class C'],
  ['student4@example.com', 'pass101', 'Noor Khalid', '2024-04-05', '01812345678', '01398765432', 'Khalid Mohammed', 'Inactive', 'Female', '321 Student Blvd', '2010-02-14', 'Class D'],
];
const studentSheet = XLSX.utils.aoa_to_sheet(studentData);
XLSX.utils.book_append_sheet(workbook, studentSheet, 'Students');

// Save to file
XLSX.writeFile(workbook, './example.xlsx');
console.log('Excel file created: example.xlsx');
