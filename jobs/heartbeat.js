const { parentPort } = require('worker_threads');
const Cabin = require('cabin');
const Axe = require('axe');
const { Signale } = require('signale');

const signaleOptions = {
    types: {
        heartbeat: {
            badge: '❤️',
            color: 'green',
            label: 'heartbeat',
            logLevel: 'info'
        }
    }
}

const logger = new Axe({
  logger: new Signale(signaleOptions),
  meta: {
    omittedFields: [ 'app' ]
  }
});

const cabin = new Cabin({logger});

function cancel() {
  // do cleanup here
  // (if you're using @ladjs/graceful, the max time this can run by default is 5s)

  // send a message to the parent that we're ready to terminate
  // (you could do `process.exit(0)` or `process.exit(1)` instead if desired
  // but this is a bit of a cleaner approach for worker termination
  if (parentPort) parentPort.postMessage('cancelled');
  else process.exit(0);
}

if (parentPort)
  parentPort.once('message', message => {
    if (message === 'cancel') return cancel();
  });

(async () => {
    cabin.heartbeat(`It\'s alive!`)
    // signal to parent that the job is done
    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
})();