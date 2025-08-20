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

  const firebaseReady = !!db && !!storage

  useEffect(() => {
    if (!db) return
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const items = []
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }))
      setPosts(items)
    })
    return () => unsub()
  }, [])

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

  const resetForm = useCallback(() => {
    setFile(null)
    setPreviewUrl('')
    setLocation(null)
    setCaption('')
    setCautionAccepted(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
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

      <section className="bg-sky-50 border rounded p-4">
        <h2 className="text-lg font-semibold text-slate-900">Post a Photo to Raise Awareness</h2>
        <p className="text-sm text-slate-600 mt-1">Please share only relevant images aimed at seeking help or highlighting genuine need. Inappropriate or irrelevant posts may lead to a ban and be reported.</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded border p-4 bg-white space-y-3">
            <h3 className="font-medium text-slate-900">Create a Post</h3>
            {loading ? (
              <div className="text-sm text-slate-600">Checking sign-in…</div>
            ) : user ? (
              <div className="space-y-3">
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={onSelectFile} className="block w-full text-sm" />
                <div className="flex items-center gap-2">
                  <button type="button" className="px-3 py-1 rounded border text-xs" onClick={requestLocation}>Use Current Location</button>
                  {location && <span className="text-xs text-slate-600">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>}
                </div>
                <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="w-full border rounded px-3 py-2 text-sm" />
                <label className="flex items-start gap-2 text-xs text-slate-700">
                  <input type="checkbox" checked={cautionAccepted} onChange={(e) => setCautionAccepted(e.target.checked)} />
                  <span>I confirm this post is relevant, respectful, and does not violate privacy. I understand misuse may lead to a ban and reporting to authorities.</span>
                </label>
                <button disabled={!canSubmit} onClick={handleSubmit} className={`px-4 py-2 rounded text-white text-sm ${canSubmit ? 'bg-sky-600' : 'bg-slate-400 cursor-not-allowed'}`}>{submitting ? 'Posting…' : 'Post'}</button>
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
          {previewUrl && (
            <div className="rounded border p-2 bg-white mb-4">
              <h4 className="text-sm font-medium mb-2">Preview</h4>
              <img src={previewUrl} alt="Preview" className="w-full max-h-96 object-contain" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


