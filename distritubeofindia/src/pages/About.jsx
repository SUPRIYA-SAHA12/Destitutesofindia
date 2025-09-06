export default function About() {
  return (
    <div className="space-y-16">
      {/* Section 1: About */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-screen-lg mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Destitutes of India
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                A citizen-led initiative to responsibly surface genuine needs from the ground, connect people with help, and raise awareness—with dignity and impact at the core.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-64 rounded-xl flex items-center justify-center">
              <span className="text-primary text-lg font-medium">Illustration Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Values */}
      <section className="py-16">
        <div className="max-w-screen-lg mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1: Dignity */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-blue-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-primary mb-4">
                <span className="material-symbols-outlined text-xl">favorite</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Dignity</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Respect privacy and portray people with care and compassion.
              </p>
            </div>

            {/* Value 2: Authenticity */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-green-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 text-secondary mb-4">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Authenticity</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Keep posts relevant, truthful, and genuinely helpful.
              </p>
            </div>

            {/* Value 3: Impact */}
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-orange-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-accent mb-4">
                <span className="material-symbols-outlined text-xl">insights</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Impact</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enable timely responses and measurable positive change in communities.
              </p>
            </div>

            {/* Value 4: Anonymous Option */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-blue-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-primary mb-4">
                <span className="material-symbols-outlined text-xl">visibility_off</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Anonymous Option</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Post anonymously while preserving accountability and trust.
              </p>
            </div>

            {/* Value 5: Responsible Reporting */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-green-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 text-secondary mb-4">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Responsible Reporting</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Location-tagged posts that focus on genuine needs with respect and dignity.
              </p>
            </div>

            {/* Value 6: Connect & Amplify */}
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-orange-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-accent mb-4">
                <span className="material-symbols-outlined text-xl">diversity_2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect & Amplify</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Help NGOs, volunteers, and citizens find where to help effectively.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}