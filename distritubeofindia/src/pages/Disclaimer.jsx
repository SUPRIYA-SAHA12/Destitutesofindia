export default function Disclaimer() {
  return (
    <div className="space-y-8">
      <header className="box rounded-xl border bg-white p-8 reveal">
        <h1 className="section-title text-3xl font-bold text-slate-900">Disclaimer</h1>
      </header>
      <section className="box rounded-xl border bg-white p-6 space-y-4 reveal">
        <p className="text-slate-700">User-generated content appears on this platform. While we encourage responsible posting, we do not guarantee the accuracy of each post. Irrelevant, harmful, or unlawful content is prohibited and may be removed. Users are solely responsible for their submissions.</p>
        <h2 className="text-lg font-semibold">Content Guidelines</h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Do not post faces without consent where it may cause harm.</li>
          <li>Do not post defamatory, hateful, or misleading content.</li>
          <li>Share only what serves public interest and dignity.</li>
        </ul>
        <p className="text-slate-700">To report content, contact: report@destitutesofindia.com</p>
      </section>
    </div>
  )
}

