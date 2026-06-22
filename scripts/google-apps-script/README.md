Google Apps Script: Intake forwarder

This folder contains a Google Apps Script that receives POSTed JSON intake submissions from your Next.js app and sends them via email (and optionally appends them to a Google Sheet).

Files:
- code.gs — the Apps Script source. Replace OWNER_EMAIL and SPREADSHEET_ID as needed.

Deployment steps:
1. Go to https://script.google.com and create a new project.
2. Replace the contents of the default Code.gs with the contents of `code.gs` in this folder.
3. Edit the top of the script to set `OWNER_EMAIL` (defaults to workacc722@gmail.com) and optionally `SPREADSHEET_ID`.
4. Save the project.
5. Deploy: Click "Deploy" → "New deployment" → choose "Web app".
   - For "Execute as": select "Me".
   - For "Who has access": select "Anyone" or "Anyone, even anonymous" (so your server can POST without OAuth).
6. Click "Deploy" and copy the Web App URL.
7. In your Next.js project, set `.env.local`:

GOOGLE_APPS_SCRIPT_URL=<PASTE_WEB_APP_URL>

8. Restart your dev server (`npm run dev`) and submit the intake form; the server will POST JSON to the Apps Script and you should receive emails.

Notes:
- If you want submissions recorded in a Google Sheet, create a Google Sheet and set `SPREADSHEET_ID` to its ID (the long ID in the sheet URL).
- Apps Script runs as your Google account (the deployer) when executed as "Me" and will be able to send email via `MailApp.sendEmail`.
- If you choose "Anyone, even anonymous" access, anyone with the URL can POST. Keep the URL private.

Troubleshooting:
- If you see a 403 or 401 when testing, redeploy and ensure access is set to allow anonymous requests.
- Check the Apps Script "Executions" dashboard for errors.

