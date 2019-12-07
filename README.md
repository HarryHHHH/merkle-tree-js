## Install

```bash
npm install merkletree
```

## Sample Usage

Construct tree, add node, generate proof, and verify proof:

```js
const MerkleTree = require('merkletree')

const tree = new MerkleTree(['a','b','c','d','e','f','g'], {hash: 'sha256'})
const root = tree.getRoot() // 'ecae25ca5b1bac0351a75078affeaf294c4eac46648ac23de5db3cef29545839'
const proof = tree.getProof('a') // { node: 'a', index: 0, path: [ [ 3, 1 ], [ 2, 1 ], [ 1, 1 ] ] }
console.log(tree.verify(proof)) // true

// Use the first proof on a different tree
const tree2 = new MerkleTree(['a','b','c','d','e','f','g', 'new e'], {hash: 'sha256'})
const root2 = tree2.getRoot() // '49fe7784aba3d10cd54629517705f0602885a79f119691d7ae345756a76fd1fd'
console.log(tree2.verify(proof)) // false

// Add a node make previous proof invalid
tree.addNode('add a node')
const root3 = tree.getRoot() // '73fde71b04213d28311a29fd08de067aef4e05bfab9c8d733008bfc988e07a44'
console.log(tree.verify(proof)) // false 
```
## Hashes
#Using Nodejs/crypto package.
```js
//Sample sha256 hash
var crypto = require('crypto');
function sha256(data) {
    const hash = crypto.createHash('sha256')
    return hash.update(data, 'utf8').digest('hex')
}
```
#Custom Hash
```js
// use previous hash function sha256()
const tree = new MerkleTree(['a','b','c','d','e','f','g'], {hash: sha256})
```

## Test

```bash
npm test
```
## References
[MerkleTree Wiki](https://en.wikipedia.org/wiki/Merkle_tree)  
[Merkle Verification](https://bitcoin.stackexchange.com/questions/50674/why-is-the-full-merkle-path-needed-to-verify-a-transaction)  
[Crypto](https://nodejs.org/api/crypto.html)  
