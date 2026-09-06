import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
}) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Visual Globe Icon with Parcel Orbit */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer red sphere background */}
          <circle cx="50" cy="50" r="46" fill="#C8102E" />
          
          {/* Globe latitude lines */}
          <ellipse cx="50" cy="50" rx="38" ry="18" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.45" />
          <ellipse cx="50" cy="50" rx="44" ry="34" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.45" />
          <line x1="6" y1="50" x2="94" y2="50" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.6" />
          <line x1="50" y1="4" x2="50" y2="96" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.6" />

          {/* Dynamic orbital swoosh arrow */}
          <path
            d="M 16 68 C 24 88, 70 94, 88 64 C 98 44, 76 18, 48 18"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1 0"
          />
          {/* Arrowhead */}
          <polygon points="46,12 46,24 36,18" fill="#FFFFFF" />

          {/* 3D Parcel Box riding the orbit */}
          <g transform="translate(56, 42) scale(0.95)">
            {/* Top face */}
            <polygon points="12,2 22,7 12,12 2,7" fill="#F8FAFC" />
            {/* Left face */}
            <polygon points="2,7 12,12 12,24 2,19" fill="#E2E8F0" />
            {/* Right face */}
            <polygon points="12,12 22,7 22,19 12,24" fill="#CBD5E1" />
            {/* Center sealing tape in red */}
            <polygon points="10,3 14,5 14,13 10,11" fill="#C8102E" fillOpacity="0.9" />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1">
          <span
            className={`font-display font-extrabold tracking-tight ${titleSizes[size]} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            THIAGUIL
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]"></span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] font-bold tracking-widest uppercase ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            MULTI-SERVICES
          </span>
        )}
      </div>
    </div>
  );
};
