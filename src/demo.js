import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lenis for smooth scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  // Sync GSAP ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Canvas Setup
  const canvas = document.getElementById('demo-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');

  const frameCount = 192;
  // Use /frames/hub/ because it will be served from public directory by Vite
  const currentFrame = (index) => (
    `/frames/hub/avhub${String(86400 + index - 1).padStart(8, '0')}.jpg`
  );

  const images = [];
  const sequence = {
    frame: 1
  };
  
  let loadedImages = 0;
  const loadingIndicator = document.getElementById('loading-indicator');
  const loadingText = document.getElementById('loading-text');

  // Load first frame ASAP to get dimensions
  const firstImage = new Image();
  firstImage.src = currentFrame(1);
  firstImage.onload = () => {
    images[0] = firstImage;
    loadedImages++;
    checkLoadComplete();
    preloadRest();
  };
  firstImage.onerror = () => {
    console.error('Failed to load first frame');
    loadedImages++;
    preloadRest();
  };

  function preloadRest() {
    for (let i = 2; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        images[i - 1] = img;
        loadedImages++;
        checkLoadComplete();
      };
      // In case of error, still count it so we don't hang
      img.onerror = () => {
        loadedImages++;
        checkLoadComplete();
      };
    }
  }

  function checkLoadComplete() {
    const progress = Math.floor((loadedImages / frameCount) * 100);
    if (loadingText) loadingText.innerText = `Loading... ${progress}%`;
    
    if (loadedImages === frameCount) {
      if (loadingIndicator) {
        loadingIndicator.style.opacity = 0;
        setTimeout(() => loadingIndicator.remove(), 500);
      }
      initAnimation();
    }
  }

  // Draw the image maintaining aspect ratio and covering the canvas (object-fit: cover)
  function render(img = images[sequence.frame - 1]) {
    if (!img) return;

    // Wait until image has dimensions
    if (img.width === 0 || img.height === 0) return;

    // Set canvas dimensions to the true native resolution of the image
    // CSS object-fit: cover will handle scaling it up beautifully via the browser's compositor
    if (canvas.width !== img.width || canvas.height !== img.height) {
      canvas.width = img.width;
      canvas.height = img.height;
    }

    // Use good image smoothing
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
  }

  function initAnimation() {
    // Initial render
    render();

    // Re-render on resize
    window.addEventListener('resize', () => {
      render();
    });

    // Hide hero content initially
    const heroContent = document.querySelector('.hero-container');
    if (heroContent) {
      gsap.set(heroContent, { opacity: 0, y: 40 });
    }

    // GSAP ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#home-hero",
        start: "top top",
        end: "+=3000", // Increased scroll distance to accommodate the fade-to-black
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1
      }
    });

    // 1. Scrub through frames
    tl.to(sequence, {
      frame: frameCount,
      snap: "frame",
      ease: "none",
      duration: 5, // 5 parts of the timeline for the video
      onUpdate: () => {
        render();
      }
    });

    // 2. Fade in the hero text and buttons
    if (heroContent) {
      tl.to(heroContent, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out"
      });
    }

    // 3. Dim the background behind the text so it is clearly visible
    const blackOverlay = document.querySelector('.black-overlay');
    if (blackOverlay) {
      tl.to(blackOverlay, {
        opacity: 0.75, // Dim background instead of fully blacking it out
        duration: 1.5,
        ease: "power2.inOut"
      }, "<"); // Starts at the same time as the text fade-in
    }

    ScrollTrigger.refresh();
  }
});
