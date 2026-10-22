'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  text: string;
  date: string;
  timestamp: number;
}

interface LevelItem {
  title: string;
  href: string;
  borderColor: string;
  glowColor: string;
  badgeBg: string;
  icon: string;
  tag: string;
  badge?: string;
}

const levels: LevelItem[] = [
  {
    title: '1ère',
    href: '/quiz/1ere',
    borderColor: 'rgba(234, 179, 8, 0.6)',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    badgeBg: 'rgba(234, 179, 8, 0.2)',
    icon: '📐',
    tag: 'QCM 1ÈRE',
  },
  {
    title: '2ème Sc',
    href: '/quiz/2eme',
    borderColor: 'rgba(168, 85, 247, 0.6)',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
    icon: '📈',
    tag: 'QCM 2ÈME',
    badge: 'POPULAIRE',
  },
  {
    title: '3ème Sc',
    href: '/quiz/3eme-sc',
    borderColor: 'rgba(14, 165, 233, 0.6)',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    badgeBg: 'rgba(14, 165, 233, 0.2)',
    icon: '🧪',
    tag: 'QCM 3ÈME SC',
  },
  {
    title: '3ème Tech',
    href: '/quiz/3eme-tech',
    borderColor: 'rgba(20, 184, 166, 0.6)',
    glowColor: 'rgba(20, 184, 166, 0.25)',
    badgeBg: 'rgba(20, 184, 166, 0.2)',
    icon: '⚙️',
    tag: 'QCM 3ÈME T',
  },
  {
    title: 'BAC Sciences',
    href: '/quiz/bac-sc',
    borderColor: 'rgba(244, 63, 94, 0.6)',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    badgeBg: 'rgba(244, 63, 94, 0.2)',
    icon: '🫀',
    tag: 'QCM BAC',
    badge: 'EXAMEN',
  },
  {
    title: 'BAC Tech',
    href: '/quiz/bac-tech',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    badgeBg: 'rgba(59, 130, 246, 0.2)',
    icon: '💻',
    tag: 'QCM BAC',
    badge: 'EXAMEN',
  },
];

const menuItems = [
  { label: '1ère', href: '/1ere', color: '#eab308' },
  { label: '2ème', href: '/2eme', color: '#a855f7' },
  { label: '3ème', href: '/3eme', color: '#0ea5e9' },
  { label: 'BAC', href: '/bac', color: '#f43f5e' },
];

