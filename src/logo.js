const Logo = () => (
  <svg
    viewBox="0 0 1000 60"
    xmlns="http://www.w3.org/2000/svg"
    className="logo-svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">

        <stop offset="0%" stopColor="#77afbdff" />
        <stop offset="100%" stopColor="#71a2a3ff" />
      </linearGradient>
    </defs>

    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize="50"
      fill="none"
      stroke="url(#logoGradient)"
      strokeWidth="2"
    >
      CHIRANTH GOWDA
    </text>
  </svg>
);

export default Logo;
