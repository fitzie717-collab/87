
import { NextRequest, NextResponse } from 'next/server';
import { analyzeCombined } from '@/ai';
import * as fs from 'fs/promises';
import * as path from 'path';

async function imageFileToDataUri(filePath: string): Promise<string> {
  const fileExtension = path.extname(filePath).slice(1);
  let mimeType = 'image/png'; // Default
  if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
    mimeType = 'image/jpeg';
  } else if (fileExtension === 'png') {
    mimeType = 'image/png';
  }

  const fileBuffer = await fs.readFile(filePath);
  const base64Data = fileBuffer.toString('base64');
  return `data:${mimeType};base64,${base64Data}`;
}

export async function GET(request: NextRequest) {
  try {
    // Construct the path to the test image in the public directory
    const imagePath = path.join(process.cwd(), 'public', 'test-asset.png');

    // Convert the image to a data URI
    const dataUri = await imageFileToDataUri(imagePath);

    console.log('Running analysis on test asset...');
    
    // Call the combined analysis flow
    const analysisResult = await analyzeCombined({
      media: dataUri,
      manualData: {
        campaignName: 'Test Campaign',
      },
      quantitativeData: {}
    });

    console.log('Analysis complete.');

    // Return the result as JSON
    return NextResponse.json(analysisResult);

  } catch (error: any) {
    console.error('Error during test analysis:', error);
    // Return a detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to run test analysis.',
        details: error.message,
        stack: error.stack
      }, 
      { status: 500 }
    );
  }
}
