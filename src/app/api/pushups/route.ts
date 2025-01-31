import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'data.csv');

// Ensure the directory exists
const dirPath = path.dirname(filePath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const updateTotalPushups = (name: string, pushups: number) => {
  const data = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
  let total = 0;
  data.forEach(row => {
    console.log('row-split: ', row.split(','));
    const [rowName, programLevel, set1, set2, set3, set4, set5] =
      row.split(',');
    console.log('Program level: ', programLevel);
    if (rowName === name)
      total +=
        parseInt(set1) +
        parseInt(set2) +
        parseInt(set3) +
        parseInt(set4) +
        parseInt(set5);
  });

  return total + pushups;
};

const toArrOfObjects = (data: string[]) => {
  return data.map(row => {
    const split = row.split(',');

    return {
      name: split[0],
      programLevel: split[1],
      pushups: {
        set1: split[2],
        set2: split[3],
        set3: split[4],
        set4: split[5],
        set5: split[6],
      },
      totalPushups: split[7],
      date: split[8],
    };
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') as string;
  console.log('name: ', name);

  const data = fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .filter(row => (name ? row.split(',')[0] === name : row));
  console.log('data: ', data);
  const test = toArrOfObjects(data);
  console.log('Test: ', test);

  const response = NextResponse.json({
    data: toArrOfObjects(data),
    count: data.length,
  });

  // ✅ Fix CORS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

// ✅ Handle OPTIONS (Preflight Request)
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export async function POST(request: Request) {
  try {
    const {
      name,
      programLevel,
      pushups: { set1, set2, set3, set4, set5 },
    } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Invalid data.' }, { status: 400 });
    }

    const total = set1 + set2 + set3 + set4 + set5;
    const date = new Date().toISOString();

    console.log('Saving to file:', filePath);

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Prepare CSV row
    const row = `${name},${programLevel},${set1},${set2},${set3},${set4},${set5},${total},${date}\n`;

    // If file doesn't exist, create it with a header
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        'Name,Program Level,Set1,Set2,Set3,Set4,Set5,Total Pushups,Date\n',
      );
    }

    // Append new data
    fs.appendFileSync(filePath, row);

    return new NextResponse(
      JSON.stringify({ message: 'Data saved successfully.' }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      },
    );
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  // fs.unlinkSync(filePath, (err) => {
  //     if (err){
  //         return NextResponse.json({ error: err})
  //     }

  //     return NextResponse.json({ message: "File deleted sucessfully!"})
  // })

  fs.unlinkSync(filePath);

  NextResponse.json({ message: 'File deleted sucessfully!' });
}
