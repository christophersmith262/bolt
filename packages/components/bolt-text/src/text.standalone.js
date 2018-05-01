import {
  define,
  props,
  withComponent,
  css,
  hasNativeShadowDomSupport,
  BoltComponent,
  declarativeClickHandler,
  sanitizeBoltClasses,
} from '@bolt/core';

import styles from './text.scss';
import schema from '../text.schema.yml';

@define
class BoltText extends BoltComponent() {
  static is = 'bolt-text';

  static props = {
    tag: props.string,
    weight: props.string,
    fontStyle: props.string,
    size: props.string,
    display: props.string,
    align: props.string,
    transform: props.string,
    letterSpacing: props.string,
    lineHeight: props.string,
    quoted: props.boolean,
  }

  constructor(self) {
    self = super(self);
    this.useShadow = hasNativeShadowDomSupport;
    return self;
  }

  allowedValues(schemaData, propVal) {
    return (schemaData.enum.indexOf(propVal) > -1) ? propVal : (typeof schemaData.default != 'undefined' ? schemaData.default : false);
  }

  render({ props, state }) {

    const tag = this.props.tag ? this.props.tag : 'p';

    const weight = this.allowedValues(schema.properties.weight, this.props.weight);
    const style = this.allowedValues(schema.properties.style, this.props.fontStyle);
    const size = this.allowedValues(schema.properties.size, this.props.size);
    const display = this.allowedValues(schema.properties.display, this.props.display);
    const align = this.allowedValues(schema.properties.align, this.props.align);
    const transform = this.allowedValues(schema.properties.transform, this.props.transform);
    const letterSpacing = this.allowedValues(schema.properties.letterSpacing, this.props.letterSpacing);
    const lineHeight = this.allowedValues(schema.properties.lineHeight, this.props.lineHeight);
    const quoted = this.props.quoted ? true : false;

    // Important classes
    const classes = css(
      'c-bolt-text',
      `c-bolt-text--weight-${weight}`,
      `c-bolt-text--style-${style}`,
      `c-bolt-text--font-${size}`,
      `c-bolt-text--display-${display}`,
      letterSpacing && `c-bolt-text--spacing-${letterSpacing}`,
      align && `c-bolt-text--align-${align}`,
      transform && `c-bolt-text--transform-${transform}`,
      lineHeight && `c-bolt-text--line-height-${lineHeight}`,
      quoted && `c-bolt-text--quoted`,
    );

    return this.html`
      ${ this.addStyles([styles]) }
      <div class=${classes}>
        ${this.slot('default')}
      </div>
    `;
  }
}
