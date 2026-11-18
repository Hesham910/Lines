'use client';

import { tr, type Locale } from '@/lib/site';
import { heroDriverScreen, heroRiderScreen } from '@/content/screens';

// Static street mesh; adjusted 25px upward
function HeroMap() {
  return <div className="hero-map" aria-hidden="true" style={{ transform: 'translateY(-25px)' }}>
    <svg viewBox="0 0 700 560" preserveAspectRatio="xMidYMid slice" fill="none">
      <g stroke="#3c4a20" strokeWidth="1.1" opacity=".5">
        <path d="M-20 90 H720M-20 190 H720M-20 300 H720M-20 410 H720M-20 500 H720" />
        <path d="M80 -20 V580M190 -20 V580M300 -20 V580M420 -20 V580M540 -20 V580M640 -20 V580" />
        <path d="M-20 140 L190 60 L300 120 L420 40 L540 110 L720 30" opacity=".7" />
        <path d="M-20 460 L140 520 L300 430 L460 500 L620 420 L720 470" opacity=".7" />
      </g>
      <g stroke="#556d24" strokeWidth="2.2" opacity=".8">
        <path d="M-20 240 C120 250 180 210 260 235 C340 260 420 200 520 225 C600 245 660 220 720 230" />
        <path d="M230 -20 C240 90 210 150 235 240 C260 330 225 430 245 580" />
      </g>
      <path className="hero-map-route" d="M85 22 C 180 95, 260 215, 360 295 C 465 365, 570 410, 620 445" />
    </svg>
    <span className="hero-map-car hero-map-car--a" />
    <span className="hero-map-car hero-map-car--b" />
    <span className="hero-map-car hero-map-car--c" />
  </div>;
}

const PINS = (
  <svg className="hero-map-pins" viewBox="0 0 700 560" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" style={{ overflow: 'visible', transform: 'translateY(-25px)' }}>
    <g className="hero-pin hero-pin--pickup">
      <circle className="hero-pin-ring" cx="85" cy="22" r="24" />
      <circle cx="85" cy="22" r="15" fill="#C9EE55" stroke="#101408" strokeWidth="2" />
      <circle cx="85" cy="18" r="4.6" fill="#0c1006" />
      <path d="M77.6 29.6c1.3-4.3 4-6.2 7.4-6.2s6.1 1.9 7.4 6.2" stroke="#0c1006" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </g>
    <g className="hero-pin">
      <path d="M620 445v-38" stroke="#EE7103" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M620 407l32 9-32 9Z" fill="#EE7103" stroke="#1a130a" strokeWidth="1.6" />
      <circle cx="620" cy="445" r="9" fill="#EE7103" stroke="#1a130a" strokeWidth="2" />
      <circle className="hero-pin-ring" cx="620" cy="431" r="24" />
    </g>
  </svg>
);

const TRACKERS = Array.from({ length: 25 }, (_, i) => i + 1);

function CyberPhone({ img, className }: { img: string; className: string }) {
  return <div className={`cyber-phone noselect ${className}`} aria-hidden="true" style={{ transform: 'translateY(-25px)' }}>
    <div className="cyber-trackers">{TRACKERS.map((n) => <span key={n} className={`tr-${n}`} />)}</div>
    <div className="cyber-card">
      <div className="cyber-content">
        <div className="cyber-glare" />
        <div className="cyber-lines"><span /><span /><span /><span /></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" draggable={false} />
        <span className="device-notch" />
        <span className="device-home" />
        <div className="cyber-glow cyber-glow-1" />
        <div className="cyber-glow cyber-glow-2" />
        <div className="cyber-glow cyber-glow-3" />
        <div className="cyber-particles"><span /><span /><span /><span /><span /><span /></div>
        <div className="cyber-corners"><span /><span /><span /><span /></div>
        <div className="cyber-scan" />
      </div>
    </div>
  </div>;
}

function AnimatedCheck() {
  return <svg className="deal-check" viewBox="0 0 30 30" aria-hidden="true">
    <circle className="deal-check-ring" cx="15" cy="15" r="13" pathLength={100} />
    <path className="deal-check-mark" d="M9.2 15.6l3.9 3.9 7.7-8.2" pathLength={100} />
  </svg>;
}

export function HeroStage({ locale }: { locale: Locale }) {
  return <div className="hero-visual" aria-hidden="true">
    <HeroMap />
    {PINS}
    <div className="hero-orbit orbit-one" style={{ transform: 'translateY(-25px)' }} />
    <div className="hero-orbit orbit-two" style={{ transform: 'translateY(-25px)' }} />
    <span className="graph-ref mono" style={{ transform: 'translateY(-25px)' }}>CH · 01 <i /></span>

    <CyberPhone img={heroRiderScreen} className="stage-rider" />
    <CyberPhone img={heroDriverScreen} className="stage-driver" />

    {/* حاوية خاصة بمحتوى الهيرو (النصوص والزرين) مرفوعة بقيمة 50 بكسل للأعلى */}
    <div className="hero-content-wrapper" style={{ transform: 'translateY(-50px)', position: 'relative', zIndex: 10 }}>
      {/* لو كان هناك أزرار أو عناصر إضافية تخص الهيرو داخل هذا المكون يتم وضعها هنا */}
    </div>
  </div>;
}