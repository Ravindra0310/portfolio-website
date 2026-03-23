import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

/* ── Tech tile definitions ── */
const TECH: Record<number, { label: string; color: string; bg: string; glow: string }> = {
  2:    { label: 'HTML',       color: '#e34f26', bg: 'rgba(227,79,38,0.12)',    glow: 'rgba(227,79,38,0.25)' },
  4:    { label: 'CSS',        color: '#2965f1', bg: 'rgba(41,101,241,0.12)',   glow: 'rgba(41,101,241,0.25)' },
  8:    { label: 'JavaScript', color: '#f7df1e', bg: 'rgba(247,223,30,0.12)',   glow: 'rgba(247,223,30,0.25)' },
  16:   { label: 'TypeScript', color: '#3178c6', bg: 'rgba(49,120,198,0.12)',   glow: 'rgba(49,120,198,0.25)' },
  32:   { label: 'React',      color: '#61dafb', bg: 'rgba(97,218,251,0.12)',   glow: 'rgba(97,218,251,0.25)' },
  64:   { label: 'Git',        color: '#f05032', bg: 'rgba(240,80,50,0.12)',    glow: 'rgba(240,80,50,0.25)' },
  128:  { label: 'Kotlin',     color: '#7f52ff', bg: 'rgba(127,82,255,0.12)',   glow: 'rgba(127,82,255,0.25)' },
  256:  { label: 'Android',    color: '#3ddc84', bg: 'rgba(61,220,132,0.12)',   glow: 'rgba(61,220,132,0.25)' },
  512:  { label: 'Flutter',    color: '#54c5f8', bg: 'rgba(84,197,248,0.12)',   glow: 'rgba(84,197,248,0.25)' },
  1024: { label: 'Compose',    color: '#4285f4', bg: 'rgba(66,133,244,0.15)',   glow: 'rgba(66,133,244,0.35)' },
  2048: { label: 'KMM 🚀',    color: '#00e5ff', bg: 'rgba(0,229,255,0.18)',    glow: 'rgba(0,229,255,0.50)' },
};

/* ── Game logic ── */
type Grid = number[][];

const emptyGrid = (): Grid => Array.from({ length: 4 }, () => [0, 0, 0, 0]);

const addRandomTile = (g: Grid): { grid: Grid; pos: [number, number] | null } => {
  const empty: [number, number][] = [];
  g.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
  if (!empty.length) return { grid: g, pos: null };
  const pos = empty[Math.floor(Math.random() * empty.length)];
  const next = g.map(row => [...row]);
  next[pos[0]][pos[1]] = Math.random() < 0.9 ? 2 : 4;
  return { grid: next, pos };
};

const initGrid = (): Grid => {
  const { grid: g1 } = addRandomTile(emptyGrid());
  const { grid: g2 } = addRandomTile(g1);
  return g2;
};

