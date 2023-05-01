const { join, extname } = require('path');
const { readdir, stat, readFile, writeFile } = require('fs/promises');

async function mergeStyles(pathToStyle, pathToBundle) {
  try {
    const files = await readdir(pathToStyle);
    const contents = [];
    for await (const file of files) {
      try {
        const stats = await stat(join(pathToStyle, file));
        if (extname(file) === '.css' && stats.isFile()) {
          const content = await readFile(join(pathToStyle, file), 'utf-8');
          contents.push(content);
        }
      } catch {
        console.log('file reading error');
      }
    }
    await writeFile(pathToBundle, contents.join('\n'));
  } catch {
    console.log('error reading a folder or writing to a file');
  }
}

const pathToBundle = join(__dirname, 'project-dist', 'bundle.css');
const pathToStyle = join(__dirname, 'styles');
mergeStyles(pathToStyle, pathToBundle);

module.exports = mergeStyles;
