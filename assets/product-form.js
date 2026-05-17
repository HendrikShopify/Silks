if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector('form');
        this.submitButton = this.querySelector('[type="submit"]');
        this.form.addEventListener('submit', this.onSubmit.bind(this));
      }

      connectedCallback() {
        this.variantIdInput.disabled = false;
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }

      get submitButtonText() {
        return this.submitButton?.querySelector('span');
      }

      onSubmit(evt) {
        evt.preventDefault();
        if (this.submitButton.hasAttribute('disabled')) return;

        this.setLoading(true);
        this.clearError();

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        formData.append('sections', ['cart-drawer', 'cart-icon-bubble', 'main-cart']);
        formData.append('sections_url', window.location.pathname);
        config.body = formData;

        fetch(routes.cart_add_url, config)
          .then(res => res.json())
          .then(data => {
            if (data.status) {
              this.showError(data.description);
              return;
            }
            CartItems.renderSections(data.sections);
            document.querySelector('cart-drawer').open(this.submitButton);
          })
          .catch(err => console.error(err))
          .finally(() => this.setLoading(false));
      }

      setLoading(isLoading) {
        this.submitButton.toggleAttribute('disabled', isLoading);
        document.dispatchEvent(new Event(isLoading ? 'loading:start' : 'loading:end'));
      }

      showError(message) {
        const error = this.querySelector('#product-form-error');
        if (error) error.textContent = message;
      }

      clearError() {
        const error = this.querySelector('#product-form-error');
        if (error) error.textContent = '';
      }

      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text && this.submitButtonText) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          if (this.submitButtonText && window.variantStrings?.addToCart) this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      handleErrorMessage() {
        this.clearError();
      }
    }
  );
}