// Displays the uploaded meeting flier image, or a clean placeholder until uploaded
export function FlierSpace({ imageUrl }) {
  return (
    <section className="glass flier-box" aria-label="Meeting flier">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="BWL 2027 Meeting Flier"
          className="flier-image"
        />
      ) : (
        <div className="flier-placeholder">Meeting flier will appear here</div>
      )}
    </section>
  );
}