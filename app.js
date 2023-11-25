// init

// shortener function vit bit.ly
function shortenUrl(longUrl) {
    fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer aab8243332640ab3c33b83cd9c64bf0f4a2a4132',
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            url: longUrl
        })
    })
    .then((response) => response.json())
    let shortUrl = response.link
    return shortUrl
}