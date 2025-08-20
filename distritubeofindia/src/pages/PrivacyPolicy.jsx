export default function PrivacyPolicy() {
	return (
		<div className="prose prose-slate max-w-none">
			<h1>Privacy Policy</h1>
			<p>Effective date: {new Date().toLocaleDateString()}</p>
			<h2>Data We Collect</h2>
			<ul>
				<li>Account data: Google profile (name, email) or anonymous session ID.</li>
				<li>Content: Photos, captions, timestamps, and geolocation (with your consent).</li>
				<li>Technical: Device, browser, and usage analytics.</li>
			</ul>
			<h2>How We Use Data</h2>
			<ul>
				<li>Display posts and improve service quality.</li>
				<li>Moderation and abuse prevention.</li>
				<li>Security, analytics, and compliance with law.</li>
			</ul>
			<h2>Sharing</h2>
			<p>We use third-party services like Firebase (Auth, Firestore, Storage). Data may be processed by these providers under their terms.</p>
			<h2>Your Choices</h2>
			<ul>
				<li>Post anonymously.</li>
				<li>Disable location access (but posts will not be accepted without location).</li>
				<li>Request deletion of your content by contacting us.</li>
			</ul>
			<h2>Contact</h2>
			<p>privacy@destitutesofindia.com</p>
		</div>
	)
}

