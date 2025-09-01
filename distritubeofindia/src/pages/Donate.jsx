import { useState, useEffect } from 'react'

export default function Donate() {
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

     const handleDonation = async (e) => {
     e.preventDefault()
     
     if (!amount || !name || !email || !phone) {
       alert('Please fill in all fields')
       return
     }

     if (parseFloat(amount) < 1) {
       alert('Minimum donation amount is ₹1')
       return
     }

     setLoading(true)

     try {
       // Create order data
       const orderData = {
         amount: parseFloat(amount) * 100, // Razorpay expects amount in paise
         currency: 'INR',
         receipt: `donation_${Date.now()}`,
         notes: {
           donor_name: name,
           donor_email: email,
           donor_phone: phone,
           purpose: 'Donation to Destitutes of India Initiative'
         }
       }

       // For testing purposes, we'll use a simple approach without backend
       // In production, you should create orders through your backend API
       const testOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

       // Initialize Razorpay payment with direct payment (no order required)
       const options = {
         key: 'rzp_test_RBCRdbbNcgKd2Q', // Your Razorpay test key
         amount: orderData.amount,
         currency: orderData.currency,
         name: 'Destitutes of India Initiative',
         description: 'Your donation helps us support those in need',
         // Remove order_id for direct payment
         handler: function (response) {
           // Payment successful
           alert(`Thank you for your donation of ₹${amount}! Payment ID: ${response.razorpay_payment_id}`)
           // Reset form
           setAmount('')
           setName('')
           setEmail('')
           setPhone('')
           setLoading(false)
         },
         prefill: {
           name: name,
           email: email,
           contact: phone
         },
         theme: {
           color: '#059669' // Emerald color matching your theme
         },
         modal: {
           ondismiss: function() {
             setLoading(false)
           }
         },
         // Add these options for better payment handling
         notes: orderData.notes,
         receipt: orderData.receipt
       }

       const rzp = new window.Razorpay(options)
       rzp.open()
       
     } catch (error) {
       console.error('Payment error:', error)
       alert('Payment failed. Please try again.')
       setLoading(false)
     }
   }

  const presetAmounts = [100, 500, 1000, 2000, 5000]

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="text-center reveal">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-600 mb-4">
          Make a Difference Today
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Your donation helps us provide essential support to those in need. Every contribution, no matter how small, makes a real impact in someone's life.
        </p>
      </header>

      {/* Donation Form */}
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-xl p-8 reveal">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-3xl">favorite</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Donate Securely</h2>
          <p className="text-slate-600">Powered by Razorpay - India's most trusted payment gateway</p>
        </div>

        <form onSubmit={handleDonation} className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Donation Amount
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    amount === preset.toString()
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom amount"
                min="1"
                step="1"
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Donate Button */}
          <button
            type="submit"
            disabled={!razorpayLoaded || loading || !amount || !name || !email || !phone}
            className={`w-full py-4 px-6 rounded-lg text-lg font-semibold text-white transition-all duration-300 ${
              !razorpayLoaded || loading || !amount || !name || !email || !phone
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">favorite</span>
                Donate ₹{amount || '0'}
              </span>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-emerald-600 mt-0.5">security</span>
            <div className="text-sm text-emerald-800">
              <p className="font-medium mb-1">Secure Payment</p>
              <p>Your payment is processed securely through Razorpay. We never store your payment information.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Information */}
      <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200 p-8 reveal">
        <h3 className="text-2xl font-bold text-slate-800 text-center mb-6">
          How Your Donation Helps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 text-2xl">restaurant</span>
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Food & Nutrition</h4>
            <p className="text-sm text-slate-600">Provide meals and essential nutrition to those in need</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-blue-600 text-2xl">medical_services</span>
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Healthcare</h4>
            <p className="text-sm text-slate-600">Access to medical care and health services</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-purple-600 text-2xl">school</span>
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Education</h4>
            <p className="text-sm text-slate-600">Support educational programs and skill development</p>
          </div>
        </div>
      </div>

             {/* Important Note */}
       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <div className="flex items-start gap-3">
           <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
           <div className="text-sm text-blue-800">
             <p className="font-medium mb-1">ℹ️ Testing Mode Active</p>
             <p>Currently using direct payment mode for testing. For production, implement a backend API to create proper Razorpay orders and switch to live keys.</p>
           </div>
         </div>
       </div>
    </div>
  )
}

