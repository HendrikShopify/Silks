class AccordionList extends HTMLElement {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }

    connectedCallback() {
        this.addEventListener('click', this.onClick);

        this.querySelectorAll('[data-accordion-content]').forEach((panel) => {
            gsap.set(panel, { height: 0, overflow: 'hidden' });
        });

        this.querySelectorAll('[data-plus-line]').forEach((line) => {
            gsap.set(line, { width: '100%' });
        });
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.onClick);
    }

    onClick(e) {
        const trigger = e.target.closest('[data-accordion-trigger]');
        if (!trigger || !this.contains(trigger)) return;

        const item = trigger.closest('[data-accordion-item]');
        if (!item) return;

        const panel = item.querySelector('[data-accordion-content]');
        if (!panel) return;

        const plusLine = trigger.querySelector('[data-plus-line]');
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // close all
        this.querySelectorAll('[data-accordion-trigger]').forEach((btn) => {
            btn.setAttribute('aria-expanded', 'false');
        });

        this.querySelectorAll('[data-accordion-content]').forEach((p) => {
            gsap.to(p, {
                height: 0,
                duration: 0.2,
                ease: 'smooth',
            });
        });

        this.querySelectorAll('[data-plus-line]').forEach((line) => {
            gsap.to(line, {
                width: '100%',
                duration: 0.2,
                ease: 'smooth',
            });
        });

        if (!isOpen) {
            trigger.setAttribute('aria-expanded', 'true');

            gsap.to(panel, {
                height: 'auto',
                duration: 0.2,
                ease: 'smooth',
            });

            if (plusLine) {
                gsap.to(plusLine, {
                    width: 0,
                    duration: 0.2,
                    ease: 'smooth',
                });
            }
        }
    }
}

customElements.define('accordion-list', AccordionList);