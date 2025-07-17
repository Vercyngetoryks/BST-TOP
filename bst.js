class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    return this.buildTreeHelper(sortedArray);
  }

  buildTreeHelper(array) {
    if (array.length === 0) return null;
    const middle = Math.floor(array.length / 2);
    const node = new Node(array[middle]);
    node.left = this.buildTreeHelper(array.slice(0, middle));
    node.right = this.buildTreeHelper(array.slice(middle + 1));
    return node;
  }
  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) return;
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      return this;
    } else {
      let current = this.root;
      while (true) {
        if (value === current.value) return undefined;
        if (value < current.value) {
          if (current.left === null) {
            current.left = newNode;
            return this;
          }
          current = current.left;
        } else {
          if (current.right === null) {
            current.right = newNode;
            return this;
          }
          current = current.right;
        }
      }
    }
  }
  delete(value) {
    if (this.root === null) return undefined;

    let current = this.root;
    let parent = null;

    while (current !== null) {
      if (value < current.value) {
        parent = current;
        current = current.left;
      } else if (value > current.value) {
        parent = current;
        current = current.right;
      } else {
        // Case 1: leaf
        if (current.left === null && current.right === null) {
          if (parent === null) this.root = null;
          else if (parent.left === current) parent.left = null;
          else parent.right = null;
          return this;
        }

        // Case 2: one child
        if (current.left === null || current.right === null) {
          const child = current.left || current.right;
          if (parent === null) this.root = child;
          else if (parent.left === current) parent.left = child;
          else parent.right = child;
          return this;
        }

        // Case 3: two children
        let successor = current.right;
        let successorParent = current;
        while (successor.left !== null) {
          successorParent = successor;
          successor = successor.left;
        }

        if (successorParent !== current) {
          successorParent.left = successor.right;
        } else {
          current.right = successor.right;
        }

        current.value = successor.value;
        return this;
      }
    }

    return false;
  }

  find(value) {
    if (this.root === null) return false;

    let current = this.root;

    while (current) {
      if (value === current.value) return current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return false;
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    const queue = [];
    if (this.root !== null) queue.push(this.root);

    while (queue.length > 0) {
      const current = queue.shift();
      callback(current);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }
  levelOrder() {
    const result = [];
    const queue = [];

    if (this.root !== null) queue.push(this.root);

    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return result;
  }
  inOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }
    if (node === null) return;

    this.inOrderForEach(callback, node.left);
    callback(node);
    this.inOrderForEach(callback, node.right);
  }

  preOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }
    if (node === null) return;

    callback(node);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);
  }

  postOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required");
    }
    if (node === null) return;

    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node);
  }

  height(node = this.root) {
    if (node === null) return -1;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return 1 + Math.max(leftHeight, rightHeight);
  }

  depth(targetNode, current = this.root, depth = 0) {
    if (current === null) return -1;

    if (current === targetNode) return depth;

    const left = this.depth(targetNode, current.left, depth + 1);
    if (left !== -1) return left;

    return this.depth(targetNode, current.right, depth + 1);
  }

  isBalanced(node = this.root) {
    function checkHeight(n) {
      if (n === null) return 0;

      const left = checkHeight(n.left);
      if (left === -1) return -1;

      const right = checkHeight(n.right);
      if (right === -1) return -1;

      if (Math.abs(left - right) > 1) return -1;

      return 1 + Math.max(left, right);
    }

    return checkHeight(node) !== -1;
  }

  inOrder() {
    const result = [];

    function traverse(node) {
      if (node === null) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    }

    traverse(this.root);
    return result;
  }

  rebalance() {
    const values = this.inOrder();
    this.root = this.buildTreeHelper(values);
  }
}

function getRandomArray(size = 15, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

const tree = new Tree(getRandomArray());

console.log("--- Initial tree ---");
console.log("Balanced?", tree.isBalanced());

console.log("\nLevel order:");
tree.levelOrderForEach((node) => console.log(node.value));

console.log("\nPre order:");
tree.preOrderForEach((node) => console.log(node.value));

console.log("\nPost order:");
tree.postOrderForEach((node) => console.log(node.value));

console.log("\nIn order:");
tree.inOrderForEach((node) => console.log(node.value));

tree.insert(120);
tree.insert(130);
tree.insert(140);
tree.insert(150);
tree.insert(160);

console.log("\n--- Po dodaniu wartości > 100 ---");
console.log("Zbalansowane?", tree.isBalanced());

tree.rebalance();

console.log("\n--- Po rebalance ---");
console.log("Zbalansowane?", tree.isBalanced());

console.log("\nLevel order (zbalansowane):");
tree.levelOrderForEach((node) => console.log(node.value));

console.log("\nPre order (zbalansowane):");
tree.preOrderForEach((node) => console.log(node.value));

console.log("\nPost order (zbalansowane):");
tree.postOrderForEach((node) => console.log(node.value));

console.log("\nIn order (zbalansowane):");
tree.inOrderForEach((node) => console.log(node.value));
