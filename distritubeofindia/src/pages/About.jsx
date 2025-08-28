export default function About() {
  return (
    <div className="space-y-12">
      <section className="box rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-fuchsia-600 text-white p-8 sm:p-12 shadow-lg reveal">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">About Destitutes of India</h1>
        <p className="opacity-95 max-w-3xl text-lg leading-relaxed">
          A citizen-led initiative to responsibly surface genuine needs from the ground, connect people with
          help, and raise awareness — with dignity and impact at the core.
        </p>
      </section>

      <section className="space-y-6 reveal">
        <h2 className="section-title text-2xl font-semibold text-slate-900">What We Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex gap-4 reveal">
            <span className="material-symbols-outlined text-sky-600 text-3xl float">photo_camera</span>
            <div>
              <h3 className="font-semibold text-lg mb-2 gradient-text">Responsible Reporting</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Location-tagged posts that focus on genuine needs with respect and dignity.</p>
            </div>
          </div>
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex gap-4 reveal" style={{ transitionDelay: '0.1s' }}>
            <span className="material-symbols-outlined text-indigo-600 text-3xl float">visibility_off</span>
            <div>
              <h3 className="font-semibold text-lg mb-2 gradient-text">Anonymous Option</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Post anonymously while preserving accountability and trust.</p>
            </div>
          </div>
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex gap-4 reveal" style={{ transitionDelay: '0.2s' }}>
            <span className="material-symbols-outlined text-fuchsia-600 text-3xl float">diversity_2</span>
            <div>
              <h3 className="font-semibold text-lg mb-2 gradient-text">Connect & Amplify</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Help NGOs, volunteers, and citizens find where to help effectively.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 reveal">
        <h2 className="section-title text-2xl font-semibold text-slate-900">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 reveal">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-rose-600 text-2xl bounce">favorite</span>
              <span className="gradient-text">Dignity</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">Respect privacy and portray people with care and compassion.</p>
          </div>
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 reveal" style={{ transitionDelay: '0.1s' }}>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-2xl bounce">verified</span>
              <span className="gradient-text">Authenticity</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">Keep posts relevant, truthful, and genuinely helpful to the community.</p>
          </div>
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 reveal" style={{ transitionDelay: '0.2s' }}>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500 text-2xl bounce">insights</span>
              <span className="gradient-text">Impact</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">Enable timely responses and measurable positive change in communities.</p>
          </div>
        </div>
      </section>

      <section className="box rounded-xl border bg-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 reveal">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900 gradient-text">Partner with us</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md">NGOs, volunteers, and authorities — let's collaborate for faster, more effective help delivery.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/donate" className="btn-primary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105">
            <span className="material-symbols-outlined">volunteer_activism</span>
            Donate
          </a>
          <a href="/contact" className="btn-secondary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105">
            <span className="material-symbols-outlined">mail</span>
            Contact
          </a>
        </div>
      </section>
    </div>
  )
}

