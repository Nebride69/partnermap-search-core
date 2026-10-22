// Lightweight repository hygiene gate; not a replacement for a full secret scan.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../', import.meta.url);
const excluded = new Set(['node_modules', '.git', 'dist', 'coverage']);
const disallowedName = /^(?:\.env(?:\..*)?|.*\.(?:pem|p12|pfx|key))$/i;
const tokenPattern = /(?:gh[pousr]_[A-Za-z0-9]{30,}|sb_secret_[A-Za-z0-9_-]{18,}|sk_(?:proj_)?[A-Za-z0-9_-]{25,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/;
const files = [];
async function walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (excluded.has(ent.name)) continue;
    const path = join(dir, ent.name);
    if (ent.isDirectory()) await walk(path);
    else if (ent.isFile()) files.push(path);
  }
}
await walk(new URL('.', root).pathname);
const bad = [];
for (const file of files) {
  const filename = file.split('/').at(-1);
  if (disallowedName.test(filename)) bad.push(`${relative(root.pathname, file)}: disallowed filename`);
  const value = await readFile(file);
  if (value.includes(0)) continue;
  if (tokenPattern.test(value.toString('utf8'))) bad.push(`${relative(root.pathname, file)}: potential secret pattern`);
}
if (bad.length) {
  console.error('Repository hygiene check failed:\n' + bad.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Repository hygiene check passed (${files.length} files inspected).`);
}
