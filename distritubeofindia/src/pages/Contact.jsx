export default function Contact() {
	return (
		<div className="max-w-2xl">
			<h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
			<p className="text-slate-600 mb-6">We welcome collaboration with NGOs, authorities, and citizens. Share your message and we’ll get back soon.</p>
			<form className="space-y-4">
				<div>
					<label className="block text-sm text-slate-700">Name</label>
					<input className="w-full border rounded px-3 py-2" placeholder="Your name" />
				</div>
				<div>
					<label className="block text-sm text-slate-700">Email</label>
					<input type="email" className="w-full border rounded px-3 py-2" placeholder="you@example.com" />
				</div>
				<div>
					<label className="block text-sm text-slate-700">Message</label>
					<textarea className="w-full border rounded px-3 py-2" rows="5" placeholder="How can we help?" />
				</div>
				<button type="button" className="px-4 py-2 bg-sky-600 text-white rounded">Send</button>
			</form>
		</div>
	)
}

