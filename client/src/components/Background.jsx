// Fixed decorative layer of 3 static blurred blue circles behind the glass cards
export function Background() {
  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-circle bg-circle-1" />
      <div className="bg-circle bg-circle-2" />
      <div className="bg-circle bg-circle-3" />
    </div>
  );
}