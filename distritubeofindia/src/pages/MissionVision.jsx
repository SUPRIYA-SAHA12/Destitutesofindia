export default function MissionVision() {
  return (
    <div className="space-y-12">
      <section className="box rounded-xl border bg-white p-8 reveal">
        <h1 className="section-title text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Mission & Vision</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="card rounded-lg border p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 reveal">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-2xl float">flag</span>
              <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">Responsibly surface real needs, enable timely assistance, and uphold dignity via a simple, accessible platform that connects communities.</p>
          </div>
          <div className="card rounded-lg border p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 reveal" style={{ transitionDelay: '0.1s' }}>
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-600 text-2xl float">visibility</span>
              <span className="gradient-text">Vision</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">An India where no one in need goes unseen — technology bridges citizens, NGOs, and authorities to respond with empathy and effectiveness.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6 reveal">
        <h2 className="section-title text-2xl font-semibold text-slate-900">Our Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 reveal">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-sky-600 text-2xl bounce">shield_person</span>
              <span className="gradient-text">Safety</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">Moderation & reporting to prevent misuse and ensure platform integrity.</p>
          </div>
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 reveal" style={{ transitionDelay: '0.1s' }}>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500 text-2xl bounce">travel_explore</span>
              <span className="gradient-text">Reach</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">Discovery tools for NGOs and volunteers to find and respond to needs effectively.</p>
          </div>
          <div className="card rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 reveal" style={{ transitionDelay: '0.2s' }}>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-fuchsia-600 text-2xl bounce">favorite</span>
              <span className="gradient-text">Empathy</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">Dignified representation in every post, respecting privacy and human dignity.</p>
          </div>
        </div>
      </section>

      <section className="box rounded-xl border bg-white p-8 reveal">
        <h2 className="section-title text-2xl font-semibold text-slate-900 mb-6">How You Can Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-all duration-300">
            <span className="material-symbols-outlined text-emerald-600 text-xl mt-1">check_circle</span>
            <div>
              <h3 className="font-medium text-emerald-800 mb-1">Post Responsibly</h3>
              <p className="text-sm text-emerald-700">Share accurate, relevant information with respect for privacy.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-sky-50 rounded-lg border border-sky-200 hover:bg-sky-100 transition-all duration-300">
            <span className="material-symbols-outlined text-sky-600 text-xl mt-1">share</span>
            <div>
              <h3 className="font-medium text-sky-800 mb-1">Share & Connect</h3>
              <p className="text-sm text-sky-700">Share verified posts with local support networks and organizations.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-all duration-300">
            <span className="material-symbols-outlined text-amber-600 text-xl mt-1">volunteer_activism</span>
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Volunteer & Donate</h3>
              <p className="text-sm text-amber-700">Support credible initiatives through time, skills, or financial contributions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

