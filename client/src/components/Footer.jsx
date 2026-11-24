// Quiet page footer with church name and subtle Registrar Access link
export function Footer() {
  // Prevent page jump while Registrar Access is still a placeholder
  function handlePlaceholderClick(event) {
    event.preventDefault();
  }

  return (
    <footer className="site-footer">
      <span>&copy; 2027 Jesus Our Possession Intl</span>
      <a
        href="#registrar"
        className="registrar-link"
        onClick={handlePlaceholderClick}
      >
        Registrar Access
      </a>
    </footer>
  );
}