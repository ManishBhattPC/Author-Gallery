import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isHoveringIframe, setIsHoveringIframe] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Detect Touchscreen Trigger
  useEffect(() => {
    const handleTouchStart = () => {
      setIsMobile(true);
      window.removeEventListener("touchstart", handleTouchStart);
    };
    window.addEventListener("touchstart", handleTouchStart);
    return () => window.removeEventListener("touchstart", handleTouchStart);
  }, []);

  // 2. Manage Global Body Cursor Styles
  useEffect(() => {
    if (isMobile) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    if (isHoveringIframe) {
      document.body.classList.remove("custom-cursor-active");
    } else {
      document.body.classList.add("custom-cursor-active");
    }

    return () => {
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isMobile, isHoveringIframe]);

  // 3. Monitor and Bind iFrame Mouse Over/Leaves to Prevent Quill Sticky Stuck
  useEffect(() => {
    if (isMobile) return;

    const handleMouseEnter = () => setIsHoveringIframe(true);
    const handleMouseLeave = () => setIsHoveringIframe(false);

    const bindIframeEvents = () => {
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        iframe.removeEventListener("mouseenter", handleMouseEnter);
        iframe.removeEventListener("mouseleave", handleMouseLeave);
        iframe.addEventListener("mouseenter", handleMouseEnter);
        iframe.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    bindIframeEvents();
    const intervalId = setInterval(bindIframeEvents, 1200);

    return () => {
      clearInterval(intervalId);
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        iframe.removeEventListener("mouseenter", handleMouseEnter);
        iframe.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [isMobile]);

  // 4. Main GSAP Mouse Movement Tracking, Tilts, and Particles
  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let lastX = 0;
    let speedX = 0;

    let lastClientY = null;
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let isAnimatingScroll = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (lastClientY !== null) {
        const deltaY = e.clientY - lastClientY;
        // Skip large viewport jumps (e.g. entering window or tab switch)
        if (Math.abs(deltaY) < 150) {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (maxScroll > 0) {
            targetScrollY += deltaY * 1.8; // Scroll multiplier
            targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));
          }
        }
      }
      lastClientY = e.clientY;
    };

    const handleScroll = () => {
      if (!isAnimatingScroll) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
      }
    };

    const handleMouseLeaveWindow = () => {
      lastClientY = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeaveWindow);

    // Ink particle spawner
    let lastParticleTime = 0;
    const spawnInkParticle = (x, y) => {
      const now = Date.now();
      if (now - lastParticleTime < 45) return;
      lastParticleTime = now;

      const p = document.createElement("div");
      p.className = "fixed pointer-events-none rounded-full bg-gradient-to-tr from-[#d87f4a] to-amber-200 z-[999999]";
      const size = Math.random() * 3.5 + 2.5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.filter = "blur(0.5px) drop-shadow(0 0 3px rgba(216, 127, 74, 0.55))";
      p.style.opacity = "0.85";

      document.body.appendChild(p);

      gsap.to(p, {
        y: `+=${Math.random() * 22 + 10}`,
        x: `+=${Math.random() * 12 - 6}`,
        scale: 0.15,
        opacity: 0,
        duration: 0.75,
        ease: "power2.out",
        onComplete: () => p.remove()
      });
    };

    // Animation Tick Loop
    const tick = () => {
      const ease = 0.14;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      speedX = currentX - lastX;
      lastX = currentX;

      const rotation = Math.max(-14, Math.min(14, speedX * 1.6));

      // Translate Pen Container
      gsap.set(cursor, {
        x: currentX,
        y: currentY,
        rotation: rotation,
        transformOrigin: "0px 0px"
      });

      if (Math.abs(speedX) > 1.2) {
        spawnInkParticle(currentX, currentY);
      }

      // Smooth scroll interpolation
      const scrollEase = 0.08;
      if (Math.abs(targetScrollY - currentScrollY) > 0.5) {
        currentScrollY += (targetScrollY - currentScrollY) * scrollEase;
        isAnimatingScroll = true;
        window.scrollTo(window.scrollX, currentScrollY);
        isAnimatingScroll = false;
      }

      requestAnimationFrame(tick);
    };

    const animId = requestAnimationFrame(tick);

    // Hover elements checker
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isClickable = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-pointer") ||
        target.getAttribute("role") === "button";

      setIsHoveringClickable(!!isClickable);
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "40px",
        height: "40px",
        pointerEvents: "none",
        zIndex: 999999,
        transformStyle: "preserve-3d",
        willChange: "transform",
        opacity: isHoveringIframe ? 0 : 1,
        transition: "opacity 0.25s ease"
      }}
      className="select-none pointer-events-none"
    >
      {/* 3D Glowing Hover Circle behind the Nib */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)"
        }}
        className={`w-4 h-4 rounded-full bg-amber-500/20 filter blur-sm border border-amber-600/30 transition-all duration-300 scale-0 ${
          isHoveringClickable ? "scale-[1.8] opacity-100 bg-[#d87f4a]/25 border-[#d87f4a]/45" : "opacity-0"
        }`}
      />

      {/* Handcrafted Vector Quill Pen SVG */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: "-40px",
          left: 0,
          transform: isHoveringClickable ? "scale(1.1) rotate(-8deg)" : "scale(1)",
          transformOrigin: "bottom left",
          transition: "transform 0.25s ease-out"
        }}
      >
        <defs>
          <linearGradient id="quillFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5EFEB" />
            <stop offset="60%" stopColor="#d87f4a" />
            <stop offset="100%" stopColor="#8C4E35" />
          </linearGradient>
          <linearGradient id="quillNibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6C687" />
            <stop offset="100%" stopColor="#9C7839" />
          </linearGradient>
        </defs>

        <path
          d="M 6 34 C 10 28, 15 19, 23 11 C 29 7, 34 5, 38 2 C 34 11, 29 17, 21 23 C 14 29, 10 32, 6 34 Z"
          fill="url(#quillFeatherGrad)"
          stroke="#8C4E35"
          strokeWidth="0.35"
        />
        <path
          d="M 6 34 C 8 31, 13 24, 19 18 C 25 12, 30 8, 38 2 C 32 6, 26 12, 17 18 C 11 24, 8 29, 6 34 Z"
          fill="#8C4E35"
          opacity="0.18"
        />

        <path
          d="M 2 38 C 10 30, 20 20, 38 2"
          stroke="#8C4E35"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <path
          d="M 0 40 L 4 36 L 6 34 L 2 38 Z"
          fill="url(#quillNibGrad)"
        />
        <path
          d="M 0 40 L 4 36 M 2 38 L 4 40"
          stroke="#5C3B1E"
          strokeWidth="0.8"
        />
        <line
          x1="0"
          y1="40"
          x2="2.5"
          y2="37.5"
          stroke="#2D1908"
          strokeWidth="0.65"
        />
      </svg>
    </div>
  );
};

export default CustomCursor;
