import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import buildHashes from './builders/hashes';
import buildTrie from './builders/trie';

(function run() {
  console.log('Updating rules...');
  const publicSuffixList = readFileSync(
    resolve(__dirname, '../publicsuffix/public_suffix_list.dat'),
    { encoding: 'utf-8' },
  );

  // Build trie and update TypeScript file
  writeFileSync(
    resolve(__dirname, '../lib/lookup/data/trie.ts'),
    buildTrie(publicSuffixList),
    'utf-8',
  );

  // Build hashes and update TypeScript file
  const packed = buildHashes(publicSuffixList);
  writeFileSync(
    resolve(__dirname, '../lib/lookup/data/hashes.ts'),
    `// Code automatically generated using ./bin/builders/hashes.js
export default new Uint32Array([${Array.from(packed)}]);`,
    'utf-8',
  );
})();
