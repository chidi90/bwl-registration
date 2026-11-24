// Basic patterns matching our server-side email and phone rules
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_CHARS = /^[0-9+\-\s()]+$/;
const HAS_DIGIT_PATTERN = /[0-9]/;

// Validate form fields in the browser for instant, friendly feedback
export function validateForm(formData) {
  const errors = {};

  // Check the three required fields
  if (!formData.surname || !formData.surname.trim()) {
    errors.surname = "Please enter your surname.";
  }

  if (!formData.first_name || !formData.first_name.trim()) {
    errors.first_name = "Please enter your first name.";
  }

  if (!formData.age_range) {
    errors.age_range = "Please choose your age range.";
  }

  // Validate email format only if the user typed one
  if (formData.email && formData.email.trim().length > 0) {
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // Validate mobile number format only if provided
  if (formData.mobile_number && formData.mobile_number.trim().length > 0) {
    const mobile = formData.mobile_number.trim();
    if (
      mobile.length < 7 ||
      !PHONE_ALLOWED_CHARS.test(mobile) ||
      !HAS_DIGIT_PATTERN.test(mobile)
    ) {
      errors.mobile_number = "Please enter a valid mobile phone number.";
    }
  }

  // Validate alternative phone format only if provided
  if (formData.other_phone && formData.other_phone.trim().length > 0) {
    const otherPhone = formData.other_phone.trim();
    if (
      otherPhone.length < 7 ||
      !PHONE_ALLOWED_CHARS.test(otherPhone) ||
      !HAS_DIGIT_PATTERN.test(otherPhone)
    ) {
      errors.other_phone = "Please enter a valid alternative phone number.";
    }
  }

  return errors;
}