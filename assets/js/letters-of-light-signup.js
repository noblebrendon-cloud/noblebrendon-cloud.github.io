(function () {
  const form = document.querySelector('[data-letters-signup-form]');
  if (!form) return;

  const emailField = form.querySelector('input[name="email"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const feedback = document.querySelector('[data-signup-feedback]');
  const defaultMessage = 'Letters of Light signup is being prepared. Check back soon.';
  const rawBaseUrl = (form.getAttribute('data-api-base-url') || '').trim();

  const setFeedback = (message, mode) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove('error', 'success');
    if (mode) feedback.classList.add(mode);
  };

  const disableForm = (message) => {
    form.classList.add('is-disabled');
    if (emailField) emailField.disabled = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Signup unavailable';
    }
    setFeedback(message || defaultMessage);
  };

  const normalizeBaseUrl = (value) => {
    if (!value) return '';
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== 'https:' || parsed.search || parsed.hash) return '';
      return parsed.origin;
    } catch (err) {
      return '';
    }
  };

  const apiBaseUrl = normalizeBaseUrl(rawBaseUrl);
  if (!apiBaseUrl) {
    disableForm(defaultMessage);
    return;
  }

  const endpoint = `${apiBaseUrl}/api/letters-of-light/signup`;
  form.classList.remove('is-disabled');
  if (emailField) emailField.disabled = false;
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Request confirmation';
  }
  setFeedback('Enter your email address to request a confirmation message.');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!emailField || !submitButton) return;

    const email = emailField.value.trim();
    submitButton.disabled = true;
    setFeedback('Sending confirmation request...');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setFeedback('If the address can receive Letters of Light, a confirmation message will be sent.', 'success');
      emailField.value = '';
    } catch (err) {
      setFeedback('Signup could not be completed right now. Please try again later.', 'error');
    } finally {
      submitButton.disabled = false;
    }
  });
})();
