# play-nano-watch
Semi web automation for playnano.online using puppeteer. The script opens a browser and loads playnano.online's earn by watching feature. This consists of 5 videos then a captcha page where you receive your NANO rewards. I use the site's DOM elements to automate tasks such as clicking buttons. 

I was only able to consistently run 1 instance. Playnano probably considers your public IP address so you can't spam watch. If you encounter errors after solving captchas correctly, it may be that you reach the limit for that IP. But I found that after some time, it proceeds normally using the same IP address.

## Dependencies
- node & npm
- puppeteer (includes Chromium browser by default)
- puppeteer-extra, puppeteer-extra-plugin-stealth (fix for javascript page error)

## Installation
1. Git clone or download zip and extract.
2. At root directory, run <pre>npm install</pre> to install dependencies.

## Usage
  If you hardcoded your address: <pre>npm run start</pre>

  If not: <pre>npm run start [nano_address]</pre>

### Other notes
- Project file size after dependency download: ~400MB
- May be resource intensive than usual (haven't considered optimizing yet :))
- May sometimes throw error while watching. It is not recommended to minimize the browser