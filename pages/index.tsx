import type { NextPage } from 'next'
import type { ImageProps } from '~/utils/types'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { Layout, Hero, Modal, PhotoGrid } from '~/components'
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto'
import getBase64ImageUrl from '~/utils/generateBlurPlaceholder'
import cloudinary from '~/utils/cloudinary'

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter()
  const { photoId } = router.query
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>()

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef?.current?.scrollIntoView({ block: 'center' })
      setLastViewedPhoto(null)
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto])

  return (
    <Layout>
      <Hero />
      <div className="p-2 md:p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              // @ts-ignore
              setLastViewedPhoto(photoId)
            }}
          />
        )}
        {images && images.length > 0 && (
          <PhotoGrid
            images={images}
            lastViewedPhoto={lastViewedPhoto}
            lastViewedPhotoRef={lastViewedPhotoRef}
          />
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by('public_id', 'desc')
    .max_results(400)
    .execute()
  let reducedResults: ImageProps[] = []

  let i = 0
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      topLevelDirectory: result?.public_id?.split('/')[1],
      format: result.format,
    })
    i++
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image)
  })
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
  }

  return {
    props: {
      images: JSON.parse(JSON.stringify(reducedResults)) || null,
    },
  }
}

export default Home
