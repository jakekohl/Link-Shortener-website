// init
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const secret = process.env["BIT_KEY"];
const org = process.env["BIT_ORG"];

// Logging handler for server logs
function logMessage(level, message) {
    const loggerMessage = `${new Date().toISOString()} | ${level} | ${message}`;
    console.log(loggerMessage);
}

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
        logMessage('DEBUG',JSON.stringify(data));  
        writeCache(data);
        return data.link;
    }
    catch(error) {
      console.error('Error shortening URL:', error);
      return null;
    }
}

// Check if the URL a request has already been made and stored
// If it is, return the short URL / Otherwise return null
function checkCache(requestedURL) {
    try {
        const filePath = path.join(__dirname, 'database', 'urlCache.json');

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            // If not, create it with an empty array
            fs.writeFileSync(filePath, JSON.stringify([]));
            logMessage('INFO','urlCache.json created, it was missing.')
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const urlList = JSON.parse(data);

        const cachedUrl = urlList.find(url => url.long_url.includes(requestedURL));
        if (cachedUrl) {
            logMessage('INFO',`URL found in cache:, ${cachedUrl.link}`);
            return cachedUrl.link;
        }

        return null;
    } catch (error) {
        console.error('Error checking cache:', error);
    }
}

// Write the bit.ly API response to the urlCache.json file
function writeCache(response) {
    try {
        const filePath = path.join(__dirname, 'database', 'urlCache.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const urlList = JSON.parse(data);

        urlList.push(response);

        fs.writeFileSync(filePath, JSON.stringify(urlList));
        logMessage('DEBUG',`urlCache.json updated with ${response.long_url} | ${response.link}.`);
    } catch (error) {
        logMessage('ERROR',`Error writing to cache:, ${error}`);
    }
}

// Allows for manual checking of the Rate Limit for Bitly API
async function checkLimits() {
    try {
        const response = await fetch(`https://api-ssl.bitly.com/v4/organizations/${org}/plan_limits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secret}`,
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });

        const data = await response.json();
        logMessage('DEBUG',JSON.stringify(data));
        const encodes = data.plan_limits.find(item => item.name === 'encodes');
        const count = encodes.count;
        const limit = encodes.limit;
        const countLimit = `${count} Used / ${limit} Total`;
        return countLimit;
    } catch (error) {
        logMessage('ERROR',`Error retrieving rates: ${error}`);
        return null;
    }
}

// Handle requests to the root URL
app.get('/', (req, res) => {
    const requestor = req.ip;
    logMessage('DEBUG',`Request from ${requestor} for root URL`);
    res.sendFile(path.join(__dirname, 'index.html'));
    logMessage('INFO','Page loaded!')
});

// Listens for async shorten-url requests
app.get('/shorten-url/:longUrl', async (req, res) => {
    const longUrl = req.params.longUrl;
    logMessage('DEBUG',`Received request for shortening the URL ${longUrl}`)
    let cacheCheck = checkCache(longUrl);
    if (cacheCheck) {
        logMessage('DEBUG',`Returning: ${cacheCheck}`);
        return cacheCheck;
    }
    // Call your shortenUrl function here
    const shortUrl = await shortenUrl(longUrl);
    logMessage('DEBUG',`Returning: ${shortUrl}`);
    res.json({ shortUrl });
});

// Listens for async check-limits requests
app.get('/check-limits', async (req, res) => {
    const limits = await checkLimits();
    logMessage('DEBUG',`Returning: ${limits}`);
    res.json({ limits });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
