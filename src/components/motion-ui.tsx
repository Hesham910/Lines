'use client';

import type { ReactNode } from 'react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';

export function MotionFeatures({ children }: { children: ReactNode }) { return <LazyMotion features={domAnimation}>{children}</LazyMotion>; }

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <m.div className={className} initial={false} whileInView={reduce ? undefined : { y: [14,0], opacity: [.76,1], filter: ['blur(4px)','blur(0px)'] }} viewport={{ once: true, amount: .13 }} transition={{ duration:.56, delay, ease:[.2,.65,.3,1] }}>{children}</m.div>;
}

export function SlideWords({ lines, className }: { lines: string[]; className?: string }) {
  const reduce = useReducedMotion();
  return <h1 className={className} aria-label={lines.join(' ')}>{lines.map((line, row) => { const last = row === lines.length - 1; const endsDot = last && line.endsWith('.'); const body = endsDot ? line.slice(0, -1) : line; return <span key={line} aria-hidden="true" className={`word-row word-row-${row}`}>{body.split(' ').map((word, index) => { const glue = endsDot && index === body.split(' ').length - 1; return <span className="word-clip" key={`${word}-${index}`}><m.span initial={false} animate={reduce ? undefined : { y:['107%','0%'], opacity:[.5,1] }} transition={{duration:.65,delay:.035*(index+row*2),ease:[.18,.69,.26,1]}}>{word}{glue && <span className="title-dot">.</span>}</m.span></span>; })}</span>; })}</h1>;
}

export function SectionTitle({ children, className, id }: { children: string | string[]; className?: string; id?: string }) {
  const reduce = useReducedMotion();
  const lines = Array.isArray(children) ? children : [children];
  return <h2 id={id} className={className} aria-label={lines.join(' ')}><span className="title-mask" aria-hidden="true">{lines.map((line, row) => { const last = row === lines.length - 1; const endsDot = last && line.endsWith('.'); const body = endsDot ? line.slice(0, -1) : line; return <span key={`${line}-${row}`} className={`word-row word-row-${row}`}>{body.split(' ').map((word, index) => { const glue = endsDot && index === body.split(' ').length - 1; return <span className="word-clip" key={`${word}-${index}`}><m.span initial={false} whileInView={reduce ? undefined : { y:['54%','0%'], opacity:[.42,1] }} viewport={{ once:true, amount:.45 }} transition={{duration:.53,delay:Math.min((index+row*3)*.022,.16),ease:[.16,.64,.27,1]}}>{word}{glue && <span className="title-dot">.</span>}</m.span></span>; })}</span>; })}</span></h2>;
}
