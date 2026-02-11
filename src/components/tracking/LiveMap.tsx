import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

interface LiveMapProps {
  /** 0 = at restaurant, 1 = delivered */
  progress: number;
  isActive: boolean;
}

// SVG route path points (a winding city route)
const routePath = "M 60,280 C 80,260 100,240 130,230 C 160,220 180,200 200,180 C 220,160 260,155 280,140 C 300,125 310,100 330,90 C 350,80 380,75 400,70 C 420,65 440,60 460,55";

// Street grid lines for a city-map feel
const streets = [
  "M 20,60 L 480,60", "M 20,120 L 480,120", "M 20,180 L 480,180",
  "M 20,240 L 480,240", "M 20,300 L 480,300",
  "M 80,20 L 80,320", "M 160,20 L 160,320", "M 240,20 L 240,320",
  "M 320,20 L 320,320", "M 400,20 L 400,320",
];

// Buildings (blocks between streets)
const buildings = [
  { x: 90, y: 65, w: 60, h: 45 }, { x: 170, y: 65, w: 55, h: 45 },
  { x: 250, y: 65, w: 55, h: 45 }, { x: 330, y: 65, w: 55, h: 45 },
  { x: 90, y: 125, w: 60, h: 45 }, { x: 170, y: 125, w: 55, h: 45 },
  { x: 250, y: 125, w: 55, h: 45 }, { x: 330, y: 125, w: 55, h: 45 },
  { x: 90, y: 185, w: 60, h: 45 }, { x: 170, y: 185, w: 55, h: 45 },
  { x: 250, y: 185, w: 55, h: 45 }, { x: 330, y: 185, w: 55, h: 45 },
  { x: 90, y: 245, w: 60, h: 45 }, { x: 170, y: 245, w: 55, h: 45 },
  { x: 410, y: 65, w: 55, h: 45 },
];

const LiveMap = ({ progress, isActive }: LiveMapProps) => {
  // Interpolate rider position along the path
  const riderX = 60 + (460 - 60) * progress;
  const riderY = 280 - (280 - 55) * progress + Math.sin(progress * Math.PI * 3) * 15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-6"
    >
      <div className="flex items-center justify-between p-4 pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          Live Tracking
        </h2>
        {isActive && (
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-accent">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            LIVE
          </span>
        )}
      </div>

      <div className="relative px-4 pb-4">
        <svg
          viewBox="0 0 500 340"
          className="w-full rounded-xl overflow-hidden"
          style={{ backgroundColor: "hsl(var(--secondary))" }}
        >
          {/* Street grid */}
          {streets.map((d, i) => (
            <path key={i} d={d} stroke="hsl(var(--background))" strokeWidth="6" fill="none" opacity="0.8" />
          ))}
          {streets.map((d, i) => (
            <path key={`dash-${i}`} d={d} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 8" fill="none" opacity="0.5" />
          ))}

          {/* Buildings */}
          {buildings.map((b, i) => (
            <rect
              key={i} x={b.x} y={b.y} width={b.w} height={b.h}
              rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5"
            />
          ))}

          {/* Route path (dashed background) */}
          <path d={routePath} fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="4" strokeDasharray="6 4" />

          {/* Route path (animated traveled portion) */}
          <motion.path
            d={routePath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Restaurant marker */}
          <g transform="translate(60, 280)">
            <circle r="10" fill="hsl(var(--coral))" opacity="0.2" />
            <circle r="6" fill="hsl(var(--coral))" />
            <text y="1" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">🍕</text>
            <text y="-16" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="600">Restaurant</text>
          </g>

          {/* Destination marker */}
          <g transform="translate(460, 55)">
            <circle r="10" fill="hsl(var(--accent))" opacity="0.2" />
            <circle r="6" fill="hsl(var(--accent))" />
            <text y="1" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">🏠</text>
            <text y="-16" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="600">Your Location</text>
          </g>

          {/* Rider */}
          {isActive && (
            <motion.g
              animate={{ x: riderX, y: riderY }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              {/* Rider pulse */}
              <motion.circle
                r="16"
                fill="hsl(var(--primary))"
                opacity="0.15"
                animate={{ r: [14, 20, 14] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              {/* Rider dot */}
              <circle r="8" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="2.5" />
              <text y="1" textAnchor="middle" fill="white" fontSize="8">🛵</text>
            </motion.g>
          )}

          {/* Delivered checkmark */}
          {progress >= 1 && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transform="translate(460, 55)"
            >
              <circle r="14" fill="hsl(var(--accent))" />
              <text y="2" textAnchor="middle" fill="white" fontSize="12">✓</text>
            </motion.g>
          )}
        </svg>

        {/* Map legend */}
        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-coral" /> Restaurant
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" /> Rider
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent" /> You
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMap;
