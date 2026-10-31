export default function FormField({ label, children, hint }) {
  return (
    <div className="pw-form-field">
      <label className="pw-field-label">{label}</label>

      {children}

      {hint && (
        <p className="pw-field-hint">{hint}</p>
      )}
    </div>
  );
}