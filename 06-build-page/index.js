const { join, extname, basename } = require('path');
const { mkdir, readdir, stat, readFile, writeFile } = require('fs/promises');
const copyDirectory = require('../04-copy-directory/index');
const mergeStyles = require('../05-merge-styles/index');

async function buildPage(path) {
  try {
    await mkdir(path.toDist, { recursive: true });

    mergeStyles(path.toStyles, path.toDistStyle);

    let template = await readFile(path.toTemplate, 'utf-8');
    const filesComponent = await readdir(path.toComponents);
    for await (const file of filesComponent) {
      const stats = await stat(join(path.toComponents, file));
      if (extname(file) === '.html' && stats.isFile()) {
        const name = basename(file, extname(file));
        const tag = await readFile(join(path.toComponents, file), 'utf-8');
        template = template.replaceAll(`{{${name}}}`, tag);
      }
    }
    await writeFile(path.toDistTemplate, template);

    copyDirectory(path.toAssets, path.toDistAssets);
  } catch {
    console.log('error reading a folder or writing to a file');
  }
}

const path = {
  toStyles: join(__dirname, 'styles'),
  toComponents: join(__dirname, 'components'),
  toAssets: join(__dirname, 'assets'),
  toTemplate: join(__dirname, 'template.html'),
  toDist: join(__dirname, 'project-dist'),
  toDistAssets: join(__dirname, 'project-dist', 'assets'),
  toDistStyle: join(__dirname, 'project-dist', 'style.css'),
  toDistTemplate: join(__dirname, 'project-dist', 'template.html'),
};

buildPage(path);
