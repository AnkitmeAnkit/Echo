'use client';

import { useEffect, useState } from 'react';

/**
 * EchoRobotLogo
 * ---------------------------------------------------------------------
 * Animated mascot for the "Echo" wordmark.
 *
 * - Glass-shelled body with real "water" sloshing inside it (two wave
 *   layers + rising bubbles + a glinting surface line)
 * - Cute glassy eyes that idly look around and blink
 * - Antenna throws a soft "echo ping" (sonar ripple) on a loop
 * - A condensation drip occasionally forms and falls off the chin
 * - Every 8-14s a tiny cyan/red "glitch" flicker hits the pupils — a
 *   nod to "EchoGlitch"
 *
 * Usage:  <EchoRobotLogo size={44} />
 *
 * No extra dependencies (pure SVG + CSS). Respects prefers-reduced-motion.
 * Accent color is #6cd4ff — it appears in 3 places below if you want to retheme.
 */

interface EchoRobotLogoProps {
  /** Rendered width in px. Height follows the 48:58 viewBox ratio. */
  size?: number;
  className?: string;
}

const LOOK_TARGETS: { x: number; y: number }[] = [
  { x: 0, y: 0 },
  { x: -1.6, y: -1 },
  { x: 1.6, y: -1 },
  { x: 0, y: 1.3 },
  { x: -1.8, y: 0.6 },
  { x: 1.8, y: 0.6 },
  { x: -2.1, y: -0.3 },
  { x: 2.1, y: -0.3 },
];

