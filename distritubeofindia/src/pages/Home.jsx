// @ts-nocheck
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useAuth } from '../App.jsx'
import { db, storage } from '../firebase.js'
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'


function PostCard({ post }) {
  return (
    <div className="rounded-xl border border-emerald-200 overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img src={post.imageUrl} alt="Post" className="w-full h-64 object-cover" />
      <div className="p-3 text-sm text-slate-700 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-900">{post.isAnonymous ? 'Anonymous' : (post.userDisplayName || 'User')}</span>
          {post.createdAt && (
            <time className="text-xs text-slate-500">{new Date(post.createdAt.seconds * 1000).toLocaleString()}</time>
          )}
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
  const touchStartXRef = useRef(0)
  const touchMovedRef = useRef(false)

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [cameraLoading, setCameraLoading] = useState(false)

  const firebaseReady = !!db && !!storage

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
    try {
      // Try different camera constraints for better compatibility
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 }
        },
        audio: false
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve
        })
        await videoRef.current.play()
      }
      setCameraOpen(true)
      setCameraLoading(false)
    } catch (err) {
      console.error('Camera error:', err)
      // Try fallback constraints if the first attempt fails
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        })
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream
          await videoRef.current.play()
        }
        setCameraOpen(true)
        setCameraLoading(false)
      } catch (fallbackErr) {
        setCameraError('Unable to access camera. Please check permissions and try again.')
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
      // Wait for video to be ready
      if (video.readyState < 2) {
        setCameraError('Camera not ready. Please wait a moment and try again.')
        return
      }

      // Get actual video dimensions
      const width = video.videoWidth
      const height = video.videoHeight
      
      if (!width || !height) {
        setCameraError('Invalid video dimensions')
        return
      }

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

      // Convert to blob with better quality
      canvas.toBlob((blob) => {
        if (!blob) {
          setCameraError('Failed to capture image')
          return
        }
        
        const capturedFile = new File([blob], `camera-${Date.now()}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        })
        
        setFile(capturedFile)
        closeCamera()
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
      
        <h1 className="text-5xl font-bold text-green-600 text-center mt-3">
        "𝘏𝘦𝘭𝘱𝘪𝘯𝘨 𝘰𝘵𝘩𝘦𝘳𝘴 𝘪𝘴 𝘭𝘪𝘬𝘦 𝘩𝘦𝘭𝘱𝘪𝘯𝘨 𝘺𝘰𝘶𝘳𝘴𝘦𝘭𝘧"
      </h1>
        <h3 className="text-center text-yellow-500-600">-Destritube of India</h3>
      <section className="rounded-xl border border-emerald-200 bg-blue font-bold p-4 shadow-sm reveal scale-in transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <h2 className="text-lg font-bold text-blue-900 ">Post a Photo to Raise Awareness</h2>
        <p className="text-sm text-slate-600 mt-1">Please share only relevant images aimed at seeking help or highlighting genuine need. Inappropriate or irrelevant posts may lead to a ban and be reported.</p>
      </section>

      {/* Understanding section: illustrative examples (carousel) */}
      <section className=" flex  grid-cols-1 lg:grid-cols-9 gap-6 reveal justify-center ">
  <div className="lg:col-span-3 lg:order-1 ">
    {/* Outer wrapper with animated glow */}
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-green-400 via-emerald-500 to-blue-500 animate-pulse blur opacity-70"></div>
      <div className="relative rounded-xl border border-emerald-300 bg-gradient-to-br from-green-200 via-green-300 to-blue-500 p-5 shadow-lg space-y-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl reveal slide-in-left">
        <h3 className="text-center text-2xl font-bold text-green-600 animate-pulse drop-shadow-lg">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openCamera}
                disabled={cameraLoading}
                className={`px-3 py-1 rounded-lg border border-emerald-500 text-xs flex items-center gap-1 bg-white shadow-md transition-all duration-300 ${
                  cameraLoading
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
            {cameraError && (
              <div className="text-xs text-rose-600">{cameraError}</div>
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
                  <video
                    ref={videoRef}
                    className="w-full aspect-video object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
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
              <button className="px-3 py-1 rounded-lg border text-xs bg-white shadow hover:bg-emerald-50">
                Post Anonymously
              </button>
              <button className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs shadow hover:bg-sky-700">
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
        <div className="  lg:col-span-8 lg:order-2">
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
  )
}