// @ts-nocheck
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useAuth } from '../App.jsx'
import { db, storage } from '../firebase.js'
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import GreenCTAButton from "../pages/GreenCTAButton"// adjust path if needed



function PostCard({ post }) {
  const [rating, setRating] = useState(post.rating || 0)
  const [hasRated, setHasRated] = useState(false)

  const handleRating = (newRating) => {
    if (!hasRated) {
      setRating(newRating)
      setHasRated(true)
      // Here you would typically update the rating in Firestore
      console.log(`Rated post ${post.id} with ${newRating} stars`)
    }
  }

  return (
    <div className="rounded-xl border border-emerald-200 overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img src={post.imageUrl} alt="Post" className="w-full h-64 object-cover" />
      <div className="p-3 text-sm text-slate-700 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-900">{post.isAnonymous ? 'Anonymous' : (post.userDisplayName || 'User')}</span>
          {post.createdAt && (
            <time className="text-xs text-slate-500">{new Date(post.createdAt.seconds * 1000).toLocaleString()}</time>
          )}
        </div>
        
        {/* Rating System */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Rate this post:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={hasRated}
                className={`text-lg transition-colors ${
                  star <= rating 
                    ? 'text-yellow-400' 
                    : 'text-gray-300 hover:text-yellow-300'
                } ${hasRated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                ★
              </button>
            ))}
          </div>
          {hasRated && <span className="text-xs text-green-600">✓ Rated</span>}
        </div>

        {post.location && (
          <div className="text-xs text-slate-600">Location: {post.location.lat.toFixed(5)}, {post.location.lng.toFixed(5)}</div>
        )}
        {post.caption && <div className="mt-2">{post.caption}</div>}
      </div>
    </div>
  )
}

export default function Home() {
  const { user, loading, loginWithGoogle, loginAnonymously } = useAuth()
  const [posts, setPosts] = useState([])
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [sampleIndex, setSampleIndex] = useState(0)
  const [location, setLocation] = useState(null)
  const [caption, setCaption] = useState('')
  const [cautionAccepted, setCautionAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [memberCount, setMemberCount] = useState(1247)
  const [averageRating, setAverageRating] = useState(4.6)
  const [showJoinSuccess, setShowJoinSuccess] = useState(false)
  const touchStartXRef = useRef(0)
  const touchMovedRef = useRef(false)

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [cameraLoading, setCameraLoading] = useState(false)

  // Debug camera functionality on component mount
  useEffect(() => {
    console.log('Home component mounted, checking camera support...')
    console.log('navigator.mediaDevices:', !!navigator.mediaDevices)
    console.log('navigator.mediaDevices.getUserMedia:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia))
    console.log('HTTPS:', window.location.protocol === 'https:')
    console.log('Localhost:', window.location.hostname === 'localhost')
  }, [])

  const firebaseReady = !!db && !!storage

  // Check camera availability
  const [cameraAvailable, setCameraAvailable] = useState(false)
  const [streamActive, setStreamActive] = useState(false)
  
  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Check if we can enumerate devices
          const devices = await navigator.mediaDevices.enumerateDevices()
          const videoDevices = devices.filter(device => device.kind === 'videoinput')
          setCameraAvailable(videoDevices.length > 0)
          console.log('Camera devices found:', videoDevices.length)
          
          // Log device details for debugging
          videoDevices.forEach((device, index) => {
            console.log(`Camera ${index + 1}:`, device.label || `Camera ${index + 1}`, device.deviceId)
          })
        } else {
          setCameraAvailable(false)
        }
      } catch (error) {
        console.error('Error checking camera availability:', error)
        setCameraAvailable(false)
      }
    }
    
    checkCameraAvailability()
  }, [])
  
     // Monitor video stream status
   useEffect(() => {
     if (videoRef.current && cameraOpen) {
       const checkStream = setInterval(() => {
         const video = videoRef.current
         if (video && video.videoWidth > 0 && video.videoHeight > 0) {
           setStreamActive(true)
         } else {
           setStreamActive(false)
           
           // If we have a stream but no video dimensions, try to fix it
           if (video?.srcObject && !video.videoWidth) {
             console.log('Stream exists but no video, attempting to fix...')
             const currentStream = video.srcObject
             video.srcObject = null
             setTimeout(() => {
               if (video) {
                 video.srcObject = currentStream
                 video.load()
                 video.play().catch(e => console.error('Auto-fix play failed:', e))
               }
             }, 200)
           }
         }
       }, 1000) // Check every second
       
       return () => clearInterval(checkStream)
     }
   }, [cameraOpen])
  
  

  // Sample royalty-free illustrative images (Unsplash) to explain the context
  const sampleImages = [
    {
      url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200&auto=format&fit=crop',
      caption: 'Street-side assistance',
    },
    {
      url: 'https://th.bing.com/th/id/OIP.LCz9TK3nuDUyzZqt2hDL8QHaEY?w=251&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      caption: 'Community outreach',
    },
    {
      url: 'https://th.bing.com/th/id/OIP.u4zMAx8Ms-EaNY2xWbLywQHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      caption: 'Sharing a warm meal',
    },
  ]

  useEffect(() => {
    if (!db) {
      console.warn('Firestore not initialized')
      return
    }

    console.log('Setting up Firestore real-time listener...')
    
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      
      const unsub = onSnapshot(q, 
        (snapshot) => {
          console.log('Firestore update received:', snapshot.size, 'documents')
          const items = []
          snapshot.forEach((doc) => {
            const data = doc.data()
            items.push({ 
              id: doc.id, 
              ...data,
              // Ensure createdAt is properly formatted for display
              createdAt: data.createdAt ? data.createdAt : new Date()
            })
          })
          setPosts(items)
        },
        (error) => {
          console.error('Firestore listener error:', error)
          // Show user-friendly error message
          if (error.code === 'permission-denied') {
            console.warn('Firestore permission denied - check security rules')
          }
        }
      )
      
      return () => {
        console.log('Cleaning up Firestore listener')
        unsub()
      }
    } catch (error) {
      console.error('Error setting up Firestore listener:', error)
    }
  }, [db])

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Autoplay the understanding images one-by-one
  useEffect(() => {
    if (!sampleImages?.length) return
    const id = setInterval(() => {
      setSampleIndex((i) => (i + 1) % sampleImages.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const showPrevSample = useCallback(() => {
    setSampleIndex((i) => (i - 1 + sampleImages.length) % sampleImages.length)
  }, [])

  const showNextSample = useCallback(() => {
    setSampleIndex((i) => (i + 1) % sampleImages.length)
  }, [])

  const onTouchStart = useCallback((e) => {
    if (!e.touches || e.touches.length === 0) return
    touchStartXRef.current = e.touches[0].clientX
    touchMovedRef.current = false
  }, [])

  const onTouchMove = useCallback((e) => {
    touchMovedRef.current = true
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (!touchMovedRef.current) return
    const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : touchStartXRef.current
    const deltaX = endX - touchStartXRef.current
    const threshold = 40
    if (deltaX > threshold) {
      showPrevSample()
    } else if (deltaX < -threshold) {
      showNextSample()
    }
  }, [showPrevSample, showNextSample])

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported on this device.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => alert('Unable to get location: ' + err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const onSelectFile = useCallback((e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
  }, [])

  const stopStreamTracks = (stream) => {
    try {
      stream?.getTracks()?.forEach((t) => t.stop())
    } catch {}
  }

    const openCamera = useCallback(async () => {
    setCameraError('')
    setCameraLoading(true)
    setStreamActive(false) // Reset stream status
    
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported in this browser. Please use a modern browser or try uploading a file instead.')
      setCameraLoading(false)
      return
    }

    try {
      console.log('Attempting to open camera...')
      
             // Use simpler, more reliable constraints that work better
       const constraints = {
         video: {
           width: { ideal: 640, min: 320 },
           height: { ideal: 480, min: 240 }
         },
         audio: false
       }
       
       console.log('Requesting camera with constraints:', constraints)
       const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      console.log('Stream obtained successfully:', stream)
      console.log('Stream tracks:', stream.getTracks())
      
                    if (videoRef.current) {
         // Clear any existing stream first
         if (videoRef.current.srcObject) {
           const oldStream = videoRef.current.srcObject
           oldStream.getTracks().forEach(track => track.stop())
         }
         
         // Set the new stream
         videoRef.current.srcObject = stream
         
         // Force the video to load and play
         videoRef.current.load()
         
         try {
           await videoRef.current.play()
           console.log('Video play() successful')
           
                    // Force a check for stream activity after a short delay
         setTimeout(() => {
           if (videoRef.current && videoRef.current.videoWidth > 0) {
             setStreamActive(true)
             console.log('Stream confirmed active after play')
           } else {
             // If stream still not working, try to force it
             console.log('Stream not working, attempting to force refresh...')
             const currentStream = videoRef.current.srcObject
             if (currentStream) {
               videoRef.current.srcObject = null
               setTimeout(() => {
                 if (videoRef.current) {
                   videoRef.current.srcObject = currentStream
                   videoRef.current.load()
                   videoRef.current.play().catch(e => console.error('Force play failed:', e))
                 }
               }, 100)
             }
           }
         }, 500)
           
         } catch (playError) {
           console.error('Video play() failed:', playError)
           // Continue anyway as the stream might still work
         }
         
         console.log('Camera opened successfully')
       }
             setCameraOpen(true)
       setCameraLoading(false)
       
       // Add a retry mechanism if the stream doesn't work after 2 seconds
       setTimeout(() => {
         if (videoRef.current && !videoRef.current.videoWidth && videoRef.current.srcObject) {
           console.log('Stream not working after 2 seconds, retrying...')
           const currentStream = videoRef.current.srcObject
           videoRef.current.srcObject = null
           setTimeout(() => {
             if (videoRef.current) {
               videoRef.current.srcObject = currentStream
               videoRef.current.load()
               videoRef.current.play().catch(e => console.error('Retry play failed:', e))
             }
           }, 100)
         }
       }, 2000)
       
     } catch (err) {
      console.error('Camera error:', err)
      
      // Try fallback constraints if the first attempt fails
      try {
        console.log('Trying fallback camera constraints...')
                 const fallbackConstraints = { 
           video: { 
             width: { min: 320 },
             height: { min: 240 }
           }, 
           audio: false 
         }
        
        const fallbackStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
                 if (videoRef.current) {
           // Clear any existing stream first
           if (videoRef.current.srcObject) {
             const oldStream = videoRef.current.srcObject
             oldStream.getTracks().forEach(track => track.stop())
           }
           
           videoRef.current.srcObject = fallbackStream
           videoRef.current.load()
           
           try {
             await videoRef.current.play()
             
             // Force a check for stream activity after a short delay
             setTimeout(() => {
               if (videoRef.current && videoRef.current.videoWidth > 0) {
                 setStreamActive(true)
               }
             }, 1000)
             
           } catch (playError) {
             console.error('Fallback video play() failed:', playError)
             // Continue anyway as the stream might still work
           }
         }
        setCameraOpen(true)
        setCameraLoading(false)
        console.log('Camera opened with fallback constraints')
      } catch (fallbackErr) {
        console.error('Fallback camera error:', fallbackErr)
        
        // Provide specific error messages based on error type
        let errorMessage = 'Unable to access camera. '
        if (fallbackErr.name === 'NotAllowedError') {
          errorMessage += 'Camera permission denied. Please allow camera access and try again.'
        } else if (fallbackErr.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.'
        } else if (fallbackErr.name === 'NotReadableError') {
          errorMessage += 'Camera is already in use by another application.'
        } else if (fallbackErr.name === 'OverconstrainedError') {
          errorMessage += 'Camera constraints not supported. Please try uploading a file instead.'
        } else {
          errorMessage += `Error: ${fallbackErr.message}. Please check permissions and try again.`
        }
        
        setCameraError(errorMessage)
        setCameraOpen(false)
        setCameraLoading(false)
      }
    }
  }, [])

  const closeCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject
    if (stream) stopStreamTracks(stream)
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOpen(false)
  }, [])

  const captureFromCamera = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) {
      setCameraError('Camera or canvas not available')
      return
    }

    try {
      console.log('Attempting to capture photo...')
      console.log('Video ready state:', video.readyState)
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight)
      
      // Wait for video to be ready
      if (video.readyState < 2) {
        setCameraError('Camera not ready. Please wait a moment and try again.')
        return
      }

      // Get actual video dimensions
      const width = video.videoWidth
      const height = video.videoHeight
      
      if (!width || !height) {
        setCameraError('Invalid video dimensions. Please try again.')
        return
      }

      console.log('Setting canvas dimensions to:', width, 'x', height)
      
      // Set canvas size to match video
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setCameraError('Failed to get canvas context')
        return
      }

      // Clear canvas and draw video frame
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(video, 0, 0, width, height)

      console.log('Image captured to canvas, converting to blob...')

      // Convert to blob with better quality
      canvas.toBlob((blob) => {
        if (!blob) {
          setCameraError('Failed to capture image')
          return
        }
        
        console.log('Blob created, size:', blob.size, 'bytes')
        
        const capturedFile = new File([blob], `camera-${Date.now()}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        })
        
        setFile(capturedFile)
        closeCamera()
        console.log('Photo captured successfully')
      }, 'image/jpeg', 0.95) // Higher quality
      
    } catch (err) {
      console.error('Capture error:', err)
      setCameraError('Failed to capture image: ' + err.message)
    }
  }, [closeCamera])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject
      if (stream) stopStreamTracks(stream)
    }
  }, [])

  const resetForm = useCallback(() => {
    setFile(null)
    setPreviewUrl('')
    setLocation(null)
    setCaption('')
    setCautionAccepted(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    closeCamera()
  }, [])

  const canSubmit = useMemo(() => !!user && !!file && !!location && cautionAccepted && !submitting && firebaseReady, [user, file, location, cautionAccepted, submitting, firebaseReady])

  const handleJoinCommunity = () => {
    setMemberCount(prev => prev + 1)
    setShowJoinSuccess(true)
    setTimeout(() => {
      setShowJoinSuccess(false)
    }, 3000) // Hide after 3 seconds
  }

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const timestamp = Date.now()
      const path = `posts/${user?.uid || 'anonymous'}/${timestamp}-${file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const imageUrl = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'posts'), {
        imageUrl,
        location,
        caption: caption.trim() || null,
        userId: user?.uid || null,
        userDisplayName: user?.isAnonymous ? null : (user?.displayName || user?.email || null),
        isAnonymous: !!user?.isAnonymous,
        createdAt: serverTimestamp(),
        cautionAccepted: true,
      })

      resetForm()
    } catch (e) {
      alert('Failed to post: ' + (e?.message || e))
    } finally {
      setSubmitting(false)
    }
  }, [canSubmit, user, file, caption, location, resetForm])
  const currentNews = [
    {
      title: 'Emergency Food Distribution',
      description: 'Local volunteers distributed food packets to 50+ homeless individuals in downtown area. Immediate assistance needed for medical supplies.',
      date: '2 hours ago',
      location: 'Downtown Market Area'
    },
    {
      title: 'Shelter Support Required',
      description: 'Temporary shelter opened for displaced families. Donations of blankets, clothes, and basic necessities urgently needed.',
      date: '5 hours ago',
      location: 'Community Center'
    },
    {
      title: 'Medical Camp Success',
      description: 'Free medical checkup camp served 100+ people. Follow-up care and medication support required for chronic patients.',
      date: '1 day ago',
      location: 'Public Health Center'
    },
    {
      title: 'Education Support',
      description: 'School supplies distributed to 25 children from low-income families. More books and stationery needed.',
      date: '2 days ago',
      location: 'Local School'
    }
  ]


  return (
    <>
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* News & Updates Section (placed right after navbar) */}
      {/* <section className="w-full reveal slide-in-left">
        <div className="rounded-xl border border-emerald-200 bg-green shadow-md p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text- font-semibold text-slate-400 flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-emerald-600 bg-blue">newspaper</span>
            Community News & Updates
          </h3>

          {currentNews.length === 0 ? (
            <p className="text-xs text-slate-700">No news available at the moment.</p>
          ) : (
            <div className="space-y-3">
              {currentNews.map((news, index) => (
                <div key={index} className="rounded-lg border border-emerald-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-slate-900 text-sm">{news.title}</h4>
                    <span className="text-[10px] text-slate-600">{news.date}</span>
                  </div>
                  <p className="text-xs text-slate-800 mb-1">{news.description}</p>
                  <p className="text-[10px] text-slate-600">
                    <span className="material-symbols-outlined text-emerald-600 text-sm mr-1">place</span>
                    {news.location}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section> */}
      {!firebaseReady && (
        <div className="rounded border p-3 text-sm bg-amber-50 border-amber-200 text-amber-900">
          Firebase is not fully configured. Add your keys to .env.local and restart the dev server. You can still view the UI but posting and feed are disabled.
        </div>
      )}
      
        
        <h3 className="text-5xl font-bold text-white text-center mt-3">Destitute of India</h3>
        
<h3 className="text-center text-lg md:text-xl lg:text-1xl font-bold text-white relative">
  <span className="relative z-10">
    DestitutesOfIndia is committed to shining a light on the lives of those often overlooked. Through collaboration, transparency, and compassion, we connect communities, volunteers, and organizations to provide timely and meaningful support.
  </span>
  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 opacity-20 blur-lg rounded-lg animate-pulse text-style-italic"></span>
</h3>

{/* Member Count and Rating Stats */}
<section className="py-8">
  <div className="max-w-4xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Member Count */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Community Members</h4>
            <p className="text-3xl font-bold text-primary mb-1">{memberCount.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Active contributors</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-primary">group</span>
          </div>
        </div>
        <button 
          onClick={handleJoinCommunity}
          className="mt-4 w-full bg-gradient-to-r from-primary to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          + Join Community
        </button>
      </div>

      {/* Rating Stats */}
      <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Community Rating</h4>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-3xl font-bold text-secondary">{averageRating}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= Math.floor(averageRating) 
                        ? 'text-yellow-400' 
                        : star === Math.ceil(averageRating) && averageRating % 1 !== 0
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              </div>
            {/* </div>  {posts.length} */}
            <p className="text-sm text-gray-600">Based on 20 posts</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-secondary">star</span>
          </div>
        </div>
        <button className="mt-4 w-full bg-gradient-to-r from-secondary to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">rate_review</span>
          Rate Our Service
        </button>
      </div>
    </div>
  </div>
</section>

  
        <div className="flex flex-col sm:flex-row justify-center gap-6">
         <GreenCTAButton type="donate" />
      <GreenCTAButton type="contact" />
      </div>

      {/* Understanding section: illustrative examples (carousel) */}
      <section className=" flex  grid-cols-1 lg:grid-cols-9 gap-6 reveal justify-center ">
  <div className=" bg-blue-600 lg:col-span-3 lg:order-1  rounded-xl">
    {/* Outer wrapper with animated glow */}
    <div className="relative">
      <div className=""></div>
      <div className="  relative rounded-xl border border-emerald-300 bg-blue/600 p-5 shadow-lg space-y-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl reveal slide-in-left">
    
        <h3 className="text-center text-2xl font-bold text-white animate-pulse drop-shadow-lg">
          ✨ Create a Post ✨
        </h3>
        {loading ? (
          <div className="text-sm text-slate-600">Checking sign-in…</div>
        ) : user ? (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onSelectFile}
              className="block w-full text-sm border border-emerald-300 rounded-lg p-2 bg-white shadow-sm hover:border-emerald-500"
            />
            <div className="space-y-2">
              {/* Camera Status Indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${cameraAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={cameraAvailable ? 'text-green-700' : 'text-red-700'}>
                  {cameraAvailable ? 'Camera Available' : 'Camera Not Available'}
                </span>
              </div>
              {!cameraAvailable && (
                <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded border">
                  <strong>Note:</strong> Camera access requires HTTPS or localhost. If you're on HTTP, please use the file upload option above.
                </div>

              )}
              
                             <div className="flex items-center gap-2">
                 <button
                   type="button"
                   onClick={openCamera}
                   disabled={cameraLoading || !cameraAvailable}
                   className={`px-3 py-1 rounded-lg border border-emerald-500 text-xs flex items-center gap-1 bg-white shadow-md transition-all duration-300 ${
                     cameraLoading || !cameraAvailable
                       ? "opacity-50 cursor-not-allowed"
                       : "hover:bg-emerald-50 hover:scale-105"
                   }`}
                 >
                   <span
                     className={`material-symbols-outlined text-green-600 ${
                       cameraLoading ? "spin" : ""
                     }`}
                   >
                     {cameraLoading ? "sync" : "photo_camera"}
                   </span>
                   {cameraLoading ? "Opening..." : "Open Camera"}
                 </button>
                 
                                   
                 
                  {cameraOpen && (
                   <button
                     type="button"
                     onClick={closeCamera}
                     className="px-3 py-1 rounded-lg border text-xs flex items-center gap-1 bg-red-50 hover:bg-red-100 transition-all duration-300"
                   >
                     <span className="material-symbols-outlined text-rose-600">
                       close
                     </span>
                     Close
                   </button>
                 )}
               </div>
            </div>
            {cameraError && (
              <div className="space-y-2">
                <div className="text-xs text-rose-600">{cameraError}</div>
                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border">
                  <strong>Troubleshooting:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Make sure you're using HTTPS (required for camera access)</li>
                    <li>Check if camera permissions are allowed in your browser</li>
                    <li>Try refreshing the page and allowing camera access when prompted</li>
                    <li>If camera still doesn't work, use the file upload option above</li>
                  </ul>
                </div>
              </div>
            )}
            {cameraOpen && (
              <div className="space-y-3">
                                 <div className="rounded-lg overflow-hidden border-4 border-emerald-400 bg-black relative shadow-lg">
                   {/* Logo in Camera Section */}
                   <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-white/70 px-2 py-1 rounded-full shadow-md">
                     <img
                       src="/logo.png"
                       alt="Logo"
                       className="w-6 h-6 rounded-full"
                     />
                     <span className="text-green-600 font-bold text-sm">
                       Live Camera
                     </span>
                   </div>
                   
                   {/* Camera Loading Indicator */}
                   {cameraLoading && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                       <div className="text-white text-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-2"></div>
                         <p className="text-sm">Opening camera...</p>
                       </div>
                     </div>
                   )}
                   
                                                           <video
                       ref={videoRef}
                       className="w-full aspect-video object-cover"
                       playsInline
                       muted
                       autoPlay
                                               onLoadedMetadata={() => {
                          if (videoRef.current?.videoWidth > 0) {
                            setStreamActive(true)
                          }
                        }}
                                               onCanPlay={() => {
                          if (videoRef.current?.videoWidth > 0) {
                            setStreamActive(true)
                          }
                        }}
                        onError={(e) => {
                          console.error('Video error:', e)
                        }}
                        onPlay={() => {
                          // Check if stream is actually working
                          setTimeout(() => {
                            if (videoRef.current && videoRef.current.videoWidth > 0) {
                              setStreamActive(true)
                            }
                          }, 100)
                        }}
                       style={{ backgroundColor: '#000' }}
                     />
                     
                     
                   
                   {/* Camera Status Overlay */}
                   {!cameraLoading && !streamActive && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                       <div className="text-white text-center p-4">
                         <span className="material-symbols-outlined text-4xl mb-2 block">camera_alt</span>
                         <p className="text-sm">Camera initializing...</p>
                         <p className="text-xs opacity-75 mt-1">Please wait for video feed</p>
                       </div>
                     </div>
                   )}
                   
                   {/* Stream Active Indicator */}
                   {streamActive && (
                     <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                       Live
                     </div>
                   )}
                   
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="border-2 border-white border-dashed rounded-lg w-48 h-32 opacity-50"></div>
                   </div>
                 </div>
                                 <div className="flex items-center gap-3">
                   <button
                     type="button"
                     onClick={captureFromCamera}
                     className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 bg-emerald-500 text-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-emerald-600"
                   >
                     <span className="material-symbols-outlined">camera</span>
                     Capture Photo
                   </button>
                   
                   
                   
                   <button
                     type="button"
                     onClick={closeCamera}
                     className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2 bg-slate-200 text-slate-700 shadow-md transition-all duration-300 hover:scale-110 hover:bg-slate-300"
                   >
                     <span className="material-symbols-outlined">close</span>
                     Cancel
                   </button>
                 </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
            
            {/* Photo Preview in Form */}
            {previewUrl && (
              <div className="rounded-lg border border-emerald-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <h4 className="text-sm font-medium mb-2 text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">image</span>
                  Photo Preview
                </h4>
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full max-h-48 object-contain rounded border border-slate-200" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      setPreviewUrl('')
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove photo"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {file?.name || 'Captured photo'} • {file?.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Ready to post'}
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded-lg border text-xs bg-emerald-500 text-white shadow-md transition-all duration-300 hover:bg-emerald-600 hover:scale-105 hover:shadow-lg"
                onClick={requestLocation}
              >
                Use Current Location
              </button>
              {location && (
                <span className="text-xs text-green-700 font-medium">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              )}
            </div>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-400"
            />
            <label className="flex items-start gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={cautionAccepted}
                onChange={(e) => setCautionAccepted(e.target.checked)}
              />
              <span className="text-green-700 font-medium">
                I confirm this post is relevant, respectful, and does not
                violate privacy. I understand misuse may lead to a ban and
                reporting to authorities.
              </span>
            </label>
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-lg text-sm text-white shadow-md transition-all duration-300 ${
                canSubmit
                  ? "bg-emerald-600 hover:bg-emerald-700 hover:scale-105 hover:shadow-lg"
                  : "bg-slate-400 cursor-not-allowed"
              }`}
            >
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="text-slate-700 text-center font-medium">
              Please sign in to post. You may choose to post anonymously.
            </p>
                         <div className="flex items-center gap-2 justify-center">
               <button 
                 onClick={loginAnonymously}
                 className="px-3 py-1 rounded-lg border text-xs bg-white shadow hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
               >
                 Post Anonymously
               </button>
               <button 
                 onClick={loginWithGoogle}
                 className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs shadow hover:bg-sky-700 transition-all duration-300 hover:scale-105"
               >
                 Login with Google
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  </div>
</section>

      
      {/* <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 reveal justify-center">
        <div className="lg:col-span-3 lg:order-1">
          <div className="rounded-xl border border-emerald-200 bg-blue p-4 shadow-sm space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md reveal slide-in-left ">
            <h3 className=" text-slate-900  bg-blue justify-center" >Create a Post</h3>
            {loading ? (
              <div className="text-sm text-slate-600">Checking sign-in…</div>
            ) : user ? (
              <div className="space-y-3">
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={onSelectFile} className="block w-full text-sm" />
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={openCamera} 
                    disabled={cameraLoading}
                    className={`px-3 py-1 rounded border text-xs flex items-center gap-1 transition-all duration-300 ${
                      cameraLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`material-symbols-outlined ${cameraLoading ? 'spin' : ''}`}>
                      {cameraLoading ? 'sync' : 'photo_camera'}
                    </span>
                    {cameraLoading ? 'Opening...' : 'Open Camera'}
                  </button>
                  {cameraOpen && (
                    <button type="button" onClick={closeCamera} className="px-3 py-1 rounded border text-xs flex items-center gap-1 hover:bg-slate-50 transition-all duration-300">
                      <span className="material-symbols-outlined">close</span>
                      Close
                    </button>
                  )}
                </div>
                {cameraError && <div className="text-xs text-rose-600">{cameraError}</div>}
                {cameraOpen && (
                  <div className="space-y-3">
                    <div className="rounded-lg overflow-hidden border-2 border-emerald-200 bg-black relative">
                      <video 
                        ref={videoRef} 
                        className="w-full aspect-video object-cover" 
                        playsInline 
                        muted 
                        autoPlay
                        onLoadedMetadata={() => console.log('Video metadata loaded')}
                        onCanPlay={() => console.log('Video can play')}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="border-2 border-white border-dashed rounded-lg w-48 h-32 opacity-50"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={captureFromCamera} 
                        className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
                      >
                        <span className="material-symbols-outlined">camera</span>
                        Capture Photo
                      </button>
                      <button 
                        type="button" 
                        onClick={closeCamera} 
                        className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
                      >
                        <span className="material-symbols-outlined">close</span>
                        Cancel
                      </button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button type="button" className="px-3 py-1 rounded border text-xs" onClick={requestLocation}>Use Current Location</button>
                  {location && <span className="text-xs text-slate-600">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>}
                </div>
                <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="w-full border rounded px-3 py-2 text-sm" />
                <label className="flex items-start gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={cautionAccepted} onChange={(e) => setCautionAccepted(e.target.checked)} />
                  <span>I confirm this post is relevant, respectful, and does not violate privacy. I understand misuse may lead to a ban and reporting to authorities.</span>
                </label>
                <button disabled={!canSubmit} onClick={handleSubmit} className={`px-4 py-2 rounded text-white text-sm ${canSubmit ? 'bg-emerald-600' : 'bg-slate-400 cursor-not-allowed'}`}>{submitting ? 'Posting…' : 'Post'}</button>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-slate-700">Please sign in to post. You may choose to post anonymously.</p>
                <div className="flex items-center gap-2">
                  <button onClick={loginAnonymously} className="px-3 py-1 rounded border text-xs">Post Anonymously</button>
                  <button onClick={loginWithGoogle} className="px-3 py-1 rounded bg-sky-600 text-white text-xs">Login with Google</button>
                </div>
              </div>
            )}
          </div>
        </div>
        </section> */}
        {/* News & Updates Section moved above, removed from grid */}

        {/* <div className="p-4 bg-emerald-100 text-emerald-400 rounded">Tailwind test</div> */}
        {/* <div className="  lg:col-span-8 lg:order-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-sky-600">imagesmode</span>Latest Posts</h3>
            <span className="text-xs text-slate-500">{posts.length} item(s)</span>
          </div>
          {previewUrl && (
            <div className="rounded-lg border border-emerald-200 bg-white p-2 mb-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md reveal scale-in">
              <h4 className="text-sm font-medium mb-2">Preview</h4>
              <img src={previewUrl} alt="Preview" className="w-full max-h-96 object-contain" />
            </div>
          )}

          {posts.length === 0 ? (
            <div className="rounded-lg border border-emerald-200 bg-white p-6 text-sm text-slate-600 flex items-center gap-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <span className="material-symbols-outlined text-slate-500">hourglass_empty</span>
              No posts yet — be the first to share a relevant, respectful photo.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
        <div className="hidden lg:block lg:col-span-3 lg:order-3">
        
        </div> */}
          <div className="lg:col-span-8 lg:order-2">
  <div className="flex items-center justify-between mb-2">
    <h3 className="font-bold text-slate-900 flex items-center gap-2 group">
      <span className="material-symbols-outlined text-sky-600 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
        imagesmode
      </span>
      <span className="transition-colors duration-300 group-hover:text-sky-600">
        Latest Posts
      </span>
    </h3>
    <span className="text-xs text-blue-500">{posts.length} item(s)</span>
  </div>

  {previewUrl && (
    <div className="rounded-lg border border-emerald-200 bg-white p-2 mb-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md reveal scale-in">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <span className="material-symbols-outlined text-emerald-500 animate-pulse">
          visibility
        </span>
        Preview
      </h4>
      <img
        src={previewUrl}
        alt="Preview"
        className="w-full max-h-96 object-contain rounded-md transition-transform duration-300 hover:scale-105"
      />
    </div>
  )}

  {posts.length === 0 ? (
    <div className="rounded-lg border border-emerald-200 bg-white p-6 text-sm text-slate-600 flex items-center gap-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <span className="material-symbols-outlined text-slate-500 animate-bounce">
        hourglass_empty
      </span>
      <span>No posts yet — be the first to share a relevant, respectful photo.</span>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal">
      {posts.map((p) => (
        <div className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <PostCard key={p.id} post={p} />
        </div>
      ))}
    </div>
  )}
