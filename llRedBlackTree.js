
var RedBlackNode = function(key, value, isRed) {
    this.key = key;
    this.value = value;
    this.children = [RedBlackNode.Guard, RedBlackNode.Guard];  // children[0] -> left child, children[1] -> right child
    this.isRed = isRed === undefined ? true : isRed;
};

RedBlackNode.Guard = new RedBlackNode(undefined, undefined, false);

RedBlackNode.prototype.colorFlip = function() {
    this.isRed = !this.isRed;
    this.children[0].isRed = !this.children[0].isRed;
    this.children[1].isRed = !this.children[1].isRed;
}

RedBlackNode.prototype.rotate = function(direction) {// direction === 0 -> rotate left, direction === 1 -> rotate right
   var node = this.children[1-direction];
   this.children[1-direction] = node.children[direction];
   node.children[direction] = this;
   node.isRed = this.isRed;
   this.isRed = true;
   return node;
}

var LLRedBlackTree = function() {
    this.root = RedBlackNode.Guard;
};

LLRedBlackTree.prototype.find = function(key) {
    for (var node = this.root; node !== RedBlackNode.Guard; node = node.children[key < node.key ? 0 : 1]) {
        if (key === node.key)
            return node.value;
    }
    return undefined;
};

LLRedBlackTree.prototype.insert = function(key, value, node) {
    if (node === undefined) {
        this.root = this.insert(key, value, this.root);
        this.root.isRed = false;
    } else {       
        if (node === RedBlackNode.Guard)
            return new RedBlackNode(key, value);

        // if (node.children[0].isRed && node.children[1].isRed)
        //     node.colorFlip();

        if (key === node.key)
            node.value = value;
        else {
            var child = key < node.key ? 0 : 1;
            node.children[child] = this.insert(key, value, node.children[child]);
        }

        if (!node.children[0].isRed && node.children[1].isRed)
            node = node.rotate(0);

        if (node.children[0].isRed && node.children[0].children[0].isRed)
            node = node.rotate(1);

        if (node.children[0].isRed && node.children[1].isRed)
            node.colorFlip();

        return node;
    }
}
