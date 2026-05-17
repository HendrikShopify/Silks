const selectors = {
  customerAddresses: '[data-customer-addresses]',
  addressCountrySelect: '[data-address-country-select]',
  addressContainer: '[data-address]',
  toggleAddressButton: 'button[aria-expanded]',
  cancelAddressButton: 'button[type="reset"]',
  deleteAddressButton: 'button[data-confirm-message]',
};

const attributes = {
  expanded: 'aria-expanded',
  confirmMessage: 'data-confirm-message',
};

class CustomerAddresses {
  constructor() {
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    this._setupCountries();
    this._setupEventListeners();
  }

  _getElements() {
    const container = document.querySelector(selectors.customerAddresses);
    return container
      ? {
          container,
          addressContainer: container.querySelector(selectors.addressContainer),
          toggleButtons: document.querySelectorAll(selectors.toggleAddressButton),
          cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
          deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
          countrySelects: container.querySelectorAll(selectors.addressCountrySelect),
        }
      : {};
  }

  _setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew',
      });
      this.elements.countrySelects.forEach((select) => {
        const formId = select.dataset.formId;
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`,
        });
      });
    }
  }

  _setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener('click', this._handleAddEditButtonClick);
    });
    this.elements.cancelButtons.forEach((element) => {
      element.addEventListener('click', this._handleCancelButtonClick);
    });
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener('click', this._handleDeleteButtonClick);
    });
  }

  _toggleExpanded(target) {
    target.setAttribute(attributes.expanded, (target.getAttribute(attributes.expanded) === 'false').toString());
  }

  _handleAddEditButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(currentTarget);
  };

  _handleCancelButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(currentTarget.closest(selectors.addressContainer).querySelector(`[${attributes.expanded}]`));
  };

  _handleDeleteButtonClick = ({ currentTarget }) => {
    // eslint-disable-next-line no-alert
    if (confirm(currentTarget.getAttribute(attributes.confirmMessage))) {
      Shopify.postLink(currentTarget.dataset.target, {
        parameters: { _method: 'delete' },
      });
    }
  };
}

class AddressModal extends HTMLElement {
  connectedCallback() {
    this.openButton = this.querySelector('[data-address-open]');

    this.wrap = this.querySelector('[data-address-wrap]');
    this.modal = this.querySelector('[data-address-modal]');
    this.background = this.querySelector('.modal__background');
    this.closeButtons = this.querySelectorAll('[data-address-close]');

    this.createTimeline();

    this.openButton?.addEventListener('click', this.openModal.bind(this));
    this.closeButtons?.forEach((btn) => btn.addEventListener('click', this.closeModal.bind(this)));

    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  createTimeline() {
    this.timeline = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: 'expo.inOut' } });

    this.timeline
      .from(this.background, {
        opacity: 0,
      })
      .from(
        this.modal,
        {
          x: '100%',
        },
        '<'
      );
  }

  openModal() {
    this.wrap.classList.remove('hidden');
    this.wrap.classList.add('flex');
    this.modal.setAttribute('aria-hidden', 'false');
    this.openButton.setAttribute('aria-expanded', 'true');

    this.timeline.play(0);

    const firstInput = this.modal.querySelector('input, select, textarea');
    firstInput?.focus();
  }

  closeModal() {
    this.timeline.reverse();

    this.timeline.eventCallback('onReverseComplete', () => {
      this.wrap.classList.remove('flex');
      this.wrap.classList.add('hidden');
      this.modal.setAttribute('aria-hidden', 'true');
      this.openButton.setAttribute('aria-expanded', 'false');
      this.openButton.focus(); // Return focus to the trigger
    });
  }
}

customElements.define('address-modal', AddressModal);
