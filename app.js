const Graceful = require('@ladjs/graceful');
const Cabin = require('cabin');
const Axe = require('axe');
const { Signale } = require('signale');

const Bree = require('bree');

const logger = new Axe({
  logger: new Signale(),
  meta: {
    omittedFields: [ 'app' ]
  }
});

const cabin = new Cabin({logger})

const bree = new Bree({
  //
  // NOTE: by default the `logger` is set to `console`
  // however we recommend you to use CabinJS as it
  // will automatically add application and worker metadata
  // to your log output, and also masks sensitive data for you
  // <https://cabinjs.com>
  //
  // NOTE: You can also pass `false` as `logger: false` to disable logging
  //
  logger: cabin,

  //
  // NOTE: instead of passing this Array as an option
  // you can create a `./jobs/index.js` file, exporting
  // this exact same array as `module.exports = [ ... ]`
  // doing so will allow you to keep your job configuration and the jobs
  // themselves all in the same folder and very organized
  //
  // See the "Job Options" section below in this README
  // for the complete list of job options and configurations
  //
  // jobs: [
  //   {
  //     name: 'test'
  //   },
  //   {
  //     name: 'bot',
  //     interval: '1h',
  //     timeout: 0
  //   },
  // ]
});

bree.on('worker created', (name) => {
  cabin.info('worker created', name);
});

bree.on('worker deleted', (name) => {
  cabin.info('worker deleted', name);
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
(async () => {
  cabin.info("Bree scheduler starting")
  await bree.start();
})();