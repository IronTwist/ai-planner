import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'data.csv');

// Ensure the directory exists
const dirPath = path.dirname(filePath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const clearCSVFile = () => {
  fs.writeFileSync(filePath, ''); // Overwrites the file with an empty string
};

export async function POST(request: Request) {
  const { rows } = await request.json();

  console.log('ROws: ', rows);

  clearCSVFile();

  rows.forEach((row: string) => {
    console.log('row: ', row);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `${row}\n`);
    } else {
      fs.appendFileSync(filePath, `${row}\n`);
    }
  });

  return NextResponse.json({ message: 'Data load successfully.' });
}
