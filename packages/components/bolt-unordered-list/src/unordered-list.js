import { define } from '@bolt/core/utils';
import classNames from 'classnames/bind';
import { withLitHtml, html } from '@bolt/core/renderers/renderer-lit-html';

import styles from './unordered-list.scss';

let cx = classNames.bind(styles);

@define
class BoltUnorderedList extends withLitHtml() {
  static is = 'bolt-unordered-list';

  render() {
    const classes = cx('c-bolt-unordered-list');

    return html`
      ${this.addStyles([styles])}
      <ul class="${classes}">
        ${this.slot('default')}
      </ul>
    `;
  }
}

export { BoltUnorderedList };