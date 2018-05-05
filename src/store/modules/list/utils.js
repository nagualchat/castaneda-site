
const getIndex = (node, id) => {
  return node.map((el) => el.id).indexOf(id);
}


const getNode = (tree, id) => {
  var node;
  tree.some(function(n) {
    if (n.id === id) {
      return node = n;
    }
    if (n.children) {
      return node = getNode(n.children, id);
    }
  });
  return node;
}

const getLinks = (tree, id) => {
  var nodes = [];
  tree.some(function(n) {
    if (n.link === id) {
     nodes.push(n);
    }
    if (n.children) {
      nodes.push(getLinks(n.children, id));
    }
  });
  return nodes || null;
}

const getParent = (tree, id) => {
  var parent;
  tree.some(function iter(p) {
    return function(a) {
      if (a.id === id) {
        parent = p;
        return true;
      }
      return Array.isArray(a.children) && a.children.some(iter(a));
    };
  }(undefined));
  return parent;
}

// Ищет предыдущий элемент, находящегося на таком же уровне вложенности
const findPrevSibling = (tree, id) => {
  var index = tree.map((el) => el.id).indexOf(id);
  var current = tree[index];
  for (var i = index - 1; i < tree.length; i--) {
    if (tree[i].depth == current.depth) {
      return tree[i];
    }
    return null;
  }
}

export default {
  getIndex,
  getNode,
  getLinks,
  getParent,
  findPrevSibling
};