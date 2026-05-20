class MegaMenu extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    connectedCallback() {
        this.panel = this.querySelector('[data-mega-menu-panel]');
        this.setAttribute('aria-hidden', 'true');
        this.setPanelState(false);

        gsap.set(this, { opacity: 0 });
        if (this.panel) gsap.set(this.panel, { y: 24 });

        this.createTimeline();
        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('[data-open-menu]').forEach((trigger) => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                this.open(trigger);
            });
        });

        this.querySelectorAll('[data-close-menu]').forEach((button) => {
            button.addEventListener('click', () => this.close());
        });
    }

    setPanelState(isOpen) {
        if (!this.panel) return;
        this.panel.dataset.megaMenuOpen = isOpen ? 'true' : 'false';
    }

    createTimeline() {
        if (this.timeline) this.timeline.kill();

        this.timeline = gsap.timeline({
            paused: true,
            onStart: () => {
                this.classList.remove('hidden');
                this.setAttribute('aria-hidden', 'false');
                this.setPanelState(true);
            },
            onReverseComplete: () => {
                this.classList.add('hidden');
                this.setAttribute('aria-hidden', 'true');
                this.setPanelState(false);
                gsap.set(this, { opacity: 0, y: "0" });
                this.resetAccordions();
            },
            onComplete: () => {
                this.isOpen = true;
                const focusTarget =
                    this.querySelector('[data-close-menu]') || this.querySelector('a, button');
                trapFocus(this, focusTarget);
            },
        });

        this.timeline.to(this, {
            opacity: 1,
            y: "0",
            duration: 0.25,
            ease: 'power2.out',
        });

        if (this.panel) {
            this.timeline.to(
                this.panel,
                { y: 0, duration: 0.25, ease: 'power2.out' },
                '<0.1'
            );
        }

        if (this.isOpen) this.timeline.progress(1);
    }

    open(trigger) {
        if (this.isOpen) return;

        this.trigger = trigger;
        trigger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        this.addEventListener('keyup', this.onKeyUp);
        this.timeline.play();
    }

    close() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.trigger?.setAttribute('aria-expanded', 'false');
        this.removeEventListener('keyup', this.onKeyUp);
        this.timeline.reverse();
        document.body.style.overflow = '';
        removeTrapFocus(this.trigger);
    }

    onKeyUp(event) {
        if (event.code === 'Escape') this.close();
    }

    resetAccordions() {
        const accordion = this.querySelector('accordion-list');
        if (!accordion) return;

        accordion.querySelectorAll('[data-accordion-trigger]').forEach((trigger) => {
            trigger.setAttribute('aria-expanded', 'false');
        });

        accordion.querySelectorAll('[data-accordion-content]').forEach((panel) => {
            gsap.set(panel, { height: 0, overflow: 'hidden' });
        });
    }
}

customElements.define('mega-menu', MegaMenu);
