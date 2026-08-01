"use client";

import type { ReactNode } from "react";

/**
 * Chat-style message bubble — glass panel with a crimson border, a little
 * tail, and a soft glow. `tail` picks which side the tail points at:
 *   tail="left"  → bubble sits to the RIGHT of its anchor (points left)
 *   tail="right" → bubble sits to the LEFT of its anchor (points right)
 * The wrapper carries [data-reveal] so it participates in the section's
 * scroll-reveal stagger automatically.
 */
export default function ChatBubble({
  children,
  tail = "left",
  meta,
  className = "",
}: {
  children: ReactNode;
  tail?: "left" | "right";
  meta?: string;
  className?: string;
}) {
  const tailPos = tail === "left" ? "-left-[7px]" : "-right-[7px]";

  return (
    <div data-reveal className={`relative max-w-xs ${className}`}>
      <div className="relative rounded-2xl rounded-tl-md border border-crimson-core/40 bg-panel/70 px-5 py-4 shadow-[0_0_35px_rgba(255,47,71,0.18)] backdrop-blur-md">
        {/* Tail */}
        <span
          className={`absolute top-5 h-3.5 w-3.5 rotate-45 border-b border-l border-crimson-core/40 bg-panel/70 ${tailPos}`}
        />
        <div className="font-body text-sm leading-relaxed text-bone">
          {children}
        </div>
        {meta && (
          <p className="mt-2.5 border-t border-crimson-deep/40 pt-2 font-mono text-[10px] tracking-widest text-crimson-hot/80">
            {meta}
          </p>
        )}
      </div>
    </div>
  );
}
