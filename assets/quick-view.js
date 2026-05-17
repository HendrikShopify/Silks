class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const modal = document.querySelector('quick-view');
      if (modal) modal.open(button);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

class QuickView extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.createAnimation();
  }

  connectedCallback() {
    this.overlay = this.querySelector('#QuickView-Overlay');
    this.modalCloseBtn = this.querySelector('[data-quick-view-close]');
    this.modalContent = this.querySelector('[data-quick-view-inner]');

    this.addEventListeners();
  }

  addEventListeners() {
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  createAnimation() {
    if (this.animation) {
      this.animation.kill();
      this.animation = null;
    }

    const quickViewModal = this.querySelector('[data-quick-view-modal]');
    const quickViewBackground = this.querySelector('#QuickView-Overlay');

    this.animation = gsap.timeline({
      paused: true,
      onStart: () => {
        this.style.display = 'flex';
      },
      onReverseComplete: () => {
        this.style.display = 'none';
      },
      onComplete: () => {
        this.isOpen = true;
      },
    });

    this.animation
      .from(quickViewModal, {
        x: '100%',
        duration: 0.6,
        ease: 'expo.inOut',
      })
      .fromTo(
        quickViewBackground,
        {
          opacity: 0,
        },
        {
          opacity: 0.2,
        },
        '<'
      );
  }

  open(opener) {
    const productUrl = opener.getAttribute('data-product-url');
    const fetchUrl = productUrl + '?section_id=quick-view-product';

    document.dispatchEvent(new Event('loading:start'));

    fetch(fetchUrl)
      .then((response) => response.text())
      .then((responseText) => {
        const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
        const productElement = responseHTML.querySelector('product-info');

        HTMLUpdateUtility.setInnerHTML(this.modalContent, productElement.outerHTML);
      })
      .then(() => {
        if (this.isOpen) return;
        this.isOpen = true;

        this.animation.play();
        document.body.classList.add('overflow-hidden');

        document.dispatchEvent(new Event('loading:end'));

        window.initMediaSwiper();
      });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.animation.reverse();
    document.body.classList.remove('overflow-hidden');
  }
}

customElements.define('quick-view', QuickView);
