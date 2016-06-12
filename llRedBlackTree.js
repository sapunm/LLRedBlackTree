
var RedBlackNode = function(key, value) {
    this.key = key;
    this.value = value;
    this.children = [RedBlackNode.Guard, RedBlackNode.Guard];  // children[0] -> left child, children[1] -> right child
    this.color = RedBlackNode.Color.Red;
};

RedBlackNode.Color = {
    Red: true,
    Black: false
};

RedBlackNode.Guard = new RedBlackNode();
RedBlackNode.Guard.color = RedBlackNode.Color.Black;

RedBlackNode.prototype.colorFlip = function() {
    this.color = !this.color;
    this.children[0].color = !this.children[0].color;
    this.children[1].color = !this.children[1].color;
}

RedBlackNode.prototype.rotate = function(direction) // direction === 0 -> rotate left, direction === 1 -> rotate right
{
   var node = this.children[1-direction];
   this.children[1-direction] = node.children[direction];
   node.children[direction] = this;
   node.color = this.color;
   this.color = RedBlackNode.Color.Red;
   return node;
}

var LLRedBlackTree = function() {
    this.root = RedBlackNode.Guard;
};

LLRedBlackTree.prototype.find = function(key) {
    for (var node = this.root; node != RedBlackNode.Guard; node = node.children[key < node.key ? 0 : 1]) {
        if (key === node.key)
            return node.value;
    }
    return undefined;
};

LLRedBlackTree.prototype.insert = function(key, value, node) {
    if (node === undefined) {
        this.root = this.insert(key, value, this.root);
        this.root.color = RedBlackNode.Color.Black;        
    } else {       
        if (node === RedBlackNode.Guard)
            return new RedBlackNode(key, value);

        if (node.children[0].color && node.children[1].color)
            node.colorFlip();

        if (key === node.key)
            node.value = value;
        else {
            var child = key < node.key ? 0 : 1;
            node.children[child] = this.insert(key, value, node.children[child]);
        }

        if (!node.children[0].color && node.children[1].color)
            node = node.rotate(0);

        if (node.children[0].color && node.children[0].children[0].color)
            node = node.rotate(1);

        return node;
    }
}
