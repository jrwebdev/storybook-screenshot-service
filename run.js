console.time('run');

const fs = require('fs-extra');
const request = require('request-promise');
const throttle = require('lodash/throttle');

const serviceBaseUrl = 'http://localhost:5008/';
const storybookBaseUrl = 'http://d1yltilqhv515f.cloudfront.net/';

let i = 0;
const getImageFilename = () => `screenshots/image${i++}.png`;

const generateScreenshot = throttle(
  url =>
    request(`${serviceBaseUrl}screenshot?url=${url}`).pipe(
      fs.createWriteStream(getImageFilename())
    ),
  10
);

const run = async () => {
  await fs.remove('screenshots'); // TODO: Remove for prod
  await fs.mkdir('screenshots');

  const stories = await request(
    `${serviceBaseUrl}stories?url=${storybookBaseUrl}`
  ).then(JSON.parse);

  console.log('screenshot count:', stories.length);

  const screenshots = stories.map(generateScreenshot);

  await Promise.all(screenshots);
};

run();

process.on('beforeExit', () => {
  console.timeEnd('run');
});
