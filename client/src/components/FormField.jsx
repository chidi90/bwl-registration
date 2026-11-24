// Reusable field wrapper providing label, optional red asterisk, input slot, and error text
export function FormField({ label, htmlFor, required, error, fullWidth, children }) {
  const wrapperClass = fullWidth ? "form-field field-full" : "form-field";

  return (
    <div className={wrapperClass}>
      <label className="field-label" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="required-star" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}