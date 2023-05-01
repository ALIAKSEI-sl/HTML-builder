const { join } = require('path');
const { mkdir, readdir, copyFile, stat } = require('fs/promises');

async function copyDirectory(pathToDir, pathToCopyDir) {
  try {
    await mkdir(pathToCopyDir, { recursive: true });
    const files = await readdir(pathToDir);
    for await (const file of files) {
      const stats = await stat(join(pathToDir, file));
      if (stats.isDirectory()) {
        copyDirectory(join(pathToDir, file), join(pathToCopyDir, file));
      } else {
        try {
          await copyFile(join(pathToDir, file), join(pathToCopyDir, file));
        } catch {
          console.log('copying error');
        }
      }
    }
  } catch {
    console.log('folder creation error');
  }
}

const pathToFiles = join(__dirname, 'files');
const pathToCopyFolder = join(__dirname, 'files-copy');
copyDirectory(pathToFiles, pathToCopyFolder);

module.exports = copyDirectory;
