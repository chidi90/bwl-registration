// Public BWL 2027 registration form page
import { useState, useRef } from "react";
import {
  titles,
  genders,
  ageRanges,
  maritalStatuses,
  churchMinistries,
  ministerialCalls,
  trulatSets
} from "../lib/options.js";
import { validateForm } from "../lib/validate.js";
import { FormField } from "../components/FormField.jsx";
import { RadioGroup } from "../components/RadioGroup.jsx";
import { SuccessCard } from "../components/SuccessCard.jsx";

// Shared Yes/No options storing real booleans
const YES_NO_OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false }
];

// Clean starting values for a blank registration form
const INITIAL_FORM_DATA = {
  title: "",
  surname: "",
  first_name: "",
  other_names: "",
  gender: "",
  age_range: "",
  marital_status: "",
  occupation: "",
  address: "",
  city_town: "",
  lga: "",
  state: "",
  country: "",
  mobile_number: "",
  other_phone: "",
  email: "",
  church_ministry: "",
  ministerial_call: "",
  in_discipleship: null,
  discipleship_under: "",
  study_centre: "",
  attended_last_year: null,
  is_trulat_student: null,
  trulat_set: "",
  other_info: ""
};

// Names of fields that store real booleans instead of text
const BOOLEAN_FIELDS = [
  "in_discipleship",
  "attended_last_year",
  "is_trulat_student"
];

