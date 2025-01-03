import { GoogleGenerativeAI } from '@google/generative-ai';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);
  console.log(result.response.text());

  return NextResponse.json({ response: result.response.text() });
}
