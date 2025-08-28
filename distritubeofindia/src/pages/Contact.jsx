import { useState } from 'react'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const validEmail = (v) => /.+@.+\..+/.test(v)
  const handleSend = () => {
    if (!name.trim() || !validEmail(email) || !message.trim()) {
      setStatus('Please fill all fields with a valid email.')
      return
    }
    const subject = encodeURIComponent('Contact via destitutesofindia.com')
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:contact@destitutesofindia.com?subject=${subject}&body=${body}`
    setStatus('Opening your email client...')
  }

  return (
    <div className="max-w-2xl space-y-8">
      <header className="reveal">
        <h1 className="section-title text-3xl font-semibold text-slate-900 mb-3">Contact Us</h1>
        <p className="text-slate-600 text-lg leading-relaxed">We welcome collaboration with NGOs, authorities, and citizens to make a positive impact together.</p>
      </header>
      
      <div className="box rounded-xl border bg-white p-8 space-y-6 reveal">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input 
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" 
            placeholder="Your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input 
            type="email" 
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" 
            placeholder="you@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Message</label>
          <textarea 
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none" 
            rows="6" 
            placeholder="How can we help? Tell us about your collaboration ideas..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
          />
        </div>
        
        {status && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-2 shake">
            <span className="material-symbols-outlined text-amber-600">info</span>
            {status}
          </div>
        )}
        
        <div className="flex items-center gap-4 pt-4">
          <button 
            type="button" 
            onClick={handleSend} 
            className="btn-primary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <span className="material-symbols-outlined">send</span>
            Send Message
          </button>
          <a 
            href="mailto:contact@destitutesofindia.com" 
            className="btn-secondary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <span className="material-symbols-outlined">mail</span>
            Use Mail App
          </a>
        </div>
      </div>
    </div>
  )
}

