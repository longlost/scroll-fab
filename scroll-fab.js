
import {
  AppElement, 
  html
}                 from '@longlost/app-element/app-element.js';
import {listen}   from '@longlost/utils/utils.js';
import htmlString from './scroll-fab.html';
import '@longlost/app-icons/app-icons.js';


class ScrollFab extends AppElement {
  static get is() { return 'scroll-fab'; }

  static get template() {
    return html([htmlString]);
  }


  connectedCallback() {
    super.connectedCallback();
    
    this.__startFabAnimationControl();
  }


  __startFabAnimationControl() {
    let ticking  = false; // perf
    const height = window.innerHeight;

    const toggleFabClass = () => {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(async () => {
        if (window.scrollY > height) {
          if (!this.$.fab.classList.contains('fab-entry')) {
            await import('@polymer/paper-fab/paper-fab.js');
            this.$.fab.classList.add('fab-entry');
          }
        }
        else if (this.$.fab.classList.contains('fab-entry')) {
          this.$.fab.classList.remove('fab-entry');
        }
        ticking = false;
      });
    };

    listen(document, 'scroll', toggleFabClass);
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
