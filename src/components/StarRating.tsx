interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const gradientId = `halfGrad-${String(rating).replace('.', '-')}`;

  return (
    <div className="ev-star-rating" aria-label={`Valoración ${rating} de 5`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill={i < fullStars ? '#FFD700' : (i === fullStars && hasHalf ? `url(#${gradientId})` : '#3a3a3a')}
          width="14"
          height="14"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId}>
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#3a3a3a" />
            </linearGradient>
          </defs>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      <span className="ev-rating-value">{rating}</span>
    </div>
  );
}
