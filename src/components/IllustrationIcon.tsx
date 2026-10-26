import React from 'react';

interface IllustrationProps {
  name: string;
  className?: string;
  size?: number | string;
}

export const IllustrationIcon: React.FC<IllustrationProps> = ({ name, className = '', size = 80 }) => {
  const s = typeof size === 'number' ? `${size}px` : size;

  switch (name.toLowerCase()) {
    // UNIT 1: SCHOOL SUPPLIES
    case 'paper':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="25" y="15" width="50" height="70" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
          <path d="M55 15 L75 35 L55 35 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          <line x1="33" y1="42" x2="67" y2="42" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="33" y1="52" x2="67" y2="52" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="33" y1="62" x2="60" y2="62" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="33" y1="72" x2="52" y2="72" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'glue':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="35" y="40" width="30" height="48" rx="6" fill="#3B82F6" />
          <rect x="40" y="25" width="20" height="15" rx="3" fill="#F97316" />
          <polygon points="44,25 50,12 56,25" fill="#EF4444" />
          <rect x="38" y="52" width="24" height="20" rx="3" fill="#FFFFFF" opacity="0.9" />
          <text x="50" y="66" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1D4ED8">GLUE</text>
        </svg>
      );

    case 'scissors':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Blade 1 */}
          <path d="M30 65 L68 22" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />
          {/* Blade 2 */}
          <path d="M70 65 L32 22" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
          {/* Central bolt */}
          <circle cx="50" cy="44" r="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          {/* Handles */}
          <circle cx="28" cy="72" r="14" fill="none" stroke="#EC4899" strokeWidth="6" />
          <circle cx="72" cy="72" r="14" fill="none" stroke="#EC4899" strokeWidth="6" />
        </svg>
      );

    case 'paint':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Paint jar */}
          <path d="M32 40 C32 35, 68 35, 68 40 L72 78 C72 84, 28 84, 28 78 Z" fill="#0EA5E9" />
          <rect x="36" y="28" width="28" height="12" rx="4" fill="#0284C7" />
          {/* Cap lid */}
          <rect x="40" y="20" width="20" height="8" rx="2" fill="#1E293B" />
          {/* Label */}
          <rect x="36" y="52" width="28" height="18" rx="3" fill="#FFFFFF" opacity="0.9" />
          <circle cx="50" cy="61" r="5" fill="#E11D48" />
        </svg>
      );

    case 'pencil':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <g transform="rotate(-35 50 50)">
            <rect x="44" y="20" width="12" height="52" fill="#FBBF24" />
            <polygon points="44,20 50,8 56,20" fill="#FED7AA" />
            <polygon points="48,12 50,8 52,12" fill="#1E293B" />
            <rect x="44" y="68" width="12" height="6" fill="#94A3B8" />
            <rect x="44" y="74" width="12" height="10" rx="3" fill="#F43F5E" />
          </g>
        </svg>
      );

    case 'pen':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <g transform="rotate(-35 50 50)">
            <rect x="44" y="24" width="12" height="48" rx="2" fill="#8B5CF6" />
            <polygon points="44,24 50,10 56,24" fill="#CBD5E1" />
            <polygon points="48,14 50,10 52,14" fill="#1E293B" />
            <rect x="42" y="32" width="4" height="22" rx="1.5" fill="#C4B5FD" />
            <rect x="44" y="70" width="12" height="8" rx="2" fill="#6D28D9" />
          </g>
        </svg>
      );

    case 'crayon':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <g transform="rotate(-35 50 50)">
            <rect x="43" y="24" width="14" height="52" rx="2" fill="#3B82F6" />
            <polygon points="43,24 50,10 57,24" fill="#60A5FA" />
            <rect x="43" y="36" width="14" height="28" fill="#1E3A8A" />
            <circle cx="50" cy="50" r="4" fill="#F59E0B" />
          </g>
        </svg>
      );

    case 'marker':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <g transform="rotate(-35 50 50)">
            <rect x="42" y="28" width="16" height="50" rx="4" fill="#EF4444" />
            <polygon points="45,28 50,14 55,28" fill="#DC2626" />
            <rect x="41" y="44" width="18" height="12" fill="#FFFFFF" opacity="0.85" />
            <rect x="42" y="74" width="16" height="8" rx="3" fill="#991B1B" />
          </g>
        </svg>
      );

    // UNIT 2: TOYS & VEHICLES
    case 'balloon':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <ellipse cx="50" cy="42" rx="28" ry="34" fill="#EF4444" />
          <ellipse cx="40" cy="30" rx="8" ry="14" fill="#FCA5A5" opacity="0.6" />
          <polygon points="46,75 54,75 50,79" fill="#DC2626" />
          <path d="M50 79 Q45 86 52 93 Q50 96 48 99" stroke="#64748B" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'ball':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="50" r="36" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
          <path d="M26 26 Q50 50 74 26" stroke="#FBBF24" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M26 74 Q50 50 74 74" stroke="#10B981" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="40" cy="35" rx="8" ry="5" fill="#FFFFFF" opacity="0.3" />
        </svg>
      );

    case 'doll':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Hair */}
          <circle cx="50" cy="32" r="18" fill="#F59E0B" />
          {/* Head */}
          <circle cx="50" cy="34" r="14" fill="#FFEDD5" />
          {/* Eyes & Smile */}
          <circle cx="45" cy="32" r="2" fill="#1E293B" />
          <circle cx="55" cy="32" r="2" fill="#1E293B" />
          <path d="M47 38 Q50 42 53 38" stroke="#EF4444" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="42" cy="36" r="2.5" fill="#FDA4AF" />
          <circle cx="58" cy="36" r="2.5" fill="#FDA4AF" />
          {/* Dress */}
          <polygon points="50,48 26,82 74,82" fill="#EC4899" />
          <circle cx="50" cy="58" r="3" fill="#FFFFFF" />
          <circle cx="50" cy="68" r="3" fill="#FFFFFF" />
          {/* Feet */}
          <rect x="40" y="82" width="6" height="8" rx="2" fill="#3B82F6" />
          <rect x="54" y="82" width="6" height="8" rx="2" fill="#3B82F6" />
        </svg>
      );

    case 'yo-yo':
    case 'yoyo':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* String */}
          <path d="M50 10 L50 45" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="2 2" />
          <circle cx="50" cy="10" r="3" fill="#475569" />
          {/* Yoyo body */}
          <circle cx="50" cy="60" r="28" fill="#10B981" stroke="#047857" strokeWidth="2" />
          <circle cx="50" cy="60" r="18" fill="#34D399" />
          <circle cx="50" cy="60" r="8" fill="#FBBF24" />
          <path d="M38 52 Q50 44 62 52" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
        </svg>
      );

    case 'train':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Engine Body */}
          <rect x="18" y="44" width="60" height="30" rx="4" fill="#EF4444" />
          <rect x="52" y="30" width="26" height="44" rx="3" fill="#3B82F6" />
          <rect x="58" y="36" width="14" height="12" rx="2" fill="#BAE6FD" />
          {/* Chimney */}
          <rect x="28" y="28" width="10" height="16" fill="#F59E0B" />
          <circle cx="33" cy="22" r="5" fill="#E2E8F0" opacity="0.8" />
          <circle cx="36" cy="14" r="7" fill="#E2E8F0" opacity="0.5" />
          {/* Wheels */}
          <circle cx="30" cy="76" r="9" fill="#1E293B" stroke="#CBD5E1" strokeWidth="3" />
          <circle cx="50" cy="76" r="9" fill="#1E293B" stroke="#CBD5E1" strokeWidth="3" />
          <circle cx="70" cy="76" r="9" fill="#1E293B" stroke="#CBD5E1" strokeWidth="3" />
        </svg>
      );

    case 'boat':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Hull */}
          <polygon points="18,65 30,84 70,84 82,65" fill="#0284C7" />
          <rect x="18" y="65" width="64" height="5" fill="#38BDF8" />
          {/* Mast */}
          <rect x="48" y="24" width="4" height="42" fill="#78350F" />
          {/* Sail 1 */}
          <polygon points="52,26 80,58 52,58" fill="#F87171" />
          {/* Sail 2 */}
          <polygon points="48,32 24,58 48,58" fill="#FBBF24" />
          {/* Wave */}
          <path d="M10 88 Q25 82 40 88 Q55 94 70 88 Q85 82 95 88" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'jet':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <g transform="translate(10, 10)">
            {/* Jet Body */}
            <path d="M68 40 C68 40 40 32 18 36 L12 24 L22 38 L10 40 L6 36 L4 44 L10 44 L22 46 L12 60 L18 48 C40 52 68 44 68 44 Z" fill="#60A5FA" stroke="#2563EB" strokeWidth="2" />
            <polygon points="56,38 72,40 56,42" fill="#DC2626" />
            <circle cx="50" cy="40" r="3.5" fill="#FEF08A" />
            <circle cx="40" cy="40" r="3" fill="#FEF08A" />
          </g>
        </svg>
      );

    case 'car':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Car body */}
          <path d="M15 62 L24 45 C27 40 32 38 40 38 L60 38 C68 38 73 40 76 45 L85 62 L85 70 L15 70 Z" fill="#3B82F6" />
          {/* Windows */}
          <path d="M38 43 L29 55 L47 55 L47 43 Z" fill="#BAE6FD" />
          <path d="M53 43 L53 55 L71 55 L63 43 Z" fill="#BAE6FD" />
          {/* Lights */}
          <circle cx="82" cy="62" r="3" fill="#FEF08A" />
          <circle cx="18" cy="62" r="3" fill="#EF4444" />
          {/* Wheels */}
          <circle cx="32" cy="72" r="9" fill="#1E293B" stroke="#94A3B8" strokeWidth="3" />
          <circle cx="68" cy="72" r="9" fill="#1E293B" stroke="#94A3B8" strokeWidth="3" />
        </svg>
      );

    // UNIT 3: COLORS (Splash & Swatch)
    case 'red':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 18 C65 15 82 25 80 44 C78 60 85 72 70 82 C55 90 40 82 28 80 C15 78 12 58 20 42 C28 25 35 22 50 18 Z" fill="#EF4444" />
          <circle cx="68" cy="22" r="4" fill="#EF4444" />
          <circle cx="84" cy="58" r="5" fill="#EF4444" />
          <circle cx="18" cy="74" r="4" fill="#EF4444" />
          <ellipse cx="42" cy="38" rx="8" ry="4" fill="#FCA5A5" opacity="0.6" />
        </svg>
      );

    case 'blue':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 18 C65 15 82 25 80 44 C78 60 85 72 70 82 C55 90 40 82 28 80 C15 78 12 58 20 42 C28 25 35 22 50 18 Z" fill="#3B82F6" />
          <circle cx="70" cy="20" r="4" fill="#3B82F6" />
          <circle cx="85" cy="55" r="5" fill="#3B82F6" />
          <circle cx="16" cy="72" r="4" fill="#3B82F6" />
          <ellipse cx="42" cy="38" rx="8" ry="4" fill="#93C5FD" opacity="0.6" />
        </svg>
      );

    case 'yellow':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 18 C65 15 82 25 80 44 C78 60 85 72 70 82 C55 90 40 82 28 80 C15 78 12 58 20 42 C28 25 35 22 50 18 Z" fill="#EAB308" />
          <circle cx="68" cy="20" r="4" fill="#EAB308" />
          <circle cx="82" cy="55" r="5" fill="#EAB308" />
          <circle cx="18" cy="74" r="4" fill="#EAB308" />
          <ellipse cx="42" cy="38" rx="8" ry="4" fill="#FEF08A" opacity="0.7" />
        </svg>
      );

    case 'green':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 18 C65 15 82 25 80 44 C78 60 85 72 70 82 C55 90 40 82 28 80 C15 78 12 58 20 42 C28 25 35 22 50 18 Z" fill="#22C55E" />
          <circle cx="70" cy="22" r="4" fill="#22C55E" />
          <circle cx="84" cy="58" r="5" fill="#22C55E" />
          <circle cx="16" cy="72" r="4" fill="#22C55E" />
          <ellipse cx="42" cy="38" rx="8" ry="4" fill="#86EFAC" opacity="0.6" />
        </svg>
      );

    case 'orange':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 18 C65 15 82 25 80 44 C78 60 85 72 70 82 C55 90 40 82 28 80 C15 78 12 58 20 42 C28 25 35 22 50 18 Z" fill="#F97316" />
          <circle cx="68" cy="20" r="4" fill="#F97316" />
          <circle cx="85" cy="56" r="5" fill="#F97316" />
          <circle cx="18" cy="74" r="4" fill="#F97316" />
          <ellipse cx="42" cy="38" rx="8" ry="4" fill="#FED7AA" opacity="0.6" />
        </svg>
      );

    case 'purple':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 18 C65 15 82 25 80 44 C78 60 85 72 70 82 C55 90 40 82 28 80 C15 78 12 58 20 42 C28 25 35 22 50 18 Z" fill="#A855F7" />
          <circle cx="70" cy="22" r="4" fill="#A855F7" />
          <circle cx="84" cy="58" r="5" fill="#A855F7" />
          <circle cx="16" cy="72" r="4" fill="#A855F7" />
          <ellipse cx="42" cy="38" rx="8" ry="4" fill="#E9D5FF" opacity="0.6" />
        </svg>
      );

    case 'pink':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 18 C65 15 82 25 80 44 C78 60 85 72 70 82 C55 90 40 82 28 80 C15 78 12 58 20 42 C28 25 35 22 50 18 Z" fill="#EC4899" />
          <circle cx="68" cy="20" r="4" fill="#EC4899" />
          <circle cx="84" cy="58" r="5" fill="#EC4899" />
          <circle cx="18" cy="74" r="4" fill="#EC4899" />
          <ellipse cx="42" cy="38" rx="8" ry="4" fill="#FBCFE8" opacity="0.6" />
        </svg>
      );

    case 'brown':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 18 C65 15 82 25 80 44 C78 60 85 72 70 82 C55 90 40 82 28 80 C15 78 12 58 20 42 C28 25 35 22 50 18 Z" fill="#854D0E" />
          <circle cx="70" cy="22" r="4" fill="#854D0E" />
          <circle cx="84" cy="58" r="5" fill="#854D0E" />
          <circle cx="16" cy="72" r="4" fill="#854D0E" />
          <ellipse cx="42" cy="38" rx="8" ry="4" fill="#CA8A04" opacity="0.4" />
        </svg>
      );

    // PHONICS VOCABULARY (A - J)
    case 'apple':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 32 C40 20 20 25 20 48 C20 72 38 88 50 88 C62 88 80 72 80 48 C80 25 60 20 50 32 Z" fill="#EF4444" />
          <path d="M50 30 C50 18 55 12 60 8" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <path d="M54 18 C62 14 70 18 70 18 C70 18 68 26 58 24 Z" fill="#22C55E" />
          <ellipse cx="36" cy="44" rx="6" ry="12" fill="#FCA5A5" opacity="0.5" />
        </svg>
      );

    case 'baby':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <circle cx="50" cy="45" r="26" fill="#FED7AA" />
          {/* Hair curl */}
          <path d="M46 22 Q50 14 54 22" stroke="#9A3412" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="41" cy="42" r="3" fill="#1E293B" />
          <circle cx="59" cy="42" r="3" fill="#1E293B" />
          {/* Cheeks */}
          <circle cx="35" cy="50" r="4" fill="#FDA4AF" />
          <circle cx="65" cy="50" r="4" fill="#FDA4AF" />
          {/* Pacifier / Smile */}
          <circle cx="50" cy="56" r="6" fill="#38BDF8" />
          <circle cx="50" cy="56" r="3" fill="#FFFFFF" />
          {/* Bib */}
          <path d="M34 68 C34 78 66 78 66 68 Z" fill="#F472B6" />
        </svg>
      );

    case 'cat':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Head & Ears */}
          <polygon points="26,38 32,18 48,32" fill="#F97316" />
          <polygon points="74,38 68,18 52,32" fill="#F97316" />
          <polygon points="30,36 34,22 44,32" fill="#FED7AA" />
          <polygon points="70,36 66,22 56,32" fill="#FED7AA" />
          <circle cx="50" cy="52" r="26" fill="#FB923C" />
          {/* Eyes */}
          <ellipse cx="40" cy="48" rx="3.5" ry="5" fill="#1E293B" />
          <ellipse cx="60" cy="48" rx="3.5" ry="5" fill="#1E293B" />
          {/* Nose & Mouth */}
          <polygon points="48,56 52,56 50,59" fill="#BE185D" />
          <path d="M46 62 Q50 66 54 62" stroke="#7C2D12" strokeWidth="2" fill="none" />
          {/* Whiskers */}
          <line x1="22" y1="52" x2="36" y2="54" stroke="#7C2D12" strokeWidth="2" />
          <line x1="22" y1="60" x2="36" y2="58" stroke="#7C2D12" strokeWidth="2" />
          <line x1="78" y1="52" x2="64" y2="54" stroke="#7C2D12" strokeWidth="2" />
          <line x1="78" y1="60" x2="64" y2="58" stroke="#7C2D12" strokeWidth="2" />
        </svg>
      );

    case 'dog':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Ears */}
          <ellipse cx="26" cy="46" rx="8" ry="18" fill="#78350F" transform="rotate(-15 26 46)" />
          <ellipse cx="74" cy="46" rx="8" ry="18" fill="#78350F" transform="rotate(15 74 46)" />
          {/* Head */}
          <circle cx="50" cy="50" r="26" fill="#D97706" />
          {/* Muzzle */}
          <ellipse cx="50" cy="58" rx="14" ry="10" fill="#FEF3C7" />
          {/* Eyes */}
          <circle cx="40" cy="46" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="46" r="3.5" fill="#1E293B" />
          {/* Nose & Tongue */}
          <ellipse cx="50" cy="56" rx="5" ry="4" fill="#1E293B" />
          <path d="M50 60 L50 65" stroke="#1E293B" strokeWidth="2" />
          <path d="M47 65 Q50 72 53 65 Z" fill="#F43F5E" />
        </svg>
      );

    case 'egg':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <path d="M50 16 C30 16 22 42 22 62 C22 80 34 88 50 88 C66 88 78 80 78 62 C78 42 70 16 50 16 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
          <ellipse cx="42" cy="40" rx="8" ry="16" fill="#FFFFFF" opacity="0.6" />
        </svg>
      );

    case 'friend':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Kid 1 */}
          <circle cx="36" cy="38" r="14" fill="#FED7AA" />
          <path d="M26 32 Q36 22 46 32" stroke="#9A3412" strokeWidth="6" fill="none" />
          <path d="M22 60 C22 52 36 50 36 50 C36 50 50 52 50 60 L48 85 L24 85 Z" fill="#3B82F6" />
          {/* Kid 2 */}
          <circle cx="64" cy="38" r="14" fill="#FBCFE8" />
          <circle cx="64" cy="34" r="16" fill="#F59E0B" opacity="0.4" />
          <path d="M50 60 C50 52 64 50 64 50 C64 50 78 52 78 60 L76 85 L52 85 Z" fill="#EC4899" />
          {/* High five / Heart */}
          <circle cx="50" cy="44" r="5" fill="#EF4444" />
        </svg>
      );

    case 'girl':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Pigtails */}
          <circle cx="26" cy="40" r="10" fill="#92400E" />
          <circle cx="74" cy="40" r="10" fill="#92400E" />
          <circle cx="28" cy="45" r="4" fill="#EC4899" />
          <circle cx="72" cy="45" r="4" fill="#EC4899" />
          {/* Face */}
          <circle cx="50" cy="46" r="22" fill="#FED7AA" />
          {/* Hair bang */}
          <path d="M30 38 Q50 24 70 38 Z" fill="#92400E" />
          {/* Eyes & Smile */}
          <circle cx="43" cy="46" r="2.5" fill="#1E293B" />
          <circle cx="57" cy="46" r="2.5" fill="#1E293B" />
          <path d="M46 54 Q50 59 54 54" stroke="#E11D48" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="38" cy="50" r="3" fill="#FDA4AF" />
          <circle cx="62" cy="50" r="3" fill="#FDA4AF" />
          {/* Dress top */}
          <path d="M34 68 C34 66 50 64 50 64 C50 64 66 66 66 68 L62 88 L38 88 Z" fill="#10B981" />
        </svg>
      );

    case 'hat':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Crown */}
          <path d="M30 60 C30 34 70 34 70 60 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          {/* Ribbon */}
          <path d="M30 56 Q50 53 70 56 L70 62 Q50 59 30 62 Z" fill="#EF4444" />
          {/* Brim */}
          <ellipse cx="50" cy="65" rx="38" ry="12" fill="#D97706" stroke="#78350F" strokeWidth="2" />
        </svg>
      );

    case 'insect':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Legs */}
          <line x1="26" y1="42" x2="40" y2="48" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="74" y1="42" x2="60" y2="48" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="58" x2="40" y2="58" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="78" y1="58" x2="60" y2="58" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="74" x2="40" y2="68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="74" y1="74" x2="60" y2="68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          {/* Body: Ladybug style */}
          <ellipse cx="50" cy="58" rx="22" ry="24" fill="#EF4444" />
          {/* Head */}
          <circle cx="50" cy="34" r="12" fill="#1E293B" />
          {/* Antennae */}
          <path d="M46 26 Q40 18 36 20" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M54 26 Q60 18 64 20" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Wing line & spots */}
          <line x1="50" y1="36" x2="50" y2="82" stroke="#1E293B" strokeWidth="3" />
          <circle cx="40" cy="50" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="50" r="3.5" fill="#1E293B" />
          <circle cx="38" cy="66" r="3.5" fill="#1E293B" />
          <circle cx="62" cy="66" r="3.5" fill="#1E293B" />
        </svg>
      );

    case 'jam':
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Jar */}
          <rect x="30" y="36" width="40" height="48" rx="8" fill="#BE123C" stroke="#881337" strokeWidth="2" />
          {/* Jar Neck & Cloth Lid */}
          <rect x="36" y="28" width="28" height="10" fill="#E2E8F0" />
          <path d="M26 26 C26 26 50 20 74 26 L72 32 C68 34 50 32 28 32 Z" fill="#F43F5E" />
          <line x1="32" y1="30" x2="68" y2="30" stroke="#78350F" strokeWidth="2" strokeDasharray="3 2" />
          {/* Label */}
          <rect x="36" y="48" width="28" height="22" rx="4" fill="#FFFFFF" opacity="0.95" />
          <circle cx="50" cy="59" r="6" fill="#E11D48" />
          <text x="50" y="62" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#FFFFFF">JAM</text>
        </svg>
      );

    default:
      return (
        <svg style={{ width: s, height: s }} viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="20" y="20" width="60" height="60" rx="12" fill="#E2E8F0" />
          <circle cx="50" cy="50" r="16" fill="#94A3B8" />
          <text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FFFFFF">★</text>
        </svg>
      );
  }
};
