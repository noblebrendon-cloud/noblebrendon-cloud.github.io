(function () {
  const form = document.getElementById("speaking-invite-form");
  if (!form) return;

  const result = document.getElementById("invite-result");
  const feedback = document.getElementById("invite-feedback");
  const error = document.getElementById("invite-error");
  const mailtoLink = document.getElementById("invite-mailto");
  const copyButton = document.getElementById("invite-copy");
  const copyText = document.getElementById("invite-copy-text");

  const fields = [
    ["Name", "name"],
    ["Organization", "organization"],
    ["Email", "email"],
    ["Event date or timing", "timing"],
    ["Location or virtual", "location"],
    ["Audience type", "audience"],
    ["Expected attendance", "attendance"],
    ["Requested format", "format"],
    ["Event purpose", "purpose"],
    ["Budget or honorarium range (optional)", "budget"],
    ["Message", "message"]
  ];

  function valueFor(name) {
    const field = form.elements[name];
    return field ? field.value.trim() : "";
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    result.hidden = true;
  }

  function clearError() {
    error.textContent = "";
    error.hidden = true;
  }

  function buildInquiryText() {
    const lines = ["Speaking Invitation", ""];

    fields.forEach(([label, name]) => {
      const value = valueFor(name);
      if (value) {
        lines.push(`${label}: ${value}`);
      }
    });

    return lines.join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const email = valueFor("email");
    const timing = valueFor("timing");
    const format = valueFor("format");
    const purpose = valueFor("purpose");
    const message = valueFor("message");

    if (!email || !validEmail(email)) {
      showError("Enter a valid organizer email before preparing the draft.");
      form.elements.email.focus();
      return;
    }

    if (!timing) {
      showError("Add an event date, season, or timing note before preparing the draft.");
      form.elements.timing.focus();
      return;
    }

    if (!format) {
      showError("Choose a requested format before preparing the draft.");
      form.elements.format.focus();
      return;
    }

    if (!purpose && !message) {
      showError("Add the event purpose or a message before preparing the draft.");
      form.elements.purpose.focus();
      return;
    }

    const body = buildInquiryText();
    const mailto = `mailto:noblebrendon150@gmail.com?subject=${encodeURIComponent("Speaking Invitation")}&body=${encodeURIComponent(body)}`;

    copyText.value = body;
    mailtoLink.href = mailto;
    feedback.textContent = "Email draft prepared locally. Open the draft in your mail app, or copy the inquiry text as a fallback.";
    result.hidden = false;
  });

  copyButton.addEventListener("click", async function () {
    if (!copyText.value) return;

    try {
      await navigator.clipboard.writeText(copyText.value);
      feedback.textContent = "Inquiry text copied. Paste it into your email app if the draft link does not open.";
    } catch (err) {
      copyText.hidden = false;
      copyText.focus();
      copyText.select();
      feedback.textContent = "Copy the selected inquiry text and paste it into your email app.";
    }
  });
})();