const slideRow = (row: number[]): { out: number[]; gained: number } => {
  const arr = row.filter(Boolean);
  let gained = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < arr.length) {
    if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
      merged.push(arr[i] * 2);
      gained += arr[i] * 2;
      i += 2;
    } else {
      merged.push(arr[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { out: merged, gained };
};

const transpose = (g: Grid): Grid => g[0].map((_, i) => g.map(row => row[i]));
const flipRows  = (g: Grid): Grid => g.map(row => [...row].reverse());

type Dir = 'l' | 'r' | 'u' | 'd';

const applyMove = (g: Grid, dir: Dir): { grid: Grid; score: number; moved: boolean } => {
  let work = g;
  if (dir === 'r') work = flipRows(g);
  else if (dir === 'u') work = transpose(g);
  else if (dir === 'd') work = flipRows(transpose(g));

  let score = 0;
  const moved = work.map(row => { const { out, gained } = slideRow(row); score += gained; return out; });

  let result = moved;
  if (dir === 'r') result = flipRows(moved);
  else if (dir === 'u') result = transpose(moved);
  else if (dir === 'd') result = transpose(flipRows(moved));

  const changed = JSON.stringify(result) !== JSON.stringify(g);
  return { grid: result, score, moved: changed };
};

const checkWin  = (g: Grid) => g.some(row => row.some(v => v >= 2048));
const checkLost = (g: Grid) => {
  if (g.some(row => row.some(v => !v))) return false;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (c < 3 && g[r][c] === g[r][c + 1]) return false;
      if (r < 3 && g[r][c] === g[r + 1][c]) return false;
    }
  return true;
};

/* ── Component ── */
export const Game2048 = () => {
  const [grid, setGrid]   = useState<Grid>(initGrid);
  const [score, setScore] = useState(0);
  const [best, setBest]   = useState(() => Number(localStorage.getItem('2048-best') || 0));
  const [won, setWon]     = useState(false);
  const [lost, setLost]   = useState(false);
  // Track newly spawned tile for pop animation
  const [newCell, setNewCell] = useState<string>('');
  // Track merged cells for pop
  const [mergedCells, setMergedCells] = useState<Set<string>>(new Set());
  const touchRef = useRef({ x: 0, y: 0 });

  const move = useCallback((dir: Dir) => {
    if (won || lost) return;
    setGrid(prev => {
      const { grid: shifted, score: gained, moved } = applyMove(prev, dir);
      if (!moved) return prev;

      // Find merged cells
      const merged = new Set<string>();
      shifted.forEach((row, r) => row.forEach((v, c) => {
        if (v && v !== prev[r][c] && prev[r][c] !== 0) merged.add(`${r},${c}`);
      }));
      setMergedCells(merged);
      setTimeout(() => setMergedCells(new Set()), 300);

      const { grid: final, pos } = addRandomTile(shifted);

      setScore(s => {
        const ns = s + gained;
        setBest(b => {
          const nb = Math.max(b, ns);
          localStorage.setItem('2048-best', String(nb));
          return nb;
        });
        return ns;
      });

      if (pos) {
        const key = `${pos[0]},${pos[1]},${Date.now()}`;
        setNewCell(key);
        setTimeout(() => setNewCell(''), 300);
      }

      if (checkWin(final)) setWon(true);
      else if (checkLost(final)) setLost(true);
      return final;
    });
  }, [won, lost]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowLeft: 'l', ArrowRight: 'r', ArrowUp: 'u', ArrowDown: 'd' };
      if (!map[e.key]) return;
      e.preventDefault();
      move(map[e.key]);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [move]);

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'r' : 'l');
    else move(dy > 0 ? 'd' : 'u');
  };

  const restart = () => {
    setGrid(initGrid());
    setScore(0);
    setWon(false);
    setLost(false);
    setNewCell('');
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto select-none">
      {/* Score bar */}
      <div className="flex gap-3 w-full">
        {[{ label: 'SCORE', val: score }, { label: 'BEST', val: best }].map(({ label, val }) => (
          <div key={label} className="flex-1 glass-card px-4 py-3 text-center">
            <div className="text-[10px] font-black tracking-widest text-text-secondary mb-1">{label}</div>
            <motion.div key={val} initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}
              className="text-2xl font-black text-[#00e5ff]">{val.toLocaleString()}</motion.div>
          </div>
        ))}
        <button onClick={restart} title="New Game"
          className="glass-card px-4 py-3 hover:border-[#00e5ff] transition-all flex items-center justify-center gap-2 text-xs font-black tracking-widest text-text-secondary hover:text-[#00e5ff]">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Board */}
      <div className="relative w-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Background grid */}
        <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl"
          style={{ background: 'rgba(15,15,15,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Empty slots */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
          ))}
        </div>

        {/* Tiles overlay */}
        <div className="absolute inset-3 grid grid-cols-4 gap-2">
          {grid.map((row, r) => row.map((val, c) => {
            const tech = TECH[val];
            const key = `${r},${c}`;
            const isNew = newCell.startsWith(`${r},${c},`);
            const isMerged = mergedCells.has(key);
            return (
              <motion.div
                key={key}
                animate={
                  isNew   ? { scale: [0, 1.2, 1] } :
                  isMerged ? { scale: [1, 1.15, 1] } :
                  { scale: 1 }
                }
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="aspect-square rounded-xl flex flex-col items-center justify-center"
                style={{
                  background: tech ? tech.bg : 'transparent',
                  border: tech ? `1px solid ${tech.color}25` : '1px solid transparent',
                  boxShadow: tech ? `0 0 16px ${tech.glow}, inset 0 0 20px ${tech.glow}` : 'none',
                }}
              >
                {tech && (
                  <div className="flex flex-col items-center gap-0.5 px-1">
                    <span className="font-black text-center leading-tight"
                      style={{
                        color: tech.color,
                        fontSize: tech.label.length > 8 ? '0.55rem' : tech.label.length > 5 ? '0.65rem' : '0.75rem',
                        textShadow: `0 0 10px ${tech.color}`,
                      }}>
                      {tech.label}
                    </span>
                    <span className="font-black opacity-30 text-white" style={{ fontSize: '0.55rem' }}>{val}</span>
                  </div>
                )}
              </motion.div>
            );
          }))}
        </div>

        {/* Win / Lose overlay */}
        <AnimatePresence>
          {(won || lost) && (
            <motion.div initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
              style={{ background: 'rgba(5,5,5,0.88)', backdropFilter: 'blur(12px)' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                <div className="text-6xl mb-4 text-center">{won ? '🚀' : '😵'}</div>
                <h3 className="text-3xl font-black mb-2 text-center" style={{ color: won ? '#00e5ff' : '#ff4444' }}>
                  {won ? 'You reached KMM!' : 'Game Over!'}
                </h3>
                <p className="text-text-secondary mb-8 text-center">Final Score: <span className="text-white font-black">{score.toLocaleString()}</span></p>
                <button onClick={restart}
                  className="bg-[#00e5ff] text-black font-black py-3 px-10 rounded-xl hover:bg-[#00c2d9] transition-all hover:scale-105 block mx-auto">
                  Play Again
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tech progression legend */}
      <div className="w-full glass-card p-4">
        <p className="text-[10px] font-black tracking-widest uppercase text-text-secondary mb-3">Tech Progression</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(TECH).map(([val, t]) => (
            <span key={val} className="text-[9px] font-black px-2 py-1 rounded-full border"
              style={{ color: t.color, borderColor: `${t.color}35`, background: t.bg }}>
              {val} · {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Controls hint */}
      <p className="text-xs text-text-secondary text-center">
        ← → ↑ ↓ arrow keys to play &nbsp;·&nbsp; swipe on mobile
      </p>
    </div>
  );
};
