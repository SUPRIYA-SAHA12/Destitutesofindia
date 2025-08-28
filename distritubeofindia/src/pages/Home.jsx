// @ts-nocheck
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useAuth } from '../App.jsx'
import { db, storage } from '../firebase.js'
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'


function PostCard({ post }) {
  return (
    <div className="rounded border overflow-hidden bg-white">
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
  const [location, setLocation] = useState(null)
  const [caption, setCaption] = useState('')
  const [cautionAccepted, setCautionAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

  return (
     
    <div className="space-y-8">
      {!firebaseReady && (
        <div className="rounded border p-3 text-sm bg-amber-50 border-amber-200 text-amber-900">
          Firebase is not fully configured. Add your keys to .env.local and restart the dev server. You can still view the UI but posting and feed are disabled.
        </div>
      )}

      <section className="bg-emerald-50 border rounded p-4 reveal">
        <h2 className="text-lg font-semibold text-slate-900">Post a Photo to Raise Awareness</h2>
        <p className="text-sm text-slate-600 mt-1">Please share only relevant images aimed at seeking help or highlighting genuine need. Inappropriate or irrelevant posts may lead to a ban and be reported.</p>
      </section>

      {/* Understanding section: illustrative examples */}
      <section className="reveal">
        <h3 className="section-title text-slate-900 font-semibold mb-3">Understanding the Context</h3>
        <p className="text-sm text-slate-600 mb-3">These example images illustrate the kind of dignified, relevant photos that help the community understand needs. Do not upload faces without consent or any harmful content.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleImages.map((s, i) => (
            <figure key={i} className="box overflow-hidden">
              <img src={s.url} alt={s.caption} className="w-full h-40 object-cover" />
              <figcaption className="p-2 text-xs text-slate-600">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 reveal">
        <div className="lg:col-span-1">
          <div className="rounded border p-4 bg-white space-y-3">
            <h3 className="font-medium text-slate-900">Create a Post</h3>
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
        {/* <div className="p-4 bg-emerald-100 text-emerald-400 rounded">Tailwind test</div> */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-sky-600">imagesmode</span>Latest Posts</h3>
            <span className="text-xs text-slate-500">{posts.length} item(s)</span>
          </div>
          {previewUrl && (
            <div className="rounded border p-2 bg-white mb-4">
              <h4 className="text-sm font-medium mb-2">Preview</h4>
              <img src={previewUrl} alt="Preview" className="w-full max-h-96 object-contain" />
            </div>
          )}

          {posts.length === 0 ? (
            <div className="rounded border bg-white p-6 text-sm text-slate-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500">hourglass_empty</span>
              No posts yet — be the first to share a relevant, respectful photo.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}