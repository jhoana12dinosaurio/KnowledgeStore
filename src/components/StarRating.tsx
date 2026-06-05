export const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="lx-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="13" height="13"
          fill={i < full ? '#F4B942' : (i === full && half ? 'url(#hg)' : '#2a3448')}>
          <defs>
            <linearGradient id="hg">
              <stop offset="50%" stopColor="#F4B942" />
              <stop offset="50%" stopColor="#2a3448" />
            </linearGradient>
          </defs>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
      <span className="lx-star-val">{rating}</span>
    </div>
  );
};
