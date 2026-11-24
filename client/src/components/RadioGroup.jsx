// Reusable tap-friendly radio button group supporting string or { label, value } options
export function RadioGroup({ name, label, options, value, onChange, required, error, fullWidth }) {
  const wrapperClass = fullWidth ? "form-field field-full" : "form-field";

  return (
    <div className={wrapperClass}>
      <fieldset className="radio-fieldset">
        <legend className="field-label">
          {label}
          {required && (
            <span className="required-star" aria-hidden="true">
              *
            </span>
          )}
        </legend>

        <div className="radio-options">
          {options.map((option) => {
            const optionLabel = typeof option === "object" ? option.label : option;
            const optionValue = typeof option === "object" ? option.value : option;
            const isChecked = value === optionValue;

            return (
              <label key={String(optionValue)} className="radio-pill">
                <input
                  type="radio"
                  name={name}
                  value={String(optionValue)}
                  checked={isChecked}
                  onChange={onChange}
                />
                <span>{optionLabel}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}