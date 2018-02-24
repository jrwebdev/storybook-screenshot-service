console.time('run');

const fs = require('fs-extra');
const request = require('request-promise');
const Bottleneck = require('bottleneck');

const serviceBaseUrl = 'http://localhost:5008/';
const storybookBaseUrl = 'http://d1yltilqhv515f.cloudfront.net/';

let i = 0;
const getImageFilename = () => `screenshots/image${i++}.png`;

const generateScreenshot = url =>
  new Promise((resolve, reject) => {
    request(`${serviceBaseUrl}screenshot?url=${url}`)
      .on('end', resolve)
      .on('error', reject)
      .pipe(fs.createWriteStream(getImageFilename()));
  });

const run = async () => {
  await fs.remove('screenshots'); // TODO: Remove for prod
  await fs.mkdir('screenshots');

  const stories = await request(
    `${serviceBaseUrl}stories?url=${storybookBaseUrl}`
  ).then(JSON.parse);

  console.log('screenshot count:', stories.length);

  const limiter = new Bottleneck({ maxConcurrent: 10 });
  const rateLimitedGetScreenshot = limiter.wrap(generateScreenshot);

  const screenshots = stories.map(rateLimitedGetScreenshot);

  await Promise.all(screenshots);
};

run();

process.on('beforeExit', () => {
  console.timeEnd('run');
});
