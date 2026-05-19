class CartIcon extends HTMLElement {
  connectedCallback() {
    const link = this.querySelector('a');
    const drawer = document.querySelector('cart-drawer');
    if (!link || !drawer) return;

    link.addEventListener('click', (evt) => {
      evt.preventDefault();
      drawer.open(link);
    });
  }
}

customElements.define('cart-icon', CartIcon);


class CartItems extends HTMLElement {
  constructor() {
    super();
    this.debouncedUpdate = debounce((index, value) => {
      this.updateQuantity(index, value);
    }, 300);

    this.addEventListener('change', (event) => {
      this.debouncedUpdate(event.target.dataset.index, event.target.value);
    });
  }

  static getSectionsToRequest() {
    const sections = [];
    if (document.getElementById('cart-icon-bubble')) sections.push('cart-icon-bubble');
    if (document.getElementById('cart-drawer-inner')) sections.push('cart-drawer');
    if (document.getElementById('main-cart')) sections.push('main-cart');
    return sections;
  }

  updateQuantity(line, quantity) {
    const sections = CartItems.getSectionsToRequest();
    if (!sections.length) return;

    this.setAttribute('loading', '');
    document.dispatchEvent(new Event('loading:start'));
    this.clearError();

    fetch(routes.cart_change_url, {
      ...fetchConfig(),
      body: JSON.stringify({
        line: parseInt(line),
        quantity: parseInt(quantity),
        sections,
        sections_url: window.location.pathname
      })
    })
      .then(res => res.json())
      .then(state => {
        if (state.errors) {
          this.showError(state.errors);
          return;
        }
        CartItems.renderSections(state.sections);
      })
      .catch((err) => {
        console.error(err);
        this.showError('Something went wrong. Please try again.');
      })
      .finally(() => {
        this.removeAttribute('loading');
        document.dispatchEvent(new Event('loading:end'));
      });
  }

  showError(message) {
    const inDrawer = this.closest('cart-drawer');
    const error = document.getElementById(inDrawer ? 'cart-drawer-error' : 'cart-page-error');
    if (error) error.textContent = message;
  }

  clearError() {
    const inDrawer = this.closest('cart-drawer');
    const error = document.getElementById(inDrawer ? 'cart-drawer-error' : 'cart-page-error');
    if (error) error.textContent = '';
  }

  static renderSections(sections) {
    if (!sections) return;

    const cartIconBubble = document.getElementById('cart-icon-bubble');
    if (cartIconBubble && sections['cart-icon-bubble']) {
      cartIconBubble.innerHTML = CartItems.getSectionHTML(
        sections['cart-icon-bubble'],
        'cart-icon-bubble'
      );
    }

    const cartDrawerInner = document.getElementById('cart-drawer-inner');
    if (cartDrawerInner && sections['cart-drawer']) {
      cartDrawerInner.innerHTML = CartItems.getSectionHTML(
        sections['cart-drawer'],
        'cart-drawer-inner'
      );
    }

    const cartPage = document.getElementById('main-cart');
    if (cartPage && sections['main-cart']) {
      cartPage.innerHTML = CartItems.getSectionHTML(sections['main-cart'], 'main-cart');
    }

    const cartDrawer = document.querySelector('cart-drawer');
    if (cartDrawer?.createTimeline) cartDrawer.createTimeline();
  }

  static getSectionHTML(html, sectionId) {
    if (!html) return '';

    const sectionRoot = new DOMParser().parseFromString(html, 'text/html').getElementById(sectionId);
    return sectionRoot ? sectionRoot.innerHTML : '';
  }
}

customElements.define('cart-items', CartItems);


class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.isOpen = false;
    this.createTimeline();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());

    const overlay = document.getElementById('cart-drawer-overlay');
    if (overlay) overlay.addEventListener('click', () => this.close());
  }

  createTimeline() {
    const inner = document.getElementById('cart-drawer-inner');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!inner || !overlay) return;

    if (this.cartTimeline) this.cartTimeline.kill();

    gsap.set(inner, { clearProps: 'all' });

    this.cartTimeline = gsap.timeline({
      paused: true,
      onStart: () => {
        this.style.display = 'flex';
        this.setAttribute('aria-hidden', 'false');
      },
      onReverseComplete: () => {
        this.style.display = 'none';
        this.setAttribute('aria-hidden', 'true');
      },
      onComplete: () => {
        this.isOpen = true;
        trapFocus(this, document.getElementById('cart-drawer-inner'));
      },
    });

    this.cartTimeline
      .from(inner, { x: '100%', duration: 0.6, ease: 'expo.inOut' })
      .fromTo(overlay, { opacity: 0 }, { opacity: 0.2 }, '<');

    if (this.isOpen) this.cartTimeline.progress(1);
  }

  open(triggerElement) {
    if (!this.cartTimeline) return;

    this.triggerElement = triggerElement || document.querySelector('cart-icon a');
    this.cartTimeline.play();
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.isOpen || !this.cartTimeline) return;
    this.isOpen = false;
    this.cartTimeline.reverse();
    document.body.style.overflow = '';
    removeTrapFocus(this.triggerElement);
  }
}

customElements.define('cart-drawer', CartDrawer);


class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', () => {
      this.closest('cart-items')?.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);
