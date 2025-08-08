
import { NextRequest, NextResponse } from 'next/server';
import { DUMMY_ASSETS } from '@/lib/dummy-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const asset = DUMMY_ASSETS.find((a) => a.id === id);

  if (asset) {
    return NextResponse.json(asset);
  } else {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }
}
