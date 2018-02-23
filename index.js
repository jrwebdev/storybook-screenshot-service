const express = require('express');
const compression = require('compression');

const port = 5008;

const app = express();
app.use(compression());

const puppeteer = require('puppeteer');

let browser;
let server;

app.get('/stories', async (req, res) => {
  const requestLog = `[GET] /stories`;
  console.time(requestLog);
  // TODO: Check for url
  const url = `${req.query.url.replace(/\/$/, '')}/iframe.html`;
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });
  const stories = await page.evaluate(() => window.storybookUrls);
  // TODO: Check for stories
  res.json(stories.map(s => encodeURIComponent(`${url}?${decodeURI(s)}`)));
  console.timeEnd(requestLog);
});

app.get('/screenshot', async (req, res) => {
  const requestLog = `[GET] /screenshot`;
  console.time(requestLog);
  console.log(decodeURIComponent(req.query.url));

  const page = await browser.newPage();
  await page.goto(decodeURIComponent(req.query.url), {
    waitUntil: 'networkidle2',
  });
  const screenshot = await page.screenshot({
    fullPage: true,
    omitBackground: true,
  });

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': screenshot.length,
  });
  res.end(screenshot);
  console.timeEnd(requestLog);
});

const start = async () => {
  browser = await puppeteer.launch({
    headless: true,
  });

  server = app.listen(port, () => {
    console.log(`Storybook screenshot service listening on port ${port}`);
  });
};

process.on('SIGINT', () => {
  server.close();
  browser.close();
});

start();
