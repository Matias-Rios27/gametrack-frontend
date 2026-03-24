"use client";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Ghost, Crosshair, Sword, Heart, Star, Disc } from "lucide-react";
import { useEffect, useState } from "react";

const icons = [Gamepad2, Trophy, Ghost, Crosshair, Sword, Heart, Star, Disc];

export function AuthBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--color-electric-blue),0.15),rgba(255,255,255,0))]" />
      
      {/* Floating Elements */}
      {Array.from({ length: 20 }).map((_, i) => {
        const Icon = icons[i % icons.length];
        const size = Math.random() * 40 + 20; // 20px to 60px
        const initialX = Math.random() * 100; // 0 to 100vw
        const initialY = Math.random() * 100; // 0 to 100vh
        const duration = Math.random() * 30 + 30; // 30s to 60s
        const delay = Math.random() * -30; // negative delay to start already animated

        return (
          <motion.div
            key={i}
            className="absolute text-electric-blue/10"
            initial={{
              x: `${initialX}vw`,
              y: `${initialY}vh`,
              rotate: 0,
              scale: 0.5,
            }}
            animate={{
              x: [`${initialX}vw`, `${(initialX + 30) % 100}vw`, `${(initialX - 20) % 100}vw`, `${initialX}vw`],
              y: [`${initialY}vh`, `${(initialY - 30) % 100}vh`, `${(initialY + 20) % 100}vh`, `${initialY}vh`],
              rotate: [0, 180, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            }}
          >
            <Icon strokeWidth={1.5} style={{ width: size, height: size }} />
          </motion.div>
        );
      })}
    </div>
  );
}
