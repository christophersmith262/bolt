class SimpleTagLexer {

  constructor(html, tags) {
    this.tags = tags;
    this._html = html;
    this._tokens = null;
    this._tokenPointer = 0
  }

  async getNextToken() {
    if (this._tokens === null) {
      this._tokens = await this._process(this._html)
    }

    if (this._tokenPointer in this._tokens) {
      const nextToken = this._tokens[this._tokenPointer];
      ++this._tokenPointer;
      return nextToken;
    }
    else {
      return null;
    }
  }

  async _process(html) {
    const tokens = []

    let currentToken = { type: 'text', text: '' }

    while (html.length) {
      const c = html.charAt(0)
      html = html.substr(1)

      if (c == '<') {
        tokens.push(currentToken)
        currentToken = {
          type: 'tag',
          text: '',
        }
      }

      currentToken.text += c

      if (c == '>') {
        tokens.push(currentToken)
        currentToken = {
          type: 'text',
          text: '',
        }
      }
    }
    tokens.push(currentToken)

    return await this._flatten(tokens)
  }

  async _flatten(tokens) {
    const flattened = []

    let currentToken = {
      type: 'text',
      text: '',
    }

    for (var i in tokens) {
      const token = tokens[i];

      if (tokens[i].type == 'tag') {
        const matches = token.text.match(/<\s*(\/?)\s*([a-zA-Z0-9\-]+)/)

        if (matches) {
          token.close = matches[1] ? true : false;
          token.tagName = matches[2].toLowerCase();
        }

        if (this.tags.includes(token.tagName)) {
          flattened.push(currentToken)

          currentToken = {
            type: 'text',
            text: '',
          };

          flattened.push(token);
        }
        else {
          currentToken.text += token.text;
        }
      }
      else {
        currentToken.text += token.text;
      }
    }

    flattened.push(currentToken);

    return flattened;
  }

}

module.exports = {
  SimpleTagLexer,
};
