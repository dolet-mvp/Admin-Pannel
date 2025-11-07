import '../styles/Skeleton.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-actions">
          <div className="skeleton-button"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
