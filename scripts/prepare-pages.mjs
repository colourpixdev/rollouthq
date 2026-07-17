import { cp, mkdir, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const distDir = path.resolve(scriptDir, '..', 'dist');
const rootAssetsDir = path.join(projectRoot, 'assets');

await rm(rootAssetsDir, { recursive: true, force: true });
await rm(path.join(projectRoot, '404.html'), { force: true });
await rm(path.join(projectRoot, 'index.html'), { force: true });

await mkdir(distDir, { recursive: true });
await copyFile(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
await copyFile(path.join(distDir, 'index.html'), path.join(projectRoot, 'index.html'));
await copyFile(path.join(distDir, '404.html'), path.join(projectRoot, '404.html'));
await cp(path.join(distDir, 'assets'), rootAssetsDir, { recursive: true, force: true });