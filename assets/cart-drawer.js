// class CartDrawer extends HTMLElement {
//   constructor() {
//     super();

//     this.isOpen = false;
//     this.createTimeline();

//     this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
//     this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
//     this.setHeaderCartIconAccessibility();
//   }

//   setHeaderCartIconAccessibility() {
//     const cartLink = document.querySelector('#cart-icon-link');
//     if (!cartLink) return;

//     cartLink.setAttribute('role', 'button');
//     cartLink.setAttribute('aria-haspopup', 'dialog');
//     cartLink.addEventListener('click', (event) => {
//       event.preventDefault();
//       this.open(cartLink);
//     });
//     cartLink.addEventListener('keydown', (event) => {
//       if (event.code.toUpperCase() === 'SPACE') {
//         event.preventDefault();
//         this.open(cartLink);
//       }
//     });
//   }

//   createTimeline() {
//     if (this.cartTimeline) {
//       this.cartTimeline.kill();
//       this.cartTimeline = null;
//     }

//     const cartInner = this.querySelector('[data-drawer-inner]');
//     const cartBackground = this.querySelector('#CartDrawer-Overlay');

//     if (!cartInner || !cartBackground) return;

//     this.cartTimeline = gsap.timeline({
//       paused: true,
//       onStart: () => {
//         this.style.display = 'flex';
//       },
//       onReverseComplete: () => {
//         this.style.display = 'none';
//       },
//       onComplete: () => {
//         this.handleDrawerComplete();
//         this.isOpen = true;
//       },
//     });

//     this.cartTimeline
//       .from(cartInner, {
//         x: '100%',
//         duration: 0.6,
//         ease: 'expo.inOut',
//       })
//       .fromTo(
//         cartBackground,
//         {
//           opacity: 0,
//         },
//         {
//           opacity: 0.2,
//         },
//         '<'
//       );
//   }

//   open(triggeredBy) {
//     if (triggeredBy) this.setActiveElement(triggeredBy);

//     const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
//     if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) {
//       this.setSummaryAccessibility(cartDrawerNote);
//     }

//     if (this.cartTimeline) {
//       this.cartTimeline.play();
//     }

//     document.body.classList.add('overflow-hidden');
//   }

//   close() {
//     if (!this.isOpen) return;
//     this.isOpen = false;

//     this.cartTimeline.reverse();
//     removeTrapFocus(this.activeElement);
//     document.body.classList.remove('overflow-hidden');
//   }

//   handleDrawerComplete() {
//     const containerToTrapFocusOn = document.getElementById('CartDrawer');
//     const focusElement = this.querySelector('[data-drawer-inner]') || this.querySelector('[data-cart-close]');

//     trapFocus(containerToTrapFocusOn, focusElement);
//   }

//   setSummaryAccessibility(cartDrawerNote) {
//     cartDrawerNote.setAttribute('role', 'button');
//     cartDrawerNote.setAttribute('aria-expanded', 'false');

//     if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
//       cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
//     }

//     cartDrawerNote.addEventListener('click', (event) => {
//       event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
//     });

//     cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
//   }

//   setActiveElement(element) {
//     this.activeElement = element;
//   }
// }

// customElements.define('cart-drawer', CartDrawer);

// class CartDrawerItems extends CartItems {}

// customElements.define('cart-drawer-items', CartDrawerItems);
