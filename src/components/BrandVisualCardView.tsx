import React from 'react';
import { BrandVisualCard } from '../data/brandIdentityCards';

interface BrandVisualCardViewProps {
  card: BrandVisualCard;
  isRTL?: boolean;
  onSelect?: (card: BrandVisualCard) => void;
  className?: string;
  showOverlayUI?: boolean;
}

/**
 * Botanical Flourish SVG (delicate terracotta leaf branch)
 */
export const BotanicalFlourish: React.FC<{ className?: string }> = ({ className = 'w-16 h-3 text-[#B84E36]' }) => (
  <svg
    viewBox="0 0 100 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M10 10 C 35 7, 65 13, 90 10"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    {/* Delicate leaves */}
    <path
      d="M32 9 C 33 5, 37 4, 38 6 C 37 8, 34 9, 32 9 Z"
      fill="currentColor"
      opacity="0.85"
    />
    <path
      d="M44 11 C 45 15, 49 16, 50 14 C 49 12, 46 11, 44 11 Z"
      fill="currentColor"
      opacity="0.85"
    />
    <path
      d="M58 9 C 59 5, 63 4, 64 6 C 63 8, 60 9, 58 9 Z"
      fill="currentColor"
      opacity="0.85"
    />
    <path
      d="M70 11 C 71 15, 75 16, 76 14 C 75 12, 72 11, 70 11 Z"
      fill="currentColor"
      opacity="0.85"
    />
    <circle cx="50" cy="10" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Botanical Sprig Line-Art SVG for Corner Plaque
 */
export const BotanicalSprig: React.FC<{ className?: string }> = ({ className = 'w-5 h-9 text-[#B84E36]' }) => (
  <svg
    viewBox="0 0 24 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 40 C 12 28, 11 16, 13 2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M12 32 C 6 29, 5 22, 11 25"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M12 24 C 18 21, 19 14, 13 17"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M12 16 C 7 13, 6 7, 12 10"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M13 8 C 17 6, 18 2, 13 4"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Little Hut Moment Card (4:5 Aspect Ratio)
 * Strictly matches the Fireside Night reference visual system:
 * - LINE 1: Large dark editorial serif
 * - LINE 2: Large terracotta handwritten/script phrase
 * - LINE 3: Large dark editorial serif
 * - Below: Thin terracotta botanical flourish
 * - BOTTOM-LEFT: Organic warm-cream board with thin terracotta outline,
 *   terracotta botanical sprig on left, short dark-serif experiential sentence,
 *   and thin terracotta horizontal rule beneath.
 * - ZERO logos, URLs, phone numbers, or promotional advertising chrome.
 */
export const BrandVisualCardView: React.FC<BrandVisualCardViewProps> = ({
  card,
  isRTL = false,
  onSelect,
  className = '',
  showOverlayUI = true,
}) => {
  return (
    <div
      onClick={() => onSelect && onSelect(card)}
      className={`group relative aspect-[4/5] w-full max-w-[420px] mx-auto rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#F4EDE5] shadow-[0_12px_40px_rgba(24,19,17,0.14)] select-none transition-all duration-500 hover:shadow-[0_24px_54px_rgba(38,32,30,0.22)] hover:-translate-y-1 ${
        onSelect ? 'cursor-pointer' : ''
      } ${className}`}
      id={`moment-card-${card.number}`}
    >
      {/* 1. Underlying Cinematic Photography */}
      <img
        src={card.image}
        alt={`${card.headline1} ${card.headlineScript} ${card.headline3}`}
        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-1000 ease-out"
        loading="lazy"
        referrerPolicy="no-referrer"
      />

      {/* Subtle soft exposure wash on top for effortless typography legibility while keeping sunlight bright */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-black/25 pointer-events-none" />

      {/* 2. Top-Center Editorial Typography Overlay */}
      {showOverlayUI && (
        <div className="absolute top-7 sm:top-8 inset-x-6 sm:inset-x-8 flex flex-col items-center text-center pointer-events-none z-10">
          {isRTL ? (
            /* Arabic Typography System */
            <div dir="rtl" className="flex flex-col items-center">
              <span className="font-arabic-editorial text-2xl sm:text-3xl md:text-[34px] font-bold text-[#181311] tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] leading-tight">
                {card.headlineAr || card.headline1}
              </span>
              <span className="font-brand-script text-3xl sm:text-4xl md:text-[44px] text-[#B84E36] leading-none my-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
                {card.headlineScriptAr || card.headlineScript}
              </span>
              <span className="font-arabic-editorial text-2xl sm:text-3xl md:text-[34px] font-bold text-[#181311] tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] leading-tight">
                {card.headline3Ar || card.headline3}
              </span>
            </div>
          ) : (
            /* English Typography System */
            <div className="flex flex-col items-center">
              <span className="font-serif-editorial text-[26px] sm:text-[30px] md:text-[34px] font-bold text-[#181311] tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] leading-[1.08]">
                {card.headline1}
              </span>
              <span className="font-brand-script text-[36px] sm:text-[42px] md:text-[48px] text-[#B84E36] leading-tight my-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
                {card.headlineScript}
              </span>
              <span className="font-serif-editorial text-[26px] sm:text-[30px] md:text-[34px] font-bold text-[#181311] tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] leading-[1.08]">
                {card.headline3}
              </span>
            </div>
          )}

          {/* Thin terracotta botanical flourish below line 3 */}
          <div className="mt-2.5 sm:mt-3">
            <BotanicalFlourish className="w-16 sm:w-20 h-3 sm:h-3.5 text-[#B84E36]" />
          </div>
        </div>
      )}

      {/* 3. Mandatory Bottom-Left Organic Warm-Cream Board */}
      {showOverlayUI && (
        <div
          className={`absolute bottom-5 sm:bottom-6 z-10 pointer-events-auto ${
            isRTL ? 'right-5 sm:right-6' : 'left-5 sm:left-6'
          }`}
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 sm:px-4.5 sm:py-3.5 bg-[#FAF6F0]/95 backdrop-blur-md border border-[#B84E36]/50 shadow-[0_8px_24px_rgba(24,19,17,0.18)] ${
              isRTL
                ? 'rounded-2xl rounded-tl-[24px] text-right'
                : 'rounded-2xl rounded-tr-[24px] text-left'
            } transition-transform duration-300 group-hover:scale-[1.02]`}
            style={{
              clipPath: 'polygon(0% 0%, 94% 0%, 100% 12%, 100% 100%, 0% 100%)',
            }}
          >
            {/* Left: Terracotta Botanical Sprig Line-Art */}
            <div className="shrink-0 flex items-center justify-center">
              <BotanicalSprig className="w-4 sm:w-5 h-8 sm:h-9 text-[#B84E36]" />
            </div>

            {/* Right: Experiential Short Dark-Serif Sentence + Terracotta Horizontal Rule */}
            <div className="flex flex-col">
              <p
                className={`${
                  isRTL ? 'font-arabic-editorial text-[13px] sm:text-sm' : 'font-serif-editorial text-xs sm:text-[13px]'
                } font-bold text-[#181311] leading-snug whitespace-pre-line tracking-[-0.01em]`}
              >
                {isRTL ? (card.cornerBoardTextAr || card.cornerBoardText) : card.cornerBoardText}
              </p>
              {/* Thin terracotta rule beneath */}
              <div
                className={`w-9 sm:w-11 h-[1.25px] bg-[#B84E36]/70 mt-1.5 ${
                  isRTL ? 'self-end' : 'self-start'
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
