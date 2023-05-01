const { join, basename, extname } = require('path');
const { readdir, stat } = require('fs/promises');

async function getInformation(path) {
  try {
    const files = await readdir(path);
    for await (const file of files) {
      const stats = await stat(join(path, file));
      if (stats.isFile()) {
        const name = basename(file, extname(file));
        const expansion = extname(file).replace('.', '');
        const size = stats.size / 1024;
        const info = `${name} - ${expansion} - ${size}kb`;
        console.log(info);
      }
    }
  } catch {
    console.log('folder reading error');
  }
}

const path = join(__dirname, 'secret-folder');
getInformation(path);
