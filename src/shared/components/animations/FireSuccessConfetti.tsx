import confetti from "canvas-confetti";

export const fireSuccessConfetti = () => {
  const duration = 6 * 1000; 
  const animationEnd = Date.now() + duration;
  
  // Colores verdes: [Verde esmeralda, Verde lima, Verde oscuro, Blanco para brillo]
  const colors = ["#10b981", "#34d399", "#059669", "#ffffff"];

  const defaults = { 
    startVelocity: 30, 
    spread: 360, 
    ticks: 60, 
    zIndex: 2000,
    colors: colors // <--- Aquí inyectamos los colores verdes
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
    });
  }, 250);
};