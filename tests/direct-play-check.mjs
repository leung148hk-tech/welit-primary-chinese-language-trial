import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const repo = process.cwd();
const sourceFiles = readdirSync(repo).filter((name) => name.endsWith('.html') || name.endsWith('.js'));
const courseFiles = sourceFiles.filter((name) => name.endsWith('.html') && name !== 'index.html').sort();
const index = readFileSync(join(repo, 'index.html'), 'utf8');
const shim = readFileSync(join(repo, 'no-progress-storage.js'), 'utf8');
const errors = [];

if (courseFiles.length !== 24) errors.push(`Expected 24 course pages, found ${courseFiles.length}.`);
const directLinks = [...index.matchAll(/location\.href='([^']+\.html)'/g)].map((match) => match[1]);
if (directLinks.length !== 24) errors.push('Index must provide 24 direct course links.');
for (const link of directLinks) {
  if (!courseFiles.includes(link)) errors.push(`Index direct link does not target a course page: ${link}.`);
}
if (!/免登入、免帳戶、免雲端同步/.test(index)) errors.push('Index must clearly state the direct-play mode.');
if (/firebase|localStorage|sessionStorage|signIn|teacher-dashboard|student-tools/i.test(index)) errors.push('Index retains a forbidden dependency or legacy feature.');

const persistentApi = /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b|\bfirebase\b|signInAnonymously|signInWith|createUserWith/i;
for (const fileName of sourceFiles) {
  if (fileName.startsWith('tests/')) continue;
  const source = readFileSync(join(repo, fileName), 'utf8');
  if (persistentApi.test(source)) errors.push(`${fileName} contains a persistent storage, Firebase, or sign-in reference.`);
}
for (const fileName of courseFiles) {
  const source = readFileSync(join(repo, fileName), 'utf8');
  const shimIndex = source.indexOf('no-progress-storage.js');
  const firstSessionStoreUse = source.indexOf('__jcmkecSessionStore');
  if (shimIndex < 0) errors.push(`${fileName} does not load the memory storage shim.`);
  if (shimIndex >= 0 && firstSessionStoreUse >= 0 && shimIndex > firstSessionStoreUse) errors.push(`${fileName} uses the memory store before loading the shim.`);
  if (!/href="index\.html"/.test(source)) errors.push(`${fileName} does not provide a return link to the direct-play index.`);
}
if (!/const data = new Map\(\)/.test(shim) || !/Object\.defineProperty\(window, '__jcmkecSessionStore'/.test(shim)) errors.push('The storage shim does not expose the required in-memory API.');
if (persistentApi.test(shim)) errors.push('The storage shim must not call persistent storage or Firebase APIs.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Direct-play checks passed: ${courseFiles.length} course pages, no login, no Firebase, no persistent progress storage.`);