export function Register() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [submittedCode, setSubmittedCode] = useState("");
  const formRef = useRef(null);

  // Single change handler for every text box, dropdown, textarea, and radio button
  function handleChange(event) {
    const { name, value } = event.target;

    // Convert "true"/"false" strings from Yes/No radios into real booleans
    let nextValue = value;
    if (BOOLEAN_FIELDS.includes(name)) {
      nextValue = value === "true";
    }

    setFormData(function updateFormData(prevData) {
      const updated = {
        ...prevData,
        [name]: nextValue
      };

      // Clear dependent discipleship fields if user switches back to No
      if (name === "in_discipleship" && nextValue === false) {
        updated.discipleship_under = "";
        updated.study_centre = "";
      }

      // Clear dependent TRULAT set if user switches back to No
      if (name === "is_trulat_student" && nextValue === false) {
        updated.trulat_set = "";
      }

      return updated;
    });

    // Clear that field's error message as soon as the user edits it
    if (errors[name]) {
      setErrors(function clearFieldError(prevErrors) {
        const nextErrors = { ...prevErrors };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  }

  // Validate inputs, scroll to the first error if invalid, or show placeholder success
  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll smoothly to the first invalid field or summary banner
      if (formRef.current) {
        const firstErrorEl = formRef.current.querySelector(".input-error, .error-summary");
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    // TODO Unit 7: replace with real server call
    console.log("Valid registration payload ready for Unit 7:", formData);
    setSubmittedCode("BWL-0001");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Reset everything to a fresh blank form for the next registrant
  function handleReset() {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmittedCode("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Show the confirmation card once registration succeeds
  if (submittedCode) {
    return (
      <SuccessCard
        meetingCode={submittedCode}
        onRegisterAnother={handleReset}
      />
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <p className="form-note">
        Fields marked with <span className="required-star">*</span> are required.
      </p>

      {hasErrors && (
        <div className="error-summary" role="alert">
          Please fix the highlighted fields
        </div>
      )}

      {/* SECTION 1: PERSONAL DETAILS */}
      <section className="form-section" aria-labelledby="heading-personal">
        <h2 id="heading-personal" className="section-heading">
          Personal Details
        </h2>

        <div className="field-grid">
          <FormField label="Title" htmlFor="title" error={errors.title}>
            <select
              id="title"
              name="title"
              className="select-input"
              value={formData.title}
              onChange={handleChange}
            >
              <option value="">-- Select Title --</option>
              {titles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Surname"
            htmlFor="surname"
            required
            error={errors.surname}
          >
            <input
              id="surname"
              name="surname"
              type="text"
              maxLength={60}
              className={errors.surname ? "text-input input-error" : "text-input"}
              value={formData.surname}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            label="First Name"
            htmlFor="first_name"
            required
            error={errors.first_name}
          >
            <input
              id="first_name"
              name="first_name"
              type="text"
              maxLength={60}
              className={errors.first_name ? "text-input input-error" : "text-input"}
              value={formData.first_name}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            label="Other Names"
            htmlFor="other_names"
            error={errors.other_names}
          >
            <input
              id="other_names"
              name="other_names"
              type="text"
              maxLength={60}
              className="text-input"
              value={formData.other_names}
              onChange={handleChange}
            />
          </FormField>

          <RadioGroup
            name="gender"
            label="Gender"
            options={genders}
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
          />

          <FormField
            label="Marital Status"
            htmlFor="marital_status"
            error={errors.marital_status}
          >
            <select
              id="marital_status"
              name="marital_status"
              className="select-input"
              value={formData.marital_status}
              onChange={handleChange}
            >
              <option value="">-- Select Marital Status --</option>
              {maritalStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>

          <RadioGroup
            name="age_range"
            label="Age Range"
            options={ageRanges}
            value={formData.age_range}
            onChange={handleChange}
            required
            fullWidth
            error={errors.age_range}
          />

          <FormField
            label="Occupation"
            htmlFor="occupation"
            fullWidth
            error={errors.occupation}
          >
            <input
              id="occupation"
              name="occupation"
              type="text"
              maxLength={100}
              className="text-input"
              value={formData.occupation}
              onChange={handleChange}
            />
          </FormField>
        </div>
      </section>

      {/* SECTION 2: CONTACT DETAILS */}
      <section className="form-section" aria-labelledby="heading-contact">
        <h2 id="heading-contact" className="section-heading">
          Contact Details
        </h2>

        <div className="field-grid">
          <FormField
            label="Present Residential Address"
            htmlFor="address"
            fullWidth
            error={errors.address}
          >
            <textarea
              id="address"
              name="address"
              maxLength={300}
              className="textarea-input"
              value={formData.address}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="City / Town Of Residence" htmlFor="city_town" error={errors.city_town}>
            <input
              id="city_town"
              name="city_town"
              type="text"
              maxLength={100}
              className="text-input"
              value={formData.city_town}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="LGA Of Residence" htmlFor="lga" error={errors.lga}>
            <input
              id="lga"
              name="lga"
              type="text"
              maxLength={100}
              className="text-input"
              value={formData.lga}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="State Of Residence" htmlFor="state" error={errors.state}>
            <input
              id="state"
              name="state"
              type="text"
              maxLength={100}
              className="text-input"
              value={formData.state}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Country" htmlFor="country" error={errors.country}>
            <input
              id="country"
              name="country"
              type="text"
              maxLength={100}
              className="text-input"
              value={formData.country}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            label="Mobile Number"
            htmlFor="mobile_number"
            error={errors.mobile_number}
          >
            <input
              id="mobile_number"
              name="mobile_number"
              type="tel"
              maxLength={25}
              className={
                errors.mobile_number ? "text-input input-error" : "text-input"
              }
              value={formData.mobile_number}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            label="Any Other Phone Number"
            htmlFor="other_phone"
            error={errors.other_phone}
          >
            <input
              id="other_phone"
              name="other_phone"
              type="tel"
              maxLength={25}
              className={
                errors.other_phone ? "text-input input-error" : "text-input"
              }
              value={formData.other_phone}
              onChange={handleChange}
            />
          </FormField>

          <FormField
            label="Email"
            htmlFor="email"
            fullWidth
            error={errors.email}
          >
            <input
              id="email"
              name="email"
              type="email"
              maxLength={100}
              className={errors.email ? "text-input input-error" : "text-input"}
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>
        </div>
      </section>

      {/* SECTION 3: CHURCH & DISCIPLESHIP */}
      <section className="form-section" aria-labelledby="heading-church">
        <h2 id="heading-church" className="section-heading">
          Church &amp; Discipleship
        </h2>

        <div className="field-grid">
          <FormField
            label="Church / Ministry"
            htmlFor="church_ministry"
            error={errors.church_ministry}
          >
            <select
              id="church_ministry"
              name="church_ministry"
              className="select-input"
              value={formData.church_ministry}
              onChange={handleChange}
            >
              <option value="">-- Select Church / Ministry --</option>
              {churchMinistries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Ministerial Call"
            htmlFor="ministerial_call"
            error={errors.ministerial_call}
          >
            <select
              id="ministerial_call"
              name="ministerial_call"
              className="select-input"
              value={formData.ministerial_call}
              onChange={handleChange}
            >
              <option value="">-- Select Ministerial Call --</option>
              {ministerialCalls.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>

          <RadioGroup
            name="in_discipleship"
            label="Are you in Discipleship Relationship?"
            options={YES_NO_OPTIONS}
            value={formData.in_discipleship}
            onChange={handleChange}
            fullWidth
          />

          {formData.in_discipleship === true && (
            <div className="field-full conditional-group">
              <div className="field-grid">
                <FormField
                  label="If yes, under whose hand?"
                  htmlFor="discipleship_under"
                >
                  <input
                    id="discipleship_under"
                    name="discipleship_under"
                    type="text"
                    maxLength={100}
                    className="text-input"
                    value={formData.discipleship_under}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField
                  label="Discipleship Study Centre"
                  htmlFor="study_centre"
                >
                  <input
                    id="study_centre"
                    name="study_centre"
                    type="text"
                    maxLength={100}
                    className="text-input"
                    value={formData.study_centre}
                    onChange={handleChange}
                  />
                </FormField>
              </div>
            </div>
          )}

          <RadioGroup
            name="attended_last_year"
            label="Did you attend this meeting last year?"
            options={YES_NO_OPTIONS}
            value={formData.attended_last_year}
            onChange={handleChange}
            fullWidth
          />

          <RadioGroup
            name="is_trulat_student"
            label="Are you currently a Trulat student?"
            options={YES_NO_OPTIONS}
            value={formData.is_trulat_student}
            onChange={handleChange}
            fullWidth
          />

          {formData.is_trulat_student === true && (
            <div className="field-full conditional-group">
              <RadioGroup
                name="trulat_set"
                label="If yes, which set?"
                options={trulatSets}
                value={formData.trulat_set}
                onChange={handleChange}
              />
            </div>
          )}

          <FormField
            label="Any other information you may want us to have?"
            htmlFor="other_info"
            fullWidth
          >
            <textarea
              id="other_info"
              name="other_info"
              maxLength={500}
              className="textarea-input"
              value={formData.other_info}
              onChange={handleChange}
            />
          </FormField>
        </div>
      </section>

      <button type="submit" className="btn-primary">
        Register
      </button>
    </form>
  );
}