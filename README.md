# Contact Form Email Worker

This Cloudflare Worker receives contact form submissions via a POST request, sends an email with the submitted details (name, email, message), and handles CORS. The email is formatted with a table for readability, and inputs are sanitized to prevent XSS attacks.

## Features

- **Email Submission**: Sends an email with form details to a specified recipient using Cloudflare’s Email Workers.
- **CORS Handling**: Includes proper CORS headers to allow cross-origin requests.
- **HTML Email Formatting**: Formats the email with a table to display form details neatly.
- **Input Escaping**: Escapes user inputs to prevent potential XSS attacks in the email content.

## Environment Requirements

To use this worker, you need a Cloudflare account with access to Cloudflare Email Workers. Ensure that the following environment variables are configured (in wrangler.toml)

- `SEB`: The Cloudflare Email Worker binding.

## Code Structure

### Functions

- `handleCors(request: Request): Headers`: Sets the CORS headers for the response.
- `escapeHtml(unsafe: string): string`: Escapes HTML special characters and converts newlines into `<br />`.
- `sendEmail(env: Env, sender: string, recipient: string, name: string, email: string, messageBody: string): Promise<void>`: Sends an email with the contact form details formatted as an HTML table.

### `fetch` Event Handler

Handles POST requests to process contact form submissions and sends an email. If the request is an `OPTIONS` request, it returns appropriate CORS headers.

### Request Structure

The worker expects a POST request with a JSON payload containing the following fields:

- `name`: The name of the person submitting the form.
- `email`: The email of the person submitting the form.
- `message`: The content of the message.

Example JSON payload:

```json
{
	"name": "John Doe",
	"email": "johndoe@example.com",
	"message": "Hello, I am interested in your services."
}
```

## Usage

1. Clone this repository or add the code to your existing Cloudflare Worker project.

2. Install the necessary dependencies and use `wrangler` to deploy the worker:

   ```bash
   wrangler publish
   ```

3. Update the sender and recipient email addresses in the `sendEmail` function.

4. Configure CORS as needed, or update the headers in the `handleCors` function.

5. Your contact form can now send a POST request to the worker’s endpoint with the form details, and it will send an email containing those details.

## Example Email Format

The email will be sent in an HTML table for better readability, containing the sender's name, email, and message.
