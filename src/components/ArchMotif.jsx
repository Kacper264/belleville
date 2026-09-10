// Prosty motyw graficzny nawiązujący do gotyckich okien kościoła Sainte-Ségolène.
// To jedyny powtarzający się element dekoracyjny na stronie — celowo używany oszczędnie.
export default function ArchMotif({ className = '', count = 5 }) {
  const width = 60;
  const height = 92;
  const total = width * count;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${total} ${height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = i * width;
        return (
          <path
            key={i}
            d={`M ${x + 6} ${height} V 40 Q ${x + 6} 8 ${x + 30} 8 Q ${x + 54} 8 ${x + 54} 40 V ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        );
      })}
    </svg>
  );
}
