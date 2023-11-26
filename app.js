// init
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const secret = process.env["BIT_KEY"]

// shortener function vit bit.ly
async function shortenUrl(longUrl) {
    try {
        const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secret}`,
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                long_url: longUrl
            })
        });

        const data = await response.json();
        console.log(data)
        return data.link;
    }
    catch(error) {
      console.error('Error shortening URL:', error);
      return null;
    }
}


// Handle requests to the root URL
app.get('/', (req, res) => {
    console.log('Page loading.')
    res.sendFile(path.join(__dirname, 'site.html'));
    console.log('Page loaded!')
});

// Listens for async url requests
app.get('/shorten-url/:longUrl', async (req, res) => {
    const longUrl = req.params.longUrl;
    console.log(`Received request for shortening the URL ${longUrl}`)
    // Call your shortenUrl function here
    const shortUrl = await shortenUrl(longUrl);
    res.json({ shortUrl });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });