const { join } = require('path');
const { createWriteStream } = require('fs');
const { createInterface } = require('readline');

function writeFile(path) {
  const writeStream = createWriteStream(path);

  const readline = createInterface({
    input: process.stdin,
    output: writeStream,
  });

  writeStream.on('open', () => {
    console.log('Enter text to write to the file');
  });

  process.on('SIGINT', () => {
    console.log('Exiting...');
    process.exit(1);
  });

  readline.on('line', (input) => {
    if (input === 'exit') {
      console.log('Exiting...');
      process.exit(0);
    }
    writeStream.write(input + '\n');
  });
}

const path = join(__dirname, 'text.txt');
writeFile(path);
