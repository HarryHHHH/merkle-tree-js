const MerkleTree = require('./index')
const assert = require('assert')

describe('Test Constructor', function () {

    it('Should pass valid input arguments: array', function () {
        const build_tree_1 = () =>  new MerkleTree();
        const build_tree_2 = () =>  new MerkleTree(['1']);
        const build_tree_3 = () =>  new MerkleTree(['a', 'b', 'c', 'd']);
        const build_tree_4 = () =>  new MerkleTree(['a', 'f', 'c','d',1]);
        const build_tree_5 = () =>  new MerkleTree([{a: 1, b: 2}]);
        assert.deepEqual(build_tree_1().originalArray, []);
        assert.deepEqual(build_tree_2().originalArray, ['1']);
        assert.deepEqual(build_tree_3().originalArray, ['a', 'b', 'c', 'd']);
        assert.deepEqual(build_tree_4().originalArray, ['a', 'f', 'c','d',1]);
        assert.deepEqual(build_tree_5().originalArray, [{a: 1, b: 2}]);
    })

    it('Should throw Error invalid input arguments: array', function () {
        const build_tree_1 = () =>  new MerkleTree('test');
        const build_tree_2 = () =>  new MerkleTree(1);
        const build_tree_3 = () =>  new MerkleTree(1,2);
        const build_tree_4 = () =>  new MerkleTree({a: 1, b: 2});
        assert.throws(build_tree_1, Error);
        assert.throws(build_tree_2, Error);
        assert.throws(build_tree_3, Error);
        assert.throws(build_tree_4, Error);
    })

    it('Should pass valid optional arguments: option', function () {
        const defaultOption = {hash: "sha256", inputHash: "sha256"}
        const build_tree_1 = () =>  new MerkleTree(['1']);
        const build_tree_2 = () =>  new MerkleTree(['1'], {});
        const build_tree_3 = () =>  new MerkleTree(['1'], {hash: 'md5'});
        const build_tree_4 = () =>  new MerkleTree(['1'], {inputHash: 'md5'});
        assert.deepEqual(build_tree_1().option, defaultOption)
        assert.deepEqual(build_tree_2().option, defaultOption)
        assert.deepEqual(build_tree_3().option, {hash: 'md5', inputHash: 'sha256'})
        assert.deepEqual(build_tree_4().option, {hash: 'sha256', inputHash: 'md5'})
    })

    it('Should throw Error invalid optional arguments: option', function () {
        const build_tree_1 = () =>  new MerkleTree(['1'], []);
        const build_tree_2 = () =>  new MerkleTree(['1'], 'a');
        const build_tree_3 = () =>  new MerkleTree(['1'], 0);
        assert.throws(build_tree_1, Error);
        assert.throws(build_tree_2, Error);
        assert.throws(build_tree_3, Error);
    })

    it('Should pass function as hash method: option', function () {
        const hashFunc = (data) => {
            return 'a bad hash'
        }
        const build_tree_1 = () =>  new MerkleTree([1], {inputHash: hashFunc});
        assert.deepEqual(build_tree_1().hashedArray, ['a bad hash'])
    })
})

describe('Test buildTree', function () {

    it('Should produce correct root', function () {
        const tree_1 = new MerkleTree();
        const tree_2 = new MerkleTree(['1']);
        const tree_3 = new MerkleTree(['a', 'b', 'c', 'd']);
        const tree_4 = new MerkleTree(['a', 'f', 'c','d',1]);
        const tree_5 = new MerkleTree([{a: 1, b: 2}]);
        const tree_6 = new MerkleTree([{a: 1, b: 2}], {inputHash: 'md5'});
        const tree_7 = new MerkleTree([{a: 1, b: 2}], {hash: 'md5'});

        assert.equal(tree_1.root, undefined)
        assert.equal(tree_2.root, 'e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9')
        assert.equal(tree_3.root, '0f0e389203003791a82f6018a48d94c63cf00bcca1be0941a5cd905f7da6a877')
        assert.equal(tree_4.root, 'f9f3b6d23d6020470b811700700c7196a0182e9e607a68153653663c16d22d74')
        assert.equal(tree_5.root, '5894f452548beeb4535e6a6746ea79b1c2a3547624f5e0c915372f5828939eac')
        assert.equal(tree_6.root, '336c7a147def2e75da66fcecff4f30f19bb8f9d5f0d5b68148dd58db023c90e1')
        assert.equal(tree_7.root, '9a9c28d39373c4219e0e34f4cadb8575')
    })
})

