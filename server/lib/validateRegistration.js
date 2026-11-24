// Import allowed dropdown lists to verify menu selections
import {
  titles,
  genders,
  ageRanges,
  maritalStatuses,
  churchMinistries,
  ministerialCalls,
  trulatSets
} from "./options.js";

// Patterns for validating optional email addresses and phone numbers
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_CHARS = /^[0-9+\-\s()]+$/;
const HAS_DIGIT_PATTERN = /[0-9]/;

// Validate and sanitize the raw request body into a whitelisted registrant object
export function validateRegistration(rawBody) {
  if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
    return { error: { message: "Please submit valid registration details." } };
  }

  // Validate required field: surname (trimmed, 1-60 chars)
  if (typeof rawBody.surname !== "string" || rawBody.surname.trim().length === 0) {
    return { error: { message: "Please enter your surname.", field: "surname" } };
  }
  const surname = rawBody.surname.trim();
  if (surname.length > 60) {
    return {
      error: { message: "Surname cannot be longer than 60 characters.", field: "surname" }
    };
  }

  // Validate required field: first_name (trimmed, 1-60 chars)
  if (typeof rawBody.first_name !== "string" || rawBody.first_name.trim().length === 0) {
    return { error: { message: "Please enter your first name.", field: "first_name" } };
  }
  const firstName = rawBody.first_name.trim();
  if (firstName.length > 60) {
    return {
      error: {
        message: "First name cannot be longer than 60 characters.",
        field: "first_name"
      }
    };
  }

  // Validate required field: age_range (must match allowed age brackets)
  if (typeof rawBody.age_range !== "string" || rawBody.age_range.trim().length === 0) {
    return { error: { message: "Please choose your age range.", field: "age_range" } };
  }
  const ageRange = rawBody.age_range.trim();
  if (!ageRanges.includes(ageRange)) {
    return { error: { message: "Please choose a valid age range.", field: "age_range" } };
  }

  // Helper rules for optional text fields (trim text, turn blank strings into null)
  const optionalTextRules = [
    { key: "other_names", label: "Other names", max: 60 },
    { key: "address", label: "Address", max: 300 },
    { key: "city_town", label: "City or town", max: 100 },
    { key: "lga", label: "LGA", max: 100 },
    { key: "state", label: "State", max: 100 },
    { key: "country", label: "Country", max: 100 },
    { key: "occupation", label: "Occupation", max: 100 },
    { key: "discipleship_under", label: "Discipleship leader", max: 100 },
    { key: "study_centre", label: "Study centre", max: 100 },
    { key: "other_info", label: "Other information", max: 500 }
  ];

  // Start building our clean whitelisted data object
  const cleanData = {
    surname,
    first_name: firstName,
    age_range: ageRange
  };

  // Validate and sanitize every optional text field
  for (const rule of optionalTextRules) {
    const rawValue = rawBody[rule.key];
    if (rawValue === undefined || rawValue === null) {
      cleanData[rule.key] = null;
      continue;
    }
    if (typeof rawValue !== "string") {
      return {
        error: { message: `Please enter a valid ${rule.label}.`, field: rule.key }
      };
    }
    const trimmed = rawValue.trim();
    if (trimmed.length === 0) {
      cleanData[rule.key] = null;
    } else if (trimmed.length > rule.max) {
      return {
        error: {
          message: `${rule.label} cannot be longer than ${rule.max} characters.`,
          field: rule.key
        }
      };
    } else {
      cleanData[rule.key] = trimmed;
    }
  }

  // Helper rules for optional dropdown fields
  const optionalDropdownRules = [
    { key: "title", label: "title", allowed: titles },
    { key: "gender", label: "gender", allowed: genders },
    { key: "marital_status", label: "marital status", allowed: maritalStatuses },
    { key: "church_ministry", label: "church or ministry category", allowed: churchMinistries },
    { key: "ministerial_call", label: "ministerial call", allowed: ministerialCalls },
    { key: "trulat_set", label: "TRULAT set", allowed: trulatSets }
  ];

  // Validate every optional dropdown selection against options.js
  for (const rule of optionalDropdownRules) {
    const rawValue = rawBody[rule.key];
    if (rawValue === undefined || rawValue === null) {
      cleanData[rule.key] = null;
      continue;
    }
    if (typeof rawValue !== "string") {
      return {
        error: { message: `Please choose a valid ${rule.label}.`, field: rule.key }
      };
    }
    const trimmed = rawValue.trim();
    if (trimmed.length === 0) {
      cleanData[rule.key] = null;
    } else if (!rule.allowed.includes(trimmed)) {
      return {
        error: { message: `Please choose a valid ${rule.label}.`, field: rule.key }
      };
    } else {
      cleanData[rule.key] = trimmed;
    }
  }

  // Validate optional email address
  if (rawBody.email === undefined || rawBody.email === null) {
    cleanData.email = null;
  } else if (typeof rawBody.email !== "string") {
    return { error: { message: "Please enter a valid email address.", field: "email" } };
  } else {
    const email = rawBody.email.trim();
    if (email.length === 0) {
      cleanData.email = null;
    } else if (email.length > 100 || !EMAIL_PATTERN.test(email)) {
      return {
        error: { message: "Please enter a valid email address.", field: "email" }
      };
    } else {
      cleanData.email = email;
    }
  }

  // Validate optional phone numbers (digits, spaces, +, -, parentheses, 7-25 chars)
  const phoneRules = [
    { key: "mobile_number", label: "mobile phone number" },
    { key: "other_phone", label: "alternative phone number" }
  ];

  for (const rule of phoneRules) {
    const rawValue = rawBody[rule.key];
    if (rawValue === undefined || rawValue === null) {
      cleanData[rule.key] = null;
      continue;
    }
    if (typeof rawValue !== "string") {
      return {
        error: { message: `Please enter a valid ${rule.label}.`, field: rule.key }
      };
    }
    const trimmed = rawValue.trim();
    if (trimmed.length === 0) {
      cleanData[rule.key] = null;
    } else if (
      trimmed.length < 7 ||
      trimmed.length > 25 ||
      !PHONE_ALLOWED_CHARS.test(trimmed) ||
      !HAS_DIGIT_PATTERN.test(trimmed)
    ) {
      return {
        error: { message: `Please enter a valid ${rule.label}.`, field: rule.key }
      };
    } else {
      cleanData[rule.key] = trimmed;
    }
  }

  // Validate optional boolean fields (must be true, false, or empty/null)
  const booleanRules = [
    { key: "in_discipleship", label: "discipleship status" },
    { key: "attended_last_year", label: "previous attendance" },
    { key: "is_trulat_student", label: "TRULAT student status" }
  ];

  for (const rule of booleanRules) {
    const rawValue = rawBody[rule.key];
    if (rawValue === undefined || rawValue === null || rawValue === "") {
      cleanData[rule.key] = null;
    } else if (typeof rawValue !== "boolean") {
      return {
        error: { message: `Please select Yes or No for ${rule.label}.`, field: rule.key }
      };
    } else {
      cleanData[rule.key] = rawValue;
    }
  }

  return { data: cleanData };
}