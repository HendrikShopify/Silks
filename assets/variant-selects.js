class VariantSelects extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('change', (event) => {
      const target = this.getInputForEventTarget(event.target);

      const customEvent = new CustomEvent('optionValueSelectionChange', {
        detail: {
          event,
          target,
          selectedOptionValues: this.selectedOptionValues,
        },
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(customEvent);
    });
  }

  getInputForEventTarget(target) {
    return target;
  }

  get selectedOptionValues() {
    return Array.from(this.querySelectorAll('fieldset input:checked')).map(({ dataset }) => dataset.optionValueId);
  }
}

customElements.define('variant-selects', VariantSelects);