describe('Test inputHash', function () {

    it('Should produce correct result', function () {
        const tree_1 = new MerkleTree([{a: 1, b: 2}], {inputHash: 'md5'});
        const tree_2 = new MerkleTree([{a: 1, b: 3}], {inputHash: 'md5'});
        const tree_3 = new MerkleTree([{a: 1, b: 3}], {inputHash: 'sha256'});
        const tree_4 = new MerkleTree([{a: 1, b: 2}], {inputHash: 'sha256'});

        assert.deepEqual(tree_1.hashedArray, [ '608de49a4600dbb5b173492759792e4a' ])
        assert.deepEqual(tree_2.hashedArray, [ '1b9dea690a239045531583e60b491b49' ])
        assert.deepEqual(tree_3.hashedArray, [ 'f9c6777fb86597920de313c707c2c0aa7b059e208a66e1f56f7a2b548e11453d' ])
        assert.deepEqual(tree_4.hashedArray, [ '43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777' ])
    })
})

describe('Test hash()', function () {

    it('Should produce correct result', function () {
        const tree_1 = new MerkleTree([{a: 1, b: 2}], {hash: 'md5'});
        const tree_2 = new MerkleTree([{a: 1, b: 3}], {hash: 'md5'});
        const tree_3 = new MerkleTree([{a: 1, b: 3}], {hash: 'sha256'});
        const tree_4 = new MerkleTree([{a: 1, b: 2}], {hash: 'sha256'});
        const tree_5 = new MerkleTree([{a: 1, b: 2},2,3], {hash: 'md5'});

        assert.deepEqual(tree_1.root, '9a9c28d39373c4219e0e34f4cadb8575')
        assert.deepEqual(tree_2.root, '222fe34c904dc381ad24e45732199ad7')
        assert.deepEqual(tree_3.root, '7937f5e6336c2ed8402e0f8c01cccabb0738c55cef8b885d5bcfaed31b141696')
        assert.deepEqual(tree_4.root, '5894f452548beeb4535e6a6746ea79b1c2a3547624f5e0c915372f5828939eac')
        assert.deepEqual(tree_5.root, '093672b5628fab5ac802987bcee13fdb')
    })
})

describe('Test addNode()', function () {

    it('Should produce correct result', function () {
        const tree_1 = new MerkleTree([1]);
        assert.equal(tree_1.root, 'e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9')
        tree_1.addNode(2)
        assert.equal(tree_1.root, '4188fb1f7f4870bc843380f00271cffdd056d042fdee096e7158140e1ba981b9')
    })

    it('Should produce same result when same inputs are added through addNode()', function () {
        const tree_1 = new MerkleTree([1]);
        tree_1.addNode(2)
        const tree_2 = new MerkleTree([1,2]);

        assert.equal(tree_1.root, tree_2.root)
    })

    it('Should produce different result when new node added', function () {
        const tree = new MerkleTree([1]);
        const root1 = tree.getRoot()
        tree.addNode(2)
        const root2 = tree.getRoot()
        assert.equal(root2 == root1, false)
    })
})

