import { Component } from '@theme/component';

/**
 * Custom element to animate text inside the hero section using Typed.js.
 */
class HeroTyped extends Component {
  /** @type {any} */
  #typedInstance = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.#initTyped();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#typedInstance) {
      this.#typedInstance.destroy();
      this.#typedInstance = null;
    }
  }

  async #initTyped() {
    const hero = this.closest('.hero') || document.querySelector('.hero');
    if (!hero) return;

    const target =
      hero.querySelector('.hero__content-wrapper .text-block p') ||
      hero.querySelector('.hero__content-wrapper .text-block');

    if (!target) return;

    const initialText = target.getAttribute('data-original-text') || target.textContent.trim();
    if (!initialText) return;

    target.setAttribute('data-original-text', initialText);

    let typingSpan = target.querySelector('.hero-typed-text');
    if (!typingSpan) {
      target.textContent = '';
      typingSpan = document.createElement('span');
      typingSpan.className = 'hero-typed-text';
      target.appendChild(typingSpan);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typingSpan.textContent = initialText;
      return;
    }

    const TypedClass = await this.#getTyped();
    if (!TypedClass || !this.isConnected) {
      typingSpan.textContent = initialText;
      return;
    }

    if (this.#typedInstance) {
      this.#typedInstance.destroy();
      this.#typedInstance = null;
    }

    const strings = [
      initialText,
      'Savor every. last. bite.',
      'Testing was Completed successfully.'
    ].filter((str, idx, arr) => arr.indexOf(str) === idx);

    this.#typedInstance = new TypedClass(typingSpan, {
      strings,
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 2200,
      startDelay: 400,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });
  }

  /**
   * Resolves the window.Typed constructor.
   * @returns {Promise<any>}
   */
  #getTyped() {
    if (window.Typed) return Promise.resolve(window.Typed);
    return new Promise((resolve) => {
      let count = 0;
      const timer = setInterval(() => {
        count++;
        if (window.Typed) {
          clearInterval(timer);
          resolve(window.Typed);
        } else if (count > 60) {
          clearInterval(timer);
          resolve(null);
        }
      }, 50);
    });
  }
}

if (!customElements.get('hero-typed')) {
  customElements.define('hero-typed', HeroTyped);
}
