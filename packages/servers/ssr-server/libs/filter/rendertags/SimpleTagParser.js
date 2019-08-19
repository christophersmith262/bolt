class SimpleTagParser {

  constructor(lexer) {
    this.lexer = lexer
    this._root = null
  }

  async getAST() {
    if (!this._root) {
      this._root = await this._parse();
    }

    return this._root;
  }

  async filterTags(tagName, ast) {
    if (!ast) {
      ast = await this.getAST();
    }

    let results = [];
    for (var i in ast.children) {
      const node = ast.children[i];

      if (node.type == 'recognized_tag') {
        if (!tagName || node.openTag.tagName == tagName) {
          results.push(node);
        }
        results = results.concat(await this.filterTags(tagName, node))
      }
    }

    return results;
  }

  async _parse() {
    const rootContext = {
      type: 'root',
      children: [],
    }

    let context = rootContext

    const contextStack = [rootContext]

    let token;
    while (token = await this.lexer.getNextToken()) {
      if (token.type == 'tag') {
        if (token.close) {
          if (context.type == 'recognized_tag' && context.openTag.tagName == token.tagName) {
            const nextContext = contextStack.pop();
            context.closeTag = token;
            nextContext.children.push(context);
            context = nextContext;
          }
          else {
            context = contextStack.pop();
          }
        }
        else {
          contextStack.push(context);

          context = {
            type: 'recognized_tag',
            openTag: token,
            children: [],
          };

        }
      }
      else {
        context.children.push(token);
      }
    }

    return rootContext;
  }

}

module.exports = {
  SimpleTagParser,
};
