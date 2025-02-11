import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const folder = searchParams.get('folder')

  if (!folder) {
    return NextResponse.json(
      { error: 'Folder parameter is required' },
      { status: 400 }
    )
  }

  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}/*`)
      .sort_by('uploaded_at', 'desc')
      .max_results(120)
      .execute()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}
