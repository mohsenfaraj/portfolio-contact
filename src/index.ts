import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';

interface Env {
	SEB: {
		send: (msg: EmailMessage) => Promise<void>;
	};
}

async function sendEmail(env: Env, sender: string, recipient: string, name: string, email: string, messageBody: string): Promise<void> {
	const msg = createMimeMessage();
	msg.setSender({ name: 'MohsenFaraj.ir', addr: sender });
	msg.setRecipient(recipient);
	msg.setSubject('New Contact Form Submission');

	// Add HTML-formatted message
	msg.addMessage({
		contentType: 'text/html',
		data: `
			<h2>New Contact Form Submission</h2>
			<p>You have received a new message from your contact form:</p>
			<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
				<tr>
					<th style="text-align:left;">Name</th>
					<td>${name}</td>
				</tr>
				<tr>
					<th style="text-align:left;">Email</th>
					<td>${email}</td>
				</tr>
				<tr>
					<th style="text-align:left;">Message</th>
					<td>${messageBody}</td>
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
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405 });
		}

		try {
			const { name, email, message } = await request.json();

			// Basic input validation
			if (!name || !email || !message) {
				return new Response('Invalid input', { status: 400 });
			}

			// Replace with actual sender/recipient emails
			const sender = 'contact@mohsenfaraj.ir';
			const recipient = 'gmohsenfarajollahi@gmail.com';

			await sendEmail(env, sender, recipient, name, email, message);

			return new Response('Email sent successfully!', { status: 200 });
		} catch (error) {
			return new Response(`Error: ${error.message}`, { status: 500 });
		}
	},
};
