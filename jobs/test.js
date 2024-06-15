const { parentPort } = require('worker_threads');
const Cabin = require('cabin');
const Axe = require('axe');
const { Signale } = require('signale');

const logger = new Axe({
  logger: new Signale(),
  meta: {
    omittedFields: [ 'app' ]
  }
});

const cabin = new Cabin({logger});

function cancel() {
  if (parentPort) parentPort.postMessage('cancelled');
  else process.exit(0);
}

if (parentPort)
  parentPort.once('message', message => {
    if (message === 'cancel') return cancel();
  });

(async () => {
    cabin.success(`Pre-flight checks good. All systems go.`)
    // signal to parent that the job is done
    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
})();