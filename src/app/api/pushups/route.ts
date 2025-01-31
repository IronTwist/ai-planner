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
  const {
    name,
    programLevel,
    pushups: { set1, set2, set3, set4, set5 },
  } = await request.json();
  if (typeof window === 'undefined') {
    const date = new Date().toLocaleDateString();
    const total = set1 + set2 + set3 + set4 + set5;

    if (!name) {
      return NextResponse.json({ message: 'Invalid data.' });
    }

    console.log('file: ', filePath);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        `${name},${programLevel},${set1},${set2},${set3},${set4},${set5},${total},${date}\n`,
      );

      return NextResponse.json({ message: 'Data saved successfully.' });
    }

    const totalPushups = updateTotalPushups(name, total);

    const row = `${name},${programLevel},${set1},${set2},${set3},${set4},${set5},${totalPushups},${date}\n`;
    fs.appendFileSync(filePath, row);

    return NextResponse.json({ message: 'Data saved successfully.' });
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
