const { join } = require('path');
const { mkdir, readdir, copyFile, stat, rm, rmdir } = require('fs/promises');

async function copyDirectory(pathToDir, pathToCopyDir) {
  try {
    await mkdir(pathToCopyDir, { recursive: true });
    await removeFolder(pathToCopyDir);
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
  } catch (err) {
    console.log('folder creation error', err);
  }
}

async function removeFolder(pathToDir) {
  try {
    const files = await readdir(pathToDir);
    for await (const file of files) {
      const stats = await stat(join(pathToDir, file));
      if (stats.isDirectory()) {
        await removeFolder(join(pathToDir, file));
      } else {
        await rm(join(pathToDir, file));
      }
    }
    await rmdir(pathToDir);
  } catch {
    console.log('folder deletion error');
  }
}

module.exports = copyDirectory;

const pathToFiles = join(__dirname, 'files');
const pathToCopyFolder = join(__dirname, 'files-copy');
copyDirectory(pathToFiles, pathToCopyFolder);
