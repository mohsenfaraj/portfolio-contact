import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';

interface Env {
	SEB: {
		send: (msg: EmailMessage) => Promise<void>;
	};
	NAME: string;
	SENDER: string;
	RECIPIENT: string;
}

// Function to set CORS headers
function handleCors(request: Request): Headers {
	const headers = new Headers();
	headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
	headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow POST and OPTIONS methods
	headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type headers
	if (request.method === 'OPTIONS') {
		headers.set('Access-Control-Max-Age', '86400'); // Cache preflight response for 1 day
	}
	return headers;
}

// Utility function to escape HTML
function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
		.replace(/\n/g, '<br />'); // Replace newlines with <br /> for HTML formatting
}

// Email sending logic
async function sendEmail(env: Env, sender: string, recipient: string, name: string, email: string, messageBody: string): Promise<void> {
	const msg = createMimeMessage();
	msg.setSender({ name: env.NAME, addr: sender });
	msg.setRecipient(recipient);
	msg.setSubject('New Contact Form Submission');

	// Escape inputs and format message with a table
	const escapedName = escapeHtml(name);
	const escapedEmail = escapeHtml(email);
	const escapedMessage = escapeHtml(messageBody);

	// Add HTML-formatted message
	msg.addMessage({
		contentType: 'text/html',
		data: `
			<h2>New Contact Form Submission</h2>
			<p>You have received a new message from your contact form:</p>
			<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 1.2em;">
				<tr>
					<th style="text-align:left;">Name</th>
					<td>${escapedName}</td>
				</tr>
				<tr>
					<th style="text-align:left;">Email</th>
					<td>${escapedEmail}</td>
				</tr>
				<tr>
					<td colspan="2">${escapedMessage}</td>
				</tr>
			</table>
		`,
	});

	const message = new EmailMessage(sender, recipient, msg.asRaw());

	try {
		await env.SEB.send(message);
	} catch (e) {
		throw new Error(e.message);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Handle CORS for OPTIONS request (preflight)
		if (request.method === 'OPTIONS') {
			const headers = handleCors(request);
			return new Response(null, { headers });
		}

		// Handle POST request
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: handleCors(request),
			});
		}

		try {
			const { name, email, message } = await request.json();

			// Basic input validation
			if (!name || !email || !message) {
				return new Response('Invalid input', {
					status: 400,
					headers: handleCors(request),
				});
			}

			// Replace with actual sender/recipient emails
			const sender = env.SENDER;
			const recipient = env.RECIPIENT;

			await sendEmail(env, sender, recipient, name, email, message);

			return new Response('Email sent successfully!', {
				status: 200,
				headers: handleCors(request),
			});
		} catch (error) {
			return new Response(`Error: ${error.message}`, {
				status: 500,
				headers: handleCors(request),
			});
		}
	},
};
