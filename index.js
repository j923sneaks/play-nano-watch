const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const args = process.argv.slice(2);

const nanoStartUrl = 'https://playnano.online/watch-and-learn/nano';
const nanoAddress = 
    args[0] !== undefined 
    ? args[0] 
    : 'nano_3kdshon489zpo1qd9yh89kc1ght9zkcebthy5w39es61f9bf7o34tzb1qggz'; // or hard-code your address here

// global variables
let browser;
let page;
let exitFlag = false;

(async () => {
    // launch chromium browser and get page instance
    browser = await puppeteer.launch({ 
        headless: false, // show browser to solve captcha manually
        args: [
            '--mute-audio', // can comment/delete this if you want audio
            // optimization (not proven) ref: https://stackoverflow.com/questions/49008008/chrome-headless-puppeteer-too-much-cpu
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu',
        ],
    });
    page = await browser.newPage();

    console.log('Loading browser...');

    await page.goto(nanoStartUrl, { waitUntil: 'networkidle2' }); // wait for network requests to finish

    // start loop by clicking start button
    try {
        console.log('Clicking start button');
    
        await page.waitForSelector('.watch-next-btn', { timeout: 0 });
        await page.$eval('.watch-next-btn', el => el.click());
    } catch (e) {
        console.log('Start learning button not found!');
    }

    // ctrl + c to exit at any time
    do {
        // "watch proper" for 5 rounds
        try {
            await watchVideos();
        } catch (err) {
            console.log(err);
            console.log('Error during watchVideos. Try manual to proceed to captcha.');
        }

        // captcha page
        try {
            // set address to input field
            console.log('Setting nano address');

            await page.waitForSelector('input[name=gu_address]', { timeout: 0 });
            await page.$eval('input[name=gu_address]', el => el.value = ''); // "clear" input field
            await page.type('input[name=gu_address]', nanoAddress); // type given nano address

            // Manual action from user
            console.log('ACTION REQUIRED - Waiting for you to solve captcha...');

            // waitCaptchaAndSubmit(); // old code 
        } catch (err) {
            console.log(err);
            console.log('Error. Exiting the program');

            exitFlag = true; // exit program
        }
    } while (!exitFlag);

    // await browser.close(); // dont close in case mag error?
})();

/**
 * Loops through playnano's videos (5 rounds)
 */
const watchVideos = async () => {
    let currentRound = 1;

    while (currentRound <= 5) {
        console.log(`Watching video ${currentRound}`);     

        // wait for next button to become enabled then click
        await page.waitForSelector('button.watch-next-btn:not([disabled])', { timeout: 0 });
        await page.$eval('.watch-next-btn', el => el.click());

        await page.waitForNavigation({ waitUntil: 'load' }); // wait for next page to load

        currentRound += 1;
    }
}

/**
 * Old code for waiting captcha to be solved then auto click submit button
 * Reason for removal: sometimes a different captcha appears so the query throws error
 */
const waitCaptchaAndSubmit = async () => {
    await page.waitForFunction(`
        document
            .querySelector("#watch-videos form iframe")
            .getAttribute("data-hcaptcha-response") !== ""
    `, { timeout: 0 });

    // click to submit and continue watching
    console.log('continue watching...');

    await page.$eval('button[value="keep"]', el => el.click());
}