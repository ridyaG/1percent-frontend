export default function FeedMotionBackground() {
  return (
    <div className="feed-motion-bg" aria-hidden="true">
      <div className="feed-side left">
        <div className="feed-side-bloom primary" />
        <div className="feed-side-bloom secondary" />
        <div className="feed-side-lines lines-a" />
        <div className="feed-side-lines lines-b" />
      </div>

      <div className="feed-side right">
        <div className="feed-side-bloom primary" />
        <div className="feed-side-bloom secondary" />
        <div className="feed-side-lines lines-a" />
        <div className="feed-side-lines lines-b" />
      </div>
    </div>
  );
}