export default function EchoRobotLogo({ size = 44, className = '' }: EchoRobotLogoProps) {
  const [look, setLook] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let lookTimer: ReturnType<typeof setTimeout>;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let glitchTimer: ReturnType<typeof setTimeout>;

    const scheduleLook = () => {
      lookTimer = setTimeout(() => {
        setLook(LOOK_TARGETS[Math.floor(Math.random() * LOOK_TARGETS.length)]);
        scheduleLook();
      }, 1200 + Math.random() * 2200);
    };

    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 120);
        scheduleBlink();
      }, 2800 + Math.random() * 3200);
    };

    const scheduleGlitch = () => {
      glitchTimer = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 160);
        scheduleGlitch();
      }, 8000 + Math.random() * 6000);
    };

    scheduleLook();
    scheduleBlink();
    scheduleGlitch();

    return () => {
      clearTimeout(lookTimer);
      clearTimeout(blinkTimer);
      clearTimeout(glitchTimer);
    };
  }, []);

  const height = Math.round((size * 58) / 48);

  return (
    <div
      className={`echo-robot ${className}`}
      style={{ width: size, height, display: 'inline-flex' }}
      aria-hidden="true"
    >
      <style>{`
        .echo-robot svg {
          display: block;
          overflow: visible;
          filter: drop-shadow(0 3px 10px rgba(10, 40, 90, 0.35));
          animation: echoFloat 4.4s ease-in-out infinite;
          transform-origin: 50% 50%;
        }
        @keyframes echoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-1.6px) rotate(-1.3deg); }
          50%      { transform: translateY(-2.8px) rotate(0deg); }
          75%      { transform: translateY(-1px) rotate(1.1deg); }
        }
        .echo-body {
          animation: echoBreathe 5.6s ease-in-out infinite;
        }
        @keyframes echoBreathe {
          0%, 100% { rx: 13px; ry: 13px; }
          50%      { rx: 15px; ry: 11.5px; }
        }
        .echo-ping circle {
          animation: echoPing 3.6s ease-out infinite;
        }
        .echo-ping circle:nth-child(2) {
          animation-delay: 1.8s;
        }
        @keyframes echoPing {
          0%   { r: 3px;  opacity: .55; }
          70%  { opacity: .08; }
          100% { r: 9px;  opacity: 0; }
        }
        .echo-wave-back  { animation: echoDrift 10s linear infinite; }
        .echo-wave-front { animation: echoDrift 6.5s linear infinite; }
        @keyframes echoDrift {
          from { transform: translateX(0); }
          to   { transform: translateX(-24px); }
        }
        .echo-bubble {
          animation-name: echoBubble;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
        }
        @keyframes echoBubble {
          0%   { transform: translateY(0) scale(.5); opacity: 0; }
          18%  { opacity: .55; }
          85%  { opacity: .22; }
          100% { transform: translateY(-7px) scale(1); opacity: 0; }
        }
        .echo-shine {
          animation: echoShine 7s ease-in-out infinite;
        }
        @keyframes echoShine {
          0%, 100% { transform: translate(0, 0); opacity: .45; }
          50%      { transform: translate(2.5px, -1px); opacity: .8; }
        }
        .echo-mouth {
          transform-box: fill-box;
          transform-origin: center;
          animation: echoMouth 5s ease-in-out infinite;
        }
        @keyframes echoMouth {
          0%, 100% { transform: scaleX(1); }
          50%      { transform: scaleX(1.08); }
        }
        .echo-drip {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: echoDrip 5s ease-in infinite;
        }
        @keyframes echoDrip {
          0%   { transform: translateY(0) scaleY(.5); opacity: 0; }
          20%  { transform: translateY(0) scaleY(1); opacity: .85; }
          55%  { transform: translateY(0) scaleY(1.25); opacity: .85; }
          78%  { transform: translateY(6px) scaleY(.7); opacity: .4; }
          100% { transform: translateY(11px) scaleY(.4); opacity: 0; }
        }
        .echo-glitch { mix-blend-mode: screen; }
        @media (prefers-reduced-motion: reduce) {
          .echo-robot svg,
          .echo-body,
          .echo-ping circle,
          .echo-wave-back,
          .echo-wave-front,
          .echo-bubble,
          .echo-shine,
          .echo-mouth,
          .echo-drip {
            animation: none !important;
          }
        }
      `}</style>

      <svg viewBox="0 0 48 58" width={size} height={height}>
        <defs>
          <linearGradient id="echoBodyGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#212d47" />
            <stop offset="45%" stopColor="#0a1322" />
            <stop offset="100%" stopColor="#00050d" />
          </linearGradient>

          <linearGradient id="echoWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(80,180,255,.45)" />
            <stop offset="55%" stopColor="rgba(10,40,75,.85)" />
            <stop offset="100%" stopColor="rgba(1,4,10,1)" />
          </linearGradient>

          <radialGradient id="echoEyeGlass" cx="35%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#dceefc" />
            <stop offset="100%" stopColor="#8fc4ec" />
          </radialGradient>

          <radialGradient id="echoShineGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(170,225,255,.55)" />
            <stop offset="100%" stopColor="rgba(170,225,255,0)" />
          </radialGradient>

          <clipPath id="echoBodyClip">
            <rect x="8" y="11" width="32" height="34" rx="12" />
          </clipPath>
        </defs>

        {/* Antenna echo-ping (sonar ripple) */}
        <g className="echo-ping" fill="none" stroke="#6cd4ff" strokeWidth="1">
          <circle cx="24" cy="3" r="3" />
          <circle cx="24" cy="3" r="3" />
        </g>

        {/* Antenna */}
        <rect x="22.5" y="3" width="3" height="8" rx="1.5" fill="#0b1320" />
        <circle cx="24" cy="3" r="3" fill="#0b1320" />
        <circle cx="24" cy="3" r="1.3" fill="#6cd4ff" />

        {/* Ears */}
        <rect x="2" y="20" width="5.5" height="13" rx="2.75" fill="#0a1322" />
        <rect x="3.2" y="23" width="2" height="7" rx="1" fill="rgba(135,210,255,.15)" />
        <rect x="40.5" y="20" width="5.5" height="13" rx="2.75" fill="#0a1322" />
        <rect x="42.8" y="23" width="2" height="7" rx="1" fill="rgba(135,210,255,.15)" />

        {/* Body / glass shell */}
        <rect
          className="echo-body"
          x="7" y="10" width="34" height="36" rx="13" ry="13"
          fill="url(#echoBodyGlass)"
          stroke="rgba(140,210,255,.16)"
          strokeWidth="1"
        />

        {/* Everything sloshing inside the glass */}
        <g clipPath="url(#echoBodyClip)">
          <g className="echo-wave-back" opacity=".35">
            <path
              d="M-24 39 C-21 36.5 -15 36.5 -12 39 C-9 41.5 -3 41.5 0 39 C3 36.5 9 36.5 12 39 C15 41.5 21 41.5 24 39 C27 36.5 33 36.5 36 39 C39 41.5 45 41.5 48 39 C51 36.5 57 36.5 60 39 C63 41.5 69 41.5 72 39 C75 36.5 81 36.5 84 39 C87 41.5 93 41.5 96 39 V54 H-24 Z"
              fill="url(#echoWater)"
            />
          </g>

          <g className="echo-wave-front" opacity=".8">
            <path
              d="M-24 37.5 C-21 35 -15 35 -12 37.5 C-9 40 -3 40 0 37.5 C3 35 9 35 12 37.5 C15 40 21 40 24 37.5 C27 35 33 35 36 37.5 C39 40 45 40 48 37.5 C51 35 57 35 60 37.5 C63 40 69 40 72 37.5 C75 35 81 35 84 37.5 C87 40 93 40 96 37.5 V54 H-24 Z"
              fill="url(#echoWater)"
            />
            <path
              d="M-24 37.5 C-21 35 -15 35 -12 37.5 C-9 40 -3 40 0 37.5 C3 35 9 35 12 37.5 C15 40 21 40 24 37.5 C27 35 33 35 36 37.5 C39 40 45 40 48 37.5 C51 35 57 35 60 37.5 C63 40 69 40 72 37.5 C75 35 81 35 84 37.5 C87 40 93 40 96 37.5"
              fill="none"
              stroke="#6cd4ff"
              strokeWidth=".6"
              opacity=".4"
            />
          </g>

          <circle className="echo-bubble" cx="14" cy="44" r="0.8" fill="#bfe6ff" style={{ animationDuration: '4.5s', animationDelay: '0s' }} />
          <circle className="echo-bubble" cx="24" cy="45" r="0.6" fill="#bfe6ff" style={{ animationDuration: '3.8s', animationDelay: '1.3s' }} />
          <circle className="echo-bubble" cx="32" cy="44.5" r="0.9" fill="#bfe6ff" style={{ animationDuration: '5.2s', animationDelay: '2.6s' }} />

          <ellipse className="echo-shine" cx="16" cy="17" rx="9" ry="5" fill="url(#echoShineGrad)" />
        </g>

        {/* Eyes */}
        <circle cx="17" cy="23" r="6.6" fill="url(#echoEyeGlass)" />
        <circle cx="31" cy="23" r="6.6" fill="url(#echoEyeGlass)" />

        {!blink && (
          <g style={{ transform: `translate(${look.x}px, ${look.y}px)` }}>
            <circle cx="17" cy="23" r="3.4" fill="#0c1a2c" />
            <circle cx="31" cy="23" r="3.4" fill="#0c1a2c" />
            <circle cx="15.6" cy="21.4" r="1.1" fill="#fff" opacity=".85" />
            <circle cx="29.6" cy="21.4" r="1.1" fill="#fff" opacity=".85" />
            <circle cx="18.4" cy="24.3" r=".5" fill="#fff" opacity=".4" />
            <circle cx="32.4" cy="24.3" r=".5" fill="#fff" opacity=".4" />

            {glitch && (
              <g className="echo-glitch">
                <circle cx="16.1" cy="21.4" r="2" fill="#00e5ff" opacity=".5" />
                <circle cx="17.9" cy="21.4" r="2" fill="#ff3b6e" opacity=".5" />
                <circle cx="30.1" cy="21.4" r="2" fill="#00e5ff" opacity=".5" />
                <circle cx="31.9" cy="21.4" r="2" fill="#ff3b6e" opacity=".5" />
              </g>
            )}
          </g>
        )}

        {blink && (
          <>
            <rect x="10.4" y="21.6" width="13.2" height="2.8" rx="1.4" fill="#0a1322" />
            <rect x="24.4" y="21.6" width="13.2" height="2.8" rx="1.4" fill="#0a1322" />
          </>
        )}

        {/* Mouth */}
        <path className="echo-mouth" d="M18 33 Q24 36.4 30 33" fill="none" stroke="#33485f" strokeWidth="2" strokeLinecap="round" />

        {/* Cheeks */}
        <ellipse cx="10.5" cy="27" rx="2.6" ry="1.7" fill="rgba(255,140,150,.16)" />
        <ellipse cx="37.5" cy="27" rx="2.6" ry="1.7" fill="rgba(255,140,150,.16)" />

        {/* Condensation drip */}
        <ellipse className="echo-drip" cx="24" cy="47.5" rx="1.3" ry="1.6" fill="url(#echoWater)" />
      </svg>
    </div>
  );
}
