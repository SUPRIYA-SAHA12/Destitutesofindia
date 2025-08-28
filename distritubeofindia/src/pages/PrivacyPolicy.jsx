export default function PrivacyPolicy() {
  return (
    <div className="space-y-8">
      <header className="box rounded-xl border bg-white p-8 reveal">
        <h1 className="section-title text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-600">Effective date: {new Date().toLocaleDateString()}</p>
      </header>
      <section className="box rounded-xl border bg-white p-6 space-y-3 reveal">
        <h2 className="text-lg font-semibold">Data We Collect</h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Account data: Google profile (name, email) or anonymous session ID.</li>
          <li>Content: Photos, captions, timestamps, and geolocation (with your consent).</li>
          <li>Technical: Device, browser, and usage analytics.</li>
        </ul>
      </section>
      <section className="box rounded-xl border bg-white p-6 space-y-3 reveal">
        <h2 className="text-lg font-semibold">How We Use Data</h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Display posts and improve service quality.</li>
          <li>Moderation and abuse prevention.</li>
          <li>Security, analytics, and compliance with law.</li>
        </ul>
      </section>
      <section className="box rounded-xl border bg-white p-6 space-y-3 reveal">
        <h2 className="text-lg font-semibold">Sharing</h2>
        <p className="text-slate-700">We use third-party services like Firebase (Auth, Firestore, Storage). Data may be processed by these providers under their terms.</p>
      </section>
      <section className="box rounded-xl border bg-white p-6 space-y-3 reveal">
        <h2 className="text-lg font-semibold">Your Choices</h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Post anonymously.</li>
          <li>Disable location access (posts require location to be accepted).</li>
          <li>Request deletion of your content by contacting us.</li>
        </ul>
      </section>
      <section className="box rounded-xl border bg-white p-6 space-y-3 reveal">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-slate-700">privacy@destitutesofindia.com</p>
      </section>
    </div>
  )
}

