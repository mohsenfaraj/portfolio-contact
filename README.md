# Contact Form Email Worker

If you have a contact form on your website and you want contact data (name, email, message) to come as form of an email to you, then you have found the right project. this is a cloudflare worker to email you when it receive a contact form from its endpoint.

## Features

- **Email Submission**: Sends an email with form details to a specified recipient using Cloudflare’s Email Workers.
- **CORS Handling**: Includes proper CORS headers to allow cross-origin requests.
- **HTML Email Formatting**: Formats the email with a table to display form details neatly.
- **Input Escaping**: Escapes user inputs to prevent potential XSS attacks in the email content.

## Setup and deploy

First you need a cloudflare account with email routing on (which requires you to have a domain, custom email address and verified destination address).

If these requirements are met clone this repo, open the `wrangler.toml` file and update the `destination_address`, `NAME`, `SENDER` and `RECIPIENT` with your email, name of your website, the custom email address you created in cloudflare and your email address again.

After updating you could run these commands

```bash
# for installing required packages (you could use pnpm too)
npm install

# for testing in wrangler remote mode:
npx wrangler dev --test

#for deploy in cloudflare:
npx wrangler deploy
```

note that wrangler only runs in local with the `--remote` flag for sending email.

you could change the CORS settings to only allow your own website from `src/index.ts`.

## Form structure

After you deployed your project to cloudflare you can get the address of deployed worker and send a POST request in form of JSON to it.

this is an example of request body:

```json
{
	"name": "name",
	"email": "email@example.com",
	"message": "Hello There!"
}
```
