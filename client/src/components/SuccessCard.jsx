// Confirmation card showing the generated BWL code and a quick reset button for registrars
export function SuccessCard({ meetingCode, onRegisterAnother }) {
  return (
    <div className="success-card" role="status">
      <h2 className="success-title">Registration successful!</h2>
      <div className="code-badge">{meetingCode}</div>
      <p className="success-note">
        Please save or screenshot your meeting code.
      </p>
      <button
        type="button"
        className="btn-primary"
        onClick={onRegisterAnother}
      >
        Register another person
      </button>
    </div>
  );
}