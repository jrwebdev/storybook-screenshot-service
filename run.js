console.time('run');

const fs = require('fs-extra');
const request = require('request-promise');

const serviceBaseUrl = 'http://localhost:5008/';
const storybookBaseUrl =
  'http://example-storybook.s3-website-ap-southeast-2.amazonaws.com/';

let i = 0;
const getImageFilename = () => `screenshots/image${i++}.png`;

const run = async () => {
  await fs.remove('screenshots'); // TODO: Remove for prod
  await fs.mkdir('screenshots');

  const stories = await request(
    `${serviceBaseUrl}stories?url=${storybookBaseUrl}`
  ).then(JSON.parse);

  console.log('screenshot count:', stories.length);

  const screenshots = stories.map(s =>
    request(`${serviceBaseUrl}screenshot?url=${s}`).pipe(
      fs.createWriteStream(getImageFilename())
    )
  );

  await Promise.all(screenshots);
};

run();

process.on('beforeExit', () => {
  console.timeEnd('run');
});