/* Menu avec effet loupe (souris + doigt) */
function DockMenu() {
  const [scales, setScales] = useState<number[]>(menuItems.map(() => 1));
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  const updateScales = (clientX: number) => {
    const range = window.innerWidth < 640 ? 70 : 100;
    const maxGrow = window.innerWidth < 640 ? 0.4 : 0.55;
    const next = refs.current.map((el) => {
      if (!el) return 1;
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const t = Math.max(0, 1 - Math.abs(clientX - center) / range);
      return 1 + maxGrow * t;
    });
    setScales(next);
  };

  const reset = () => setScales(menuItems.map(() => 1));

  return (
    <div
      className="menu-dock"
      onPointerDown={(e) => updateScales(e.clientX)}
      onPointerMove={(e) => updateScales(e.clientX)}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onPointerUp={(e) => {
        if (e.pointerType === 'touch') reset();
      }}
    >
      {menuItems.map((item, i) => (
        <Link
          key={item.label}
          href={item.href}
          className="dock-link"
          ref={(el) => {
            refs.current[i] = el;
          }}
          style={{
            transform: `scale(${scales[i]})`,
            color: scales[i] > 1.15 ? '#f8fafc' : '#cbd5e1',
            zIndex: scales[i] > 1.15 ? 2 : 1,
          }}
        >
          {item.label}
          <span className="dock-bar" style={{ backgroundColor: item.color }} />
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data: NewsItem[]) => {
        if (Array.isArray(data)) setNewsList(data);
      })
      .catch((err: unknown) => console.error('Erreur API News:', err));
  }, []);

  const latestNews = newsList.length > 0 ? newsList[0] : null;

  return (
    <main
      className="page-main"
      style={{
        minHeight: '100vh',
        backgroundColor: '#06151b',
        color: '#e2e8f0',
        padding: '32px 20px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        backgroundImage: `
          radial-gradient(circle at 50% 20%, rgba(20, 184, 166, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 20% 80%, rgba(13, 148, 136, 0.08) 0%, transparent 45%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <style jsx global>{`
        .btn-interactive {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-interactive:hover {
          transform: translateY(-4px) scale(1.02);
        }
        .btn-interactive:active {
          transform: translateY(1px) scale(0.98);
        }
        .pulse-beacon {
          box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.5);
          animation: pulse 2.5s infinite;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.5);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(20, 184, 166, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0);
          }
        }

        .menu-dock {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 22px;
          padding: 16px 8px 0 8px;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }
        .dock-link {
          text-decoration: none;
          font-weight: 700;
          font-size: 1.35rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transform-origin: center bottom;
          transition: transform 0.15s ease-out, color 0.2s ease;
          will-change: transform;
          -webkit-tap-highlight-color: transparent;
        }
        .dock-bar {
          display: block;
          width: 26px;
          height: 4px;
          border-radius: 2px;
          opacity: 0.9;
        }

        @media (max-width: 640px) {
          .page-main {
            padding: 20px 12px !important;
          }
          .nav-bar {
            justify-content: center !important;
            padding: 10px 14px !important;
          }
          .menu-dock {
            width: 100%;
            justify-content: space-around;
            gap: 6px;
            padding: 14px 4px 0 4px;
          }
          .dock-link {
            font-size: 1.15rem;
          }
          .dock-bar {
            width: 20px;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        {/* Navigation Haute */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/essai"
            className="btn-interactive"
            style={{
              backgroundColor: 'rgba(15, 30, 38, 0.8)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              color: '#e2e8f0',
              padding: '10px 22px',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ color: '#f59e0b' }}>⚡</span> HTML
          </Link>

          <nav
            className="nav-bar"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(12, 25, 32, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px 24px',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(20, 184, 166, 0.2)',
                  border: '1px solid rgba(20, 184, 166, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: '#2dd4bf',
                }}
              >
                ∑
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  Maths Interactive
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '-2px' }}>
                  Plateforme Interactive
                </div>
              </div>
            </div>

            <DockMenu />
          </nav>
        </header>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              margin: 0,
              letterSpacing: '-0.02em',
              color: '#f8fafc',
            }}
          >
            QCM
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {levels.map((lvl) => (
            <Link
              key={lvl.title}
              href={lvl.href}
              className="btn-interactive"
              style={{
                width: '210px',
                height: '210px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 22, 29, 0.65)',
                border: `2px solid ${lvl.borderColor}`,
                boxShadow: `0 0 25px ${lvl.glowColor}, inset 0 0 15px ${lvl.glowColor}`,
                textDecoration: 'none',
                color: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                textAlign: 'center',
                position: 'relative',
                backdropFilter: 'blur(8px)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <span
                  style={{
                    backgroundColor: lvl.badgeBg,
                    border: `1px solid ${lvl.borderColor}`,
                    color: '#f8fafc',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                  }}
                >
                  {lvl.tag}
                </span>
                {lvl.badge && (
                  <span
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      fontSize: '0.55rem',
                      fontWeight: 800,
                      marginTop: '2px',
                    }}
                  >
                    {lvl.badge}
                  </span>
                )}
              </div>

              <span style={{ fontSize: '2rem', marginTop: '14px', marginBottom: '6px' }}>
                {lvl.icon}
              </span>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, lineHeight: '1.2' }}>
                {lvl.title}
              </h3>
            </Link>
          ))}
        </div>

        <div
          style={{
            backgroundColor: 'rgba(12, 25, 32, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '20px 28px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span
            className="pulse-beacon"
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#2dd4bf',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(20, 184, 166, 0.15)',
                color: '#2dd4bf',
                padding: '3px 10px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                marginBottom: '4px',
              }}
            >
              📢 Dernières Actualités
            </div>
            {latestNews ? (
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  {latestNews.text}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                  Mise à jour le {latestNews.date}
                </p>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  Mr Borhen
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                  Mise à jour le 19/08/2026
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
