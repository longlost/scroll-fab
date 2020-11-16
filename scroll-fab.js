
/**
  * `scroll-fab`
  * 
  *   A paper-fab that enters when user scrolls down beyond one page height, 
  *   and exits when page is scrolled up less than one page height.
  *
  *   Scrolls `window` to top on click.
  *
  *
  *
  *
  *   @customElement
  *   @polymer
  *   @demo demo/index.html
  *
  *
  **/


import {AppElement, html} from '@longlost/app-element/app-element.js';
import htmlString         from './scroll-fab.html';
import '@longlost/app-icons/app-icons.js';
import '@polymer/paper-fab/paper-fab.js';


class ScrollFab extends AppElement {
  static get is() { return 'scroll-fab'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {

      // Intersection Observer instance.
      _observer: Object

    };
  }


  async connectedCallback() {
    super.connectedCallback();

    // Scroll options polyfill for Safari, supports {behavior: 'smooth'}
    // for all scroll functions (ie. window.scrollTo, element.scrollIntoVeiw).
    if (!('scrollBehavior' in document.documentElement.style)) {
      await import(
        /* webpackChunkName: 'scroll-polyfill' */ 
        'scroll-behavior-polyfill'
      );
    }

    const callback = ([entry]) => {
      
      if (entry.intersectionRatio === 1) {
        this.$.fab.classList.remove('fab-entry');
      }
      else {
        this.$.fab.classList.add('fab-entry');
      }
    };

    const options = {
      root: null, // Device viewport.

      // Grow root bounding rect up one screen height,
      // so that whenever the body scrolls 1 pixel higher than that,
      // it is no longer 100% intersecting (Body's top edge is above 
      // root's top with extra margin).
      // Grow left and right to account for scroll bars, etc.
      // Grow bottom to allow for browser chrome such as
      // Safari search bar shrink / bottom nav collapse.
      // Top, right, bottom, left.
      rootMargin: '100%', 
      threshold:   1
    };

    this._observer = new IntersectionObserver(callback, options);
    this._observer.observe(document.body);
  }


  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._observer) {      
      this._observer.unobserve(document.body); // Observer.disconnect not supported by Safari.
      this._observer = undefined;
    }
  }


  async __scrollToTopFabClicked() {
    try {
      await this.clicked();

      window.scrollTo({behavior: 'smooth', top: 0});
    }
    catch (error) {
      if (error === 'click debounced') { return; }
      console.error(error);
    }
  }  
  
}

window.customElements.define(ScrollFab.is, ScrollFab);
