/**
 * contact.js — contact form validation and submission.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById('contact-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    const validationError = validateContactForm(payload);
    if (validationError) {
      showStatus(statusEl, validationError, 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    showStatus(statusEl, '', '');

    try {
      await Api.sendContactMessage(payload);
      showStatus(statusEl, 'Message sent successfully!', 'success');
      form.reset();
    } catch (err) {
      showStatus(statusEl, err.message || 'Something went wrong. Please try again later.', 'error');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
});

function validateContactForm({ name, email, message }) {
  if (!name) return 'Please enter your name.';
  if (!isValidEmail(email)) return 'Please enter a valid email address.';
  if (!message || message.length < 10) return 'Message must be at least 10 characters long.';
  return null;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(el, message, type) {
  el.textContent = message;
  el.className = `form-status ${type}`;
}
