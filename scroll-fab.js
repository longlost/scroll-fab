
/**
  * `scroll-fab`
  * 
  *   A paper-fab that enters when user scrolls down on page height or more, 
  *   and exits when page is scrolled up less than one page height.
  *
  *   Scrolls window to top on click.
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
import {listen, unlisten} from '@longlost/utils/utils.js';
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

      _scrollListenerKey: Object

    };
  }


  connectedCallback() {
    super.connectedCallback();
    
    this.__startFabAnimationControl();
  }


  disconnectedCallback() {
    super.disconnectedCallback();

    unlisten(this._scrollListenerKey);
  }


  __startFabAnimationControl() {
    let ticking  = false; // Perf.
    const height = window.innerHeight;

    const toggleFabClass = () => {
      if (ticking) { return; }

      ticking = true;

      window.requestAnimationFrame(() => {

        if (window.scrollY > height) {

          if (!this.$.fab.classList.contains('fab-entry')) {
            this.$.fab.classList.add('fab-entry');
          }
        }
        else if (this.$.fab.classList.contains('fab-entry')) {
          this.$.fab.classList.remove('fab-entry');
        }

        ticking = false;
      });
    };

    this._scrollListenerKey = listen(document, 'scroll', toggleFabClass);
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
