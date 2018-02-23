const fs = require('fs-extra');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const request = require('request-promise');

const run = async () => {
  await mkdirp('screenshots');

  console.time('stories');
  const stories = await request(
    'http://localhost:5008/stories?url=http://localhost:3333/'
  ).then(JSON.parse);
  console.timeEnd('stories');

  console.time('screenshots');
  let i = 0;
  const screenshots = stories.map(
    s =>
      request(`http://localhost:5008/screenshot?url=${s}`).then(img =>
        fs.writeFile(`screenshots/image${i++}.png`, img)
      )
    // .pipe(
    //   fs.createWriteStream(`image${i++}.png`)
    // )
  );
  await Promise.all(screenshots);
  console.timeEnd('screenshots');
};

run();
