import { useState } from 'react'

export default function Donate() {
  const [copied, setCopied] = useState('')
  const copy = async (text) => {
    try { 
      await navigator.clipboard.writeText(text); 
      setCopied(text); 
      setTimeout(() => setCopied(''), 1500) 
    } catch {} 
  }

  return (
    <div className="space-y-10">
      <header className="box rounded-xl bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-300 text-slate-900 p-8 reveal">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">Donate</h1>
        <p className="opacity-80 max-w-2xl text-lg leading-relaxed">Your contributions help us scale infrastructure, improve moderation, and partner with credible NGOs. We'll publish periodic impact updates.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 reveal">
        <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-2xl float">qr_code_2</span>
            <span className="gradient-text">UPI</span>
          </h3>
          <div className="mt-3 text-sm bg-emerald-50 p-3 rounded-lg border border-emerald-200 font-mono">
            destitutesofindia@upi
          </div>
          <button 
            onClick={() => copy('destitutesofindia@upi')} 
            className="mt-4 btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <span className="material-symbols-outlined">content_copy</span>
            Copy UPI ID
          </button>
          {copied === 'destitutesofindia@upi' && (
            <div className="text-xs text-emerald-700 mt-2 flex items-center gap-1 bounce">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Copied to clipboard!
            </div>
          )}
        </div>
        
        <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2" style={{ transitionDelay: '0.1s' }}>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-sky-600 text-2xl float">account_balance</span>
            <span className="gradient-text">Bank Transfer</span>
          </h3>
          <div className="mt-3 text-sm space-y-2 bg-sky-50 p-3 rounded-lg border border-sky-200">
            <div><strong>Beneficiary:</strong> Destitutes of India Initiative</div>
            <div><strong>Account:</strong> 1234567890</div>
            <div><strong>IFSC:</strong> ABCD0123456</div>
          </div>
          <button 
            onClick={() => copy('Destitutes of India Initiative, A/C 1234567890, IFSC ABCD0123456')} 
            className="mt-4 btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <span className="material-symbols-outlined">content_copy</span>
            Copy Details
          </button>
          {copied && copied.includes('A/C') && (
            <div className="text-xs text-emerald-700 mt-2 flex items-center gap-1 bounce">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Copied to clipboard!
            </div>
          )}
        </div>
        
        <div className="card rounded-lg border p-6 bg-white opacity-70 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2" style={{ transitionDelay: '0.2s' }}>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-500 text-2xl">credit_card</span>
            <span className="text-slate-500">Payment Gateway</span>
          </h3>
          <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">schedule</span>
              Coming soon
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Secure online payments will be available soon
          </div>
        </div>
      </section>

      <div className="box rounded-lg border bg-amber-50 p-4 reveal">
        <p className="text-sm text-amber-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600">info</span>
          Note: The above details are placeholders. Replace with verified information before going live.
        </p>
      </div>
    </div>
  )
}

