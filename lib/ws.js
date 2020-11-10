const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const { decode } = require('./decoder');

const bilibiliLiveBaseUrl = 'https://live.bilibili.com'
const browserWSEndpoint = 'http://localhost:9222/json/version';
const rid = '22304341';

async function obtainBrowser() {
    const { webSocketDebuggerUrl } = await (await fetch(browserWSEndpoint)).json();

    return puppeteer.connect({
        browserWSEndpoint: webSocketDebuggerUrl,
        defaultViewport: null,
    });
}


async function obtainPage(url) {
    const browser = await obtainBrowser();

    let page = (await browser.pages()).find(page => {
        const { hostname: host, pathname: path } = new URL(page.url());
        const { hostname, pathname } = new URL(url);


        if (host === hostname && path === pathname) {
            return page;
        }
        return false;
    });

    if (!page) {
        page = await browser.newPage();
        await page.goto(url);
    }

    return page;
}

async function onPageWebSocket(handler) {
    const page = await obtainPage(`${ bilibiliLiveBaseUrl }/${ rid }`);
    const cdp = await page.target().createCDPSession();

    await cdp.send('Network.enable');
    await cdp.send('Page.enable');

    cdp.on('Network.webSocketFrameReceived', ({ response: { payloadData } }) => {
        try {
            const buff = Buffer.from(payloadData, 'base64');
            const packet = decode(buff);
            handler(packet);
        } catch (err) {
            console.error(err);
        }
    });
}

module.exports = {
    onPageWebSocket
};
