"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, LucideIcon, Pencil, Share2, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

interface Action {
  id: string;
  icon: LucideIcon;
  label: string;
  angle: number;
  onClick?: () => void;
}

interface Position {
  x: number;
  y: number;
}

const actions: Action[] = [
  { id: "edit", icon: Pencil, label: "Edit", angle: 0 },
  { id: "copy", icon: Copy, label: "Copy", angle: 90 },
  { id: "share", icon: Share2, label: "Share", angle: 180 },
  { id: "delete", icon: Trash2, label: "Delete", angle: 270 },
];

const OrbitContextMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setVisible(false);
    setHoveredAction(null);
  }, []);

  useEffect(() => {
    window.addEventListener("click", closeMenu);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [handleContextMenu, closeMenu]);

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="fixed z-50 flex items-center justify-center pointer-events-none"
          style={{ left: position.x, top: position.y }}
        >
          {/* The Orbital Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute w-32 h-32 border border-dotted border-zinc-300 rounded-full"
          />

          {/* Central Orb */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            onClick={closeMenu}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="relative z-10 p-3 bg-white border border-zinc-100 rounded-full shadow-[6px_6px_12px_#e4e4e7,-6px_-6px_12px_#ffffff] pointer-events-auto group"
          >
            <motion.div
              variants={{
                hover: { rotate: 90 },
              }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} className="text-zinc-600" />
            </motion.div>
          </motion.button>

          {/* Orbiting Actions */}
          {actions.map((action, index) => {
            const radius = 64; // Distance from center
            const radian = (action.angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{ opacity: 1, x, y, scale: 1 }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="absolute pointer-events-auto"
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
              >
                {/* Action Button */}
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center p-2.5 bg-white border border-zinc-100 rounded-full shadow-md transition-shadow group relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.();
                    closeMenu();
                  }}
                >
                  <action.icon
                    size={16}
                    className="text-zinc-500 group-hover:text-zinc-900 transition-colors"
                  />

                  {/* Dark Pill Tooltip */}
                  <AnimatePresence>
                    {hoveredAction === action.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 34, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        className="absolute left-1/2 px-2 py-1 bg-zinc-900 text-white text-[10px] font-medium rounded-full whitespace-nowrap z-20 pointer-events-none"
                      >
                        {action.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrbitContextMenu;
