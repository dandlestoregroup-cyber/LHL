import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'terracotta' | 'espresso' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BrandEmblem: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = 'w-10 h-10', color = 'currentColor', size = 48 }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ stroke: color }}
    >
      {/* Arch Dome Boundary */}
      <path
        d="M20 90 V45 C20 28 34 14 50 14 C66 14 80 28 80 45 V90"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ground Line */}
      <path
        d="M14 90 H86"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Palm Tree Trunk */}
      <path
        d="M66 90 C66 75 64 60 70 42 C72 38 73 34 72 31"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Palm Fronds */}
      <path
        d="M72 31 C68 25 61 24 57 26"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 31 C73 23 79 19 84 21"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 31 C77 28 83 29 86 34"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 31 C67 32 62 36 61 41"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 31 C72 37 76 41 81 43"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Little Beach Hut Roof (Thatched gable) */}
      <path
        d="M30 64 L48 50 L64 64"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Overhanging eave */}
      <path
        d="M26 64 H68"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Hut Body */}
      <path
        d="M32 64 V88 H62 V64"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hut Door */}
      <path
        d="M42 88 V73 C42 71.5 43.5 70 45.5 70 H48.5 C50.5 70 52 71.5 52 73 V88"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hut Window */}
      <rect
        x="35"
        y="70"
        width="4.5"
        height="6"
        rx="1"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const LittleHutLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'terracotta',
  size = 'md',
  showSubtitle = true
}) => {
  const colorClass =
    variant === 'terracotta'
      ? 'text-[#B84E36]'
      : variant === 'espresso'
      ? 'text-[#2A201C]'
      : 'text-white';

  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.15em]',
    md: 'text-xl md:text-2xl tracking-[0.18em]',
    lg: 'text-3xl md:text-4xl tracking-[0.2em]',
    xl: 'text-4xl md:text-5xl tracking-[0.22em]'
  };

  const subSizes = {
    sm: 'text-[8px] tracking-[0.35em]',
    md: 'text-[9px] md:text-[10px] tracking-[0.4em]',
    lg: 'text-xs tracking-[0.45em]',
    xl: 'text-sm tracking-[0.5em]'
  };

  return (
    <div className={`flex flex-col items-center select-none ${colorClass} ${className}`}>
      <BrandEmblem className={emblemSizes[size]} />
      <span className={`font-serif-editorial font-bold uppercase mt-1 leading-none ${titleSizes[size]}`}>
        LITTLE HUT
      </span>
      {showSubtitle && (
        <span className={`font-medium uppercase mt-1 opacity-90 ${subSizes[size]}`}>
          — VACATIONS —
        </span>
      )}
    </div>
  );
};

/**
 * Botanical Leaf Sprig glyph featured directly beneath the primary headline in all 12 cards
 */
export const BotanicalSprig: React.FC<{ className?: string }> = ({ className = 'w-12 h-5 text-[#B84E36]' }) => {
  return (
    <svg
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central horizontal stem */}
      <path
        d="M20 20 C40 20 60 20 80 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Left upward leaf */}
      <path
        d="M50 20 C42 12 36 10 32 12 C30 15 36 21 44 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Left downward leaf */}
      <path
        d="M50 20 C42 28 36 30 32 28 C30 25 36 19 44 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right upward leaf */}
      <path
        d="M50 20 C58 12 64 10 68 12 C70 15 64 21 56 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right downward leaf */}
      <path
        d="M50 20 C58 28 64 30 68 28 C70 25 64 19 56 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Stem ends */}
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
      <circle cx="80" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
};

/**
 * 6-petal terracotta floral mandala glyph on the bottom-left wave badge
 */
export const MandalaFlower: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#B84E36]' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="7" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      {/* 6 Petals */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <path
          key={i}
          d="M50 43 C46 32 40 22 50 14 C60 22 54 32 50 43"
          transform={`rotate(${angle} 50 50)`}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};

/**
 * Brand Bottom Terracotta Contact Strip (01270228656 | littlehutvacations.com | littlehut.vacations)
 */
export const BrandContactBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-[#B84E36] text-white py-3 px-4 md:px-8 border-t border-[#A33E26] ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm font-medium tracking-wide">
        {/* Phone */}
        <a
          href="tel:01270228656"
          className="flex items-center gap-2 hover:text-[#FAF5EE] transition-colors"
        >
          <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z"/>
            </svg>
          </div>
          <span className="font-mono tracking-wider font-semibold">01270228656</span>
        </a>

        {/* Divider */}
        <span className="hidden md:inline-block w-px h-4 bg-white/30" />

        {/* Website */}
        <a
          href="https://littlehutvacations.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-[#FAF5EE] transition-colors"
        >
          <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
          </div>
          <span>littlehutvacations.com</span>
        </a>

        {/* Divider */}
        <span className="hidden md:inline-block w-px h-4 bg-white/30" />

        {/* Social */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center shrink-0 text-xs font-bold">
            f
          </div>
          <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
          <span>littlehut.vacations</span>
        </div>
      </div>
    </div>
  );
};