</div>

<div className="hidden lg:block lg:col-span-3 lg:order-3 space-y-6">
  {/* Trending Tags */}
  <div className="rounded-lg border border-sky-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <h4 className="text-sm font-semibold mb-3 flex items-center gap-1 text-sky-600">
      <span className="material-symbols-outlined">local_fire_department</span>
      Trending Tags
    </h4>
    <div className="flex flex-wrap gap-2">
      {["#Hope", "#Support", "#Awareness", "#Unity"].map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700 hover:bg-sky-600 hover:text-white transition-colors duration-300 cursor-pointer"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>

  {/* Top Contributors */}
  <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <h4 className="text-sm font-semibold mb-3 flex items-center gap-1 text-emerald-600">
      <span className="material-symbols-outlined">emoji_events</span>
      Top Contributors
    </h4>
    <ul className="space-y-2 text-sm">
      <li className="flex items-center gap-2">
        <span className="material-symbols-outlined text-yellow-500">star</span>
        <span>Ravi Kumar</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="material-symbols-outlined text-sky-500">star</span>
        <span>Anjali Sharma</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="material-symbols-outlined text-emerald-500">star</span>
        <span>Mohammed Iqbal</span>
      </li>
    </ul>
  </div>

  {/* Recent News */}
  <div className="rounded-lg border border-indigo-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <h4 className="text-sm font-semibold mb-3 flex items-center gap-1 text-indigo-600">
      <span className="material-symbols-outlined">article</span>
      Recent News
    </h4>
    <ul className="space-y-2 text-sm">
      <li className="hover:text-indigo-600 transition-colors duration-300 cursor-pointer">
        Govt launches new shelter homes program
      </li>
      <li className="hover:text-indigo-600 transition-colors duration-300 cursor-pointer">
        NGO raises ₹5 lakh for education drive
      </li>
      <li className="hover:text-indigo-600 transition-colors duration-300 cursor-pointer">
        Local volunteers distribute 2,000 meals
      </li>
    </ul>
  </div>
</div>

<div className="hidden lg:block lg:col-span-3 lg:order-3">
  {/* You can add sidebar content here later */}
</div>

        <section className="reveal">
          
        <h3 className="section-title text-blue-900 font-bold  mb-3">Understanding the Context</h3>
        <p className="text-bold text-green-600 mb-3">These example images illustrate the kind of dignified, relevant photos that help the community understand needs. Do not upload faces without consent or any harmful content.</p>
        <div className="relative rounded-xl border border-emerald-200 bg-white shadow-sm overflow-hidden"
             onTouchStart={onTouchStart}
             onTouchMove={onTouchMove}
             onTouchEnd={onTouchEnd}>
          <figure className="transition-all duration-500">
            <img src={sampleImages[sampleIndex].url} alt={sampleImages[sampleIndex].caption} className="w-full h-60 sm:h-72 object-cover" />
            <figcaption className="p-3 text-xs text-slate-700">{sampleImages[sampleIndex].caption}</figcaption>
          </figure>
          <button type="button" onClick={showPrevSample} aria-label="Previous image" className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow transition">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button type="button" onClick={showNextSample} aria-label="Next image" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow transition">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {sampleImages.map((_, i) => (
              <button key={i} onClick={() => setSampleIndex(i)} aria-label={`Go to image ${i + 1}`} className={`h-2 w-2 rounded-full transition ${i === sampleIndex ? 'bg-emerald-600' : 'bg-emerald-200 hover:bg-emerald-300'}`}></button>
            ))}
          </div>
        </div>
      </section>


 <div classname="bg-blue">
      <section className="w-full flex justify-center px-4 py-6 bg-green">
  <div className="w-full max-w-3xl rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue shadow-md p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    
    {/* Header */}
     
    <h3 className="text-2xl font-bold text-green-700 flex items-center gap-2 mb-4 ">
      <span className="material-symbols-outlined text-emerald-600 bg-blue rounded-full p-1 shadow-sm">
        newspaper
      </span>
      Community News & Updates
    </h3>

    {/* News Content */}
    {currentNews.length === 0 ? (
      <p className="text-sm text-slate-500">No news available at the moment.</p>
    ) : (
      <div className="space-y-4">
        {currentNews.map((news, index) => (
          <div
            key={index}
            className="rounded-lg border border-emerald-200 bg-green p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-400"
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-slate-900 text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-500 text-base">
                  article
                </span>
                {news.title}
              </h4>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  calendar_month
                </span>
                {news.date}
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-2">{news.description}</p>
            <p className="text-[11px] text-slate-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-600 text-sm">
                place
              </span>
              {news.location}
            </p>
          </div>
        ))}
        
      </div>
    
     
    )}
    
  </div>
 
</section>
</div>


      
    </div>

    {/* Success Popup */}
    {showJoinSuccess && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-100">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-green-600">check_circle</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to the Community!</h3>
            <p className="text-gray-600 mb-6">
              You have successfully joined our community. Thank you for being part of our mission to help those in need.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">New member count:</span> {memberCount.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setShowJoinSuccess(false)}
              className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}