describe('Test getProof()', function () {

    it('Should produce correct proof', function () {
        const tree_1 = new MerkleTree(['1']);
        const tree_2 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        const tree_3 = new MerkleTree(['a', 'b', 'c','d', 'e', 'f','g']);
        
        assert.deepEqual(tree_1.getProof('1'), {node: '1', index: 0, path: []})
        assert.deepEqual(tree_2.getProof(), {node: undefined, index: -1, path: []})
        assert.deepEqual(tree_3.getProof('b'), {node: 'b', index: 1, path: [[3,0],[2,1],[1,1]]})
        assert.deepEqual(tree_3.getProof('d'), {node: 'd', index: 3, path: [[3,2],[2,0],[1,1]]})
        assert.deepEqual(tree_3.getProof('g'), {node: 'g', index: 6, path: [[3,7],[2,2],[1,0]]})        
    })

    it('Should get path based on index if provided', function () {
        const tree_1 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        assert.deepEqual(tree_1.getProof('a', 3), {node: 'a', index: 3, path: [[3,2],[2,0],[1,1]]})
    })

    it('Should get empty path with empty tree', function () {
        const tree_1 = new MerkleTree();
        assert.deepEqual(tree_1.getProof('1'), {node: '1', index: -1, path: []})
        assert.deepEqual(tree_1.getProof(1), {node: 1, index: -1, path: []})
    })

    it('Should get empty path with empty node', function () {
        const tree_1 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        assert.deepEqual(tree_1.getProof(), {node: undefined, index: -1, path: []})
    })

    it('Should get empty path if not found', function () {
        const tree_1 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        assert.deepEqual(tree_1.getProof('1'), {node: '1', index: -1, path: []})
        assert.deepEqual(tree_1.getProof(1), {node: 1, index: -1, path: []})
    })

    it('Should return {index: -1} if index is provided but not valid', function () {
        const tree_1 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        assert.deepEqual(tree_1.getProof('a', 9.123), {node: 'a', index: -1, path: []})
        assert.deepEqual(tree_1.getProof('a', {}), {node: 'a', index: -1, path: []})
        assert.deepEqual(tree_1.getProof('a', 'abc'), {node: 'a', index: -1, path: []})
        assert.deepEqual(tree_1.getProof('a', []), {node: 'a', index: -1, path: []})
        assert.deepEqual(tree_1.getProof('a', -2), {node: 'a', index: -1, path: []})
        assert.deepEqual(tree_1.getProof('a', 999), {node: 'a', index: -1, path: []})
    })
})

describe('Test verify()', function () {

    it('Should return true if matched', function () {
        const tree_1 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        const proof_1 = tree_1.getProof('d')
        const proof_2 = tree_1.getProof('a', 0)
        assert.equal(tree_1.verify(proof_1), true)
        assert.equal(tree_1.verify(proof_2), true)

        const tree_2 = new MerkleTree(['a']);
        const proof_3 = tree_2.getProof('a')
        assert.equal(tree_2.verify(proof_3), true)
    })

    it('Should return false if empty tree', function () {
        const tree_1 = new MerkleTree([]);
        const proof_1 = tree_1.getProof(1)
        assert.equal(tree_1.verify(proof_1), false)
    })

    it('Should return false if not found', function () {
        const tree_1 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        const tree_2 = new MerkleTree(['a']);
        const proof_1 = tree_1.getProof('f')
        const proof_2 = tree_2.getProof()
        const proof_3 = tree_2.getProof(1)
        assert.equal(tree_1.verify(proof_1), false)
        assert.equal(tree_2.verify(proof_2), false)
        assert.equal(tree_2.verify(proof_3), false)
    })

    it('Should return false if not in the correct position', function () {
        const tree_1 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        const proof_1 = tree_1.getProof('b', 4)
        const proof_2 = tree_1.getProof('b', 10)
        const proof_3 = tree_1.getProof('b', -1)
        assert.equal(tree_1.verify(proof_1), false)
        assert.equal(tree_1.verify(proof_2), false)
        assert.equal(tree_1.verify(proof_3), false)
    })

    it('Should return false if it is from a different tree', function () {
        const tree_1 = new MerkleTree(['a', 'b', 'c', 'd', 'e']);
        const tree_2 = new MerkleTree(['a', 'b', 'c', 'd']);
        const proof_1 = tree_1.getProof('b', 1)
        assert.equal(tree_2.verify(proof_1), false)
    })
})