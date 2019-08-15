class SimpleTagSerializer {

  async serialize(ast) {
    let buffer = ''

    if (ast.type == 'recognized_tag') {
      buffer += await this.writeText(ast.openTag)
      for (var i in ast.children) {
        buffer += await this.serialize(ast.children[i])
      }
      buffer += await this.writeText(ast.closeTag)
    }
    else if (ast.type == 'root') {
      for (var i in ast.children) {
        buffer += await this.serialize(ast.children[i])
      }
    }
    else {
      buffer += await this.writeText(ast)
    }

    return buffer;
  }

  async writeText(node) {
    return node.text
  }

}

module.exports = {
  SimpleTagSerializer,
};
