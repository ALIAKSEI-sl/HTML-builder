const { join } = require('path');
const { createReadStream } = require('fs');

function readFile(path) {
  const readStream = createReadStream(path, { encoding: 'utf8' });
  readStream.pipe(process.stdout);
}

const path = join(__dirname, 'text.txt');
readFile(path);
