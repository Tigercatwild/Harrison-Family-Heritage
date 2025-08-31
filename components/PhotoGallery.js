'use client'
import { useState, useEffect } from 'react'
import { getFamilyPhotos, getFeaturedPhotos } from '../lib/supabase'

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [featuredPhotos, setFeaturedPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    loadPhotos()
    loadFeaturedPhotos()
  }, [])

  const loadPhotos = async () => {
    const photoData = await getFamilyPhotos()
    setPhotos(photoData)
  }

  const loadFeaturedPhotos = async () => {
    const featured = await getFeaturedPhotos()
    setFeaturedPhotos(featured)
  }

  // Default photos for demo (replace with database photos)
  const defaultPhotos = [
    {
      id: 1,
      photo_url: '/api/placeholder/300/200',
      caption: 'Family Reunion 2018',
      event_name: 'Lake City, Florida - July 20-22, 2018',
      photo_date: '2018-07-20'
    },
    {
      id: 2,
      photo_url: '/api/placeholder/300/200',
      caption: 'Harrison Family Heritage',
      event_name: 'Historical family photos and documents',
      photo_date: '1950-01-01'
    },
    {
      id: 3,
      photo_url: '/api/placeholder/300/200',
      caption: 'Multi-Generational Gathering',
      event_name: 'Celebrating our family connections',
      photo_date: '2010-08-15'
    },
    {
      id: 4,
      photo_url: '/api/placeholder/300/200',
      caption: 'Family Memories',
      event_name: 'Upload your family photos to share memories',
      photo_date: '2015-12-25'
    }
  ]

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Family Photo Gallery</h2>
          
          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">How to Add Family Photos</h3>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 mb-2">For Family Members:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                <li>Create a member account and log in</li>
                <li>Go to your Member Dashboard</li>
                <li>Click &ldquo;Upload Photo&rdquo; button</li>
                <li>Add photo, caption, date, and event details</li>
                <li>Submit - your photo will appear in the gallery for all to enjoy!</li>
              </ol>
              <p className="text-sm text-gray-600 italic">
                Photos are visible to everyone, but only logged-in family members can upload new ones.
              </p>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={photo.photo_url}
                  alt={photo.caption}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{photo.caption}</h3>
                <p className="text-gray-600 text-sm mb-1">{photo.event_name}</p>
                {photo.photo_date && (
                  <p className="text-gray-500 text-xs">
                    {new Date(photo.photo_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
              <div className="relative">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
                >
                  ×
                </button>
                <img
                  src={selectedPhoto.photo_url}
                  alt={selectedPhoto.caption}
                  className="w-full max-h-96 object-contain"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {selectedPhoto.caption}
                  </h3>
                  <p className="text-gray-600 mb-2">{selectedPhoto.event_name}</p>
                  {selectedPhoto.photo_date && (
                    <p className="text-gray-500 text-sm">
                      {new Date(selectedPhoto.photo_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-green-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Share Your Family Memories
            </h3>
            <p className="text-green-700 mb-4">
              Help preserve our family legacy by contributing your photos and stories.
            </p>
            <a
              href="/login"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Login to Upload Photos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
