'use client'

import { useState, useEffect } from 'react'

interface CloudinaryImage {
  public_id: string
  secure_url: string
}

export function useCloudinaryImages(folder: string) {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/cloudinary-images?folder=${encodeURIComponent(folder)}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }
        const data = await response.json()
        setImages(data.resources)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [folder])

  return { images, isLoading, error }
}
