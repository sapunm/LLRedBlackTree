
var RedBlackNode = function(key, value, isRed) {
    this.key = key;
    this.value = value;
    this.children = [RedBlackNode.Guard, RedBlackNode.Guard];  // children[0] -> left child, children[1] -> right child
    this.isRed = isRed === undefined ? true : isRed;
};

RedBlackNode.Guard = new RedBlackNode(undefined, undefined, false);

RedBlackNode.prototype.colorFlip = function() {
    this.isRed = !this.isRed;
    this.children[0].isRed = this.children[1].isRed = !this.children[1].isRed;
    return this;
}

RedBlackNode.prototype.rotate = function(direction) {// direction === 0 -> rotate left, direction === 1 -> rotate right
    var node = this.children[1-direction];
    this.children[1-direction] = node.children[direction];
    node.children[direction] = this;
    node.isRed = this.isRed;
    this.isRed = true;
    return node;
}

RedBlackNode.prototype.moveRed = function(direction) {// direction === 0 -> move red left, direction === 1 -> move red right                     
    var node = this.colorFlip();
    if (node.children[1-direction].children[0].isRed) {
        !direction && (node.children[1] = node.children[1].rotate(1));
        node = node.rotate(direction).colorFlip();
    }
    return node;
}

RedBlackNode.prototype.fixInvariants = function() {
    var node = this;

    if (!node.children[0].isRed && node.children[1].isRed)
        node = node.rotate(0);

    if (node.children[0].isRed && node.children[0].children[0].isRed)
        node = node.rotate(1);

    if (node.children[0].isRed && node.children[1].isRed)
        node.colorFlip();

    return node;
};

RedBlackNode.prototype.removeMinimal = function() {
    var node = this;
    if (node.children[0] === RedBlackNode.Guard)
        return RedBlackNode.Guard;

    if (!node.children[0].isRed && !node.children[0].children[0].isRed)
        node = node.moveRed(0);

    node.children[0] = node.children[0].removeMinimal();
    return node.fixInvariants();
};

var LLRedBlackTree = function() {
    this.root = RedBlackNode.Guard;
};

LLRedBlackTree.prototype.find = function(key) {
    for (var node = this.root; node !== RedBlackNode.Guard; node = node.children[key < node.key ? 0 : 1]) {
        if (key === node.key)
            return node.value;
    }
};

LLRedBlackTree.prototype.insert = function(key, value, node) {
    if (node === undefined) {
        this.root = this.insert(key, value, this.root);
        this.root.isRed = false;
    } else {       
        if (node === RedBlackNode.Guard)
            return new RedBlackNode(key, value);

        if (key === node.key)
            node.value = value;
        else {
            var child = key < node.key ? 0 : 1;
            node.children[child] = this.insert(key, value, node.children[child]);
        }
        return node.fixInvariants();
    }
}

LLRedBlackTree.prototype.remove = function(key, node) {
    if (node === undefined) {
        this.root = this.remove(key, this.root);
        this.root.isRed = false;
    } else {
        if (key < node.key) {
            if (!node.children[0].isRed && !node.children[0].children[0].isRed)
                node = node.moveRed(0);

            node.children[0] = this.remove(key, node.children[0]);
        } else {
            if (node.children[0].isRed)
                node = node.rotate(1);

            if (key === node.key && node.children[1] === RedBlackNode.Guard)
                return RedBlackNode.Guard;

            if (!node.children[1].isRed && !node.children[1].children[0].isRed)
                node = node.moveRed(1);

            if (key === node.key) {
                for (var min = node.children[1]; min.children[0] !== RedBlackNode.Guard; min = min.children[0]);
                node.key = min.key;
                node.value = min.value;
                node.children[1] = node.children[1].removeMinimal();
            } else {
                node.children[1] = this.remove(key, node.children[1]);  
            } 
        }
        return node.fixInvariants();
    }
};
