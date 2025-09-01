// import { useState } from 'react'

// export default function Contact() {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')
//   const [status, setStatus] = useState('')

//   const validEmail = (v) => /.+@.+\..+/.test(v)
//   const handleSend = () => {
//     if (!name.trim() || !validEmail(email) || !message.trim()) {
//       setStatus('Please fill all fields with a valid email.')
//       return
//     }
//     const subject = encodeURIComponent('Contact via destitutesofindia.com')
//     const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
//     window.location.href = `mailto:contact@destitutesofindia.com?subject=${subject}&body=${body}`
//     setStatus('Opening your email client...')
//   }

//   return (
//     // <div className="max-w-2xl space-y-8">
//     //   <header className="reveal">
//     //     <h1 className="section-title text-3xl font-semibold text-slate-900 mb-3">Contact Us</h1>
//     //     <p className="text-slate-600 text-lg leading-relaxed">We welcome collaboration with NGOs, authorities, and citizens to make a positive impact together.</p>
//     //   </header>
      
//     //   <div className="box rounded-xl border bg-white p-8 space-y-6 reveal">
//     //     <div className="space-y-2">
//     //       <label className="block text-sm font-medium text-slate-700">Name</label>
//     //       <input 
//     //         className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" 
//     //         placeholder="Your name" 
//     //         value={name} 
//     //         onChange={(e) => setName(e.target.value)} 
//     //       />
//     //     </div>
        
//     //     <div className="space-y-2">
//     //       <label className="block text-sm font-medium text-slate-700">Email</label>
//     //       <input 
//     //         type="email" 
//     //         className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" 
//     //         placeholder="you@example.com" 
//     //         value={email} 
//     //         onChange={(e) => setEmail(e.target.value)} 
//     //       />
//     //     </div>
        
//     //     <div className="space-y-2">
//     //       <label className="block text-sm font-medium text-slate-700">Message</label>
//     //       <textarea 
//     //         className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none" 
//     //         rows="6" 
//     //         placeholder="How can we help? Tell us about your collaboration ideas..." 
//     //         value={message} 
//     //         onChange={(e) => setMessage(e.target.value)} 
//     //       />
//     //     </div>
        
//     //     {status && (
//     //       <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-2 shake">
//     //         <span className="material-symbols-outlined text-amber-600">info</span>
//     //         {status}
//     //       </div>
//     //     )}
        
//     //     <div className="flex items-center gap-4 pt-4">
//     //       <button 
//     //         type="button" 
//     //         onClick={handleSend} 
//     //         className="btn-primary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105"
//     //       >
//     //         <span className="material-symbols-outlined">send</span>
//     //         Send Message
//     //       </button>
//     //       <a 
//     //         href="mailto:contact@destitutesofindia.com" 
//     //         className="btn-secondary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105"
//     //       >
//     //         <span className="material-symbols-outlined">mail</span>
//     //         Use Mail App
//     //       </a>
//     //     </div>
//     //   </div>
//     // </div>
    
//     <div className="max-w-2xl space-y-10 mx-auto px-4">
//   {/* Header */}
//   <header className="reveal text-center">
//     <h1 className="section-title text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse mb-3">
//       Contact Us
//     </h1>
//     <p className="text-slate-600 text-lg leading-relaxed">
//       We welcome collaboration with NGOs, authorities, and citizens to make a positive impact together.
//     </p>
//   </header>

//   {/* Contact Box */}
//   <div className="box rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-8 shadow-md hover:shadow-xl transition-all duration-500 space-y-6 reveal">
//     {/* Name */}
//     <div className="space-y-2">
//       <label className="block text-sm font-semibold text-slate-700">Name</label>
//       <input
//         className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 hover:shadow-md"
//         placeholder="Your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//     </div>

//     {/* Email */}
//     <div className="space-y-2">
//       <label className="block text-sm font-semibold text-slate-700">Email</label>
//       <input
//         type="email"
//         className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 hover:shadow-md"
//         placeholder="you@example.com"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//     </div>

//     {/* Message */}
//     <div className="space-y-2">
//       <label className="block text-sm font-semibold text-slate-700">Message</label>
//       <textarea
//         className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 resize-none hover:shadow-md"
//         rows="6"
//         placeholder="How can we help? Tell us about your collaboration ideas..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//     </div>

//     {/* Status Message */}
//     {status && (
//       <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-2 animate-pulse">
//         <span className="material-symbols-outlined text-amber-600">info</span>
//         {status}
//       </div>
//     )}

//     {/* Buttons */}
//     <div className="flex flex-wrap items-center gap-4 pt-4">
//       <button
//         type="button"
//         onClick={handleSend}
//         className="px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-emerald-300 hover:scale-105 hover:brightness-110"
//       >
//         <span className="material-symbols-outlined">send</span>
//         Send Message
//       </button>
//       <a
//         href="mailto:contact@destitutesofindia.com"
//         className="px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-pink-300 hover:scale-105 hover:brightness-110"
//       >
//         <span className="material-symbols-outlined">mail</span>
//         Use Mail App
//       </a>
//     </div>
//   </div>
// </div>

//   )
// }

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSend = () => {
    if (!name || !email || !message) {
      setStatus("Please fill out all fields.");
      return;
    }

    // Simulate sending
    setStatus("");
    setShowPopup(true);

    // Auto close popup after 3 seconds
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-10 mx-auto px-4 relative">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse mb-3">
  
          Contact Us
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          We welcome collaboration with NGOs, authorities, and citizens to make
          a positive impact together.
        </p>
      </header>

      {/* Form */}
      {/* <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-blue via-slate-50 to-emerald-50 p-8 shadow-md hover:shadow-xl transition-all duration-500 space-y-6"> */}
      <div className="box rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-8 shadow-md hover:shadow-xl transition-all duration-500 space-y-6 reveal">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Name
          </label>
          <input
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 hover:shadow-md"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 hover:shadow-md"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Message
          </label>
          <textarea
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 resize-none hover:shadow-md"
            rows="6"
            placeholder="How can we help? Tell us about your collaboration ideas..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Status */}
        {status && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-2 animate-pulse">
            <span className="material-symbols-outlined text-amber-600">
              info
            </span>
            {status}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleSend}
            className="px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-emerald-300 hover:scale-105 hover:brightness-110"
          >
            <span className="material-symbols-outlined">send</span>
            Send Message
          </button>
          <a
            href="mailto:contact@destitutesofindia.com"
            className="px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-pink-300 hover:scale-105 hover:brightness-110"
          >
            <span className="material-symbols-outlined">mail</span>
            Use Mail App
          </a>
        </div>
      </div>

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center animate-bounce">
            <span className="material-symbols-outlined text-emerald-500 text-4xl mb-2">
              check_circle
            </span>
            <h2 className="text-lg font-semibold text-slate-800">
              Message Sent!
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Thank you {name || "friend"}! We’ll get back to you soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
