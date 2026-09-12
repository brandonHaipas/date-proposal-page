import { google } from 'googleapis';
import http from 'http';
import open from 'open'; // npm install open --save-dev
import "dotenv/config";

const CLIENT_ID= process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
  prompt: 'consent',
});

http.createServer(async (req, res) => {
  if (req.url.startsWith('/oauth2callback')) {
    const code = new URL(req.url, 'http://localhost:3000').searchParams.get('code');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('REFRESH TOKEN:', tokens.refresh_token);
    res.end('Done — check your terminal, then close this tab.');
    process.exit(0);
  }
}).listen(3000, () => open(authUrl));