'use client';

import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  weatherCondition?: string;
  temperature?: number;
}

export default function AnimatedBackground({ weatherCondition, temperature }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const animationRef = useRef<number>();
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles based on weather condition
    const initParticles = () => {
      const newParticles = [];
      const particleCount = getParticleCount();

      for (let i = 0; i < particleCount; i++) {
        newParticles.push(createParticle(canvas.width, canvas.height));
      }

      setParticles(newParticles);
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        updateParticle(particle, canvas.width, canvas.height);
        drawParticle(ctx, particle);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, weatherCondition, temperature]);

  const getParticleCount = () => {
    switch (weatherCondition) {
      case 'rain':
        return 200;
      case 'snow':
        return 150;
      case 'mist':
        return 100;
      case 'clouds':
        return 80;
      default:
        return 60;
    }
  };

  const createParticle = (width: number, height: number) => {
    const particle = {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: getParticleColor(),
      type: getParticleType(),
      life: 1,
      maxLife: Math.random() * 200 + 100,
    };

    // Adjust particle behavior based on weather
    if (weatherCondition === 'rain') {
      particle.vy = Math.random() * 5 + 2;
      particle.vx = (Math.random() - 0.5) * 1;
      particle.size = Math.random() * 2 + 1;
    } else if (weatherCondition === 'snow') {
      particle.vy = Math.random() * 2 + 0.5;
      particle.vx = (Math.random() - 0.5) * 0.5;
      particle.size = Math.random() * 4 + 2;
    } else if (weatherCondition === 'mist') {
      particle.vy = (Math.random() - 0.5) * 0.5;
      particle.vx = (Math.random() - 0.5) * 0.5;
      particle.size = Math.random() * 8 + 4;
      particle.opacity = Math.random() * 0.3 + 0.1;
    }

    return particle;
  };

  const getParticleColor = () => {
    if (weatherCondition === 'rain') {
      return '#3B82F6'; // Bright blue for rain
    } else if (weatherCondition === 'snow') {
      return '#F8FAFC'; // Pure white for snow
    } else if (weatherCondition === 'mist') {
      return '#9CA3AF'; // Gray for mist
    } else if (weatherCondition === 'clouds') {
      return '#D1D5DB'; // Light gray for clouds
    } else if (temperature && temperature < 0) {
      return '#DBEAFE'; // Ice blue
    } else if (temperature && temperature > 35) {
      return '#FEF3C7'; // Warm yellow
    } else if (temperature && temperature > 25) {
      return '#FDE047'; // Golden yellow
    } else if (temperature && temperature < 10) {
      return '#BAE6FD'; // Cool blue
    } else {
      return '#7DD3FC'; // Sky blue for clear weather
    }
  };
  // weatherCondition = "snow";
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const API_key = '691ff23b4f028e2cb9de59020dcd0520';
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
            )
              .then((res) => {
                if (!res.ok) {
                  throw new Error('Failed to fetch weather data');
                }
                return res.json();
              })
              .then((data) => {
                weatherCondition = data.weather[0].main.toLowerCase();
                setWeather(data);
              })
              .catch((err) => {
                console.log(err.message);
              });
          },
          (err) => {
            console.log('Location access denied.');
          }
        );
      } else {
        console.log('Geolocation is not supported in this browser.');
      }
  const getParticleType = () => {
    switch (weatherCondition) {
      case 'rain':
        return 'line';
      case 'snow':
        return 'star';
      case 'mist':
        return 'circle';
      default:
        return 'circle';
    }
  };

  const updateParticle = (particle: any, width: number, height: number) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life--;

    // Reset particle when it goes off screen or dies
    if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height || particle.life <= 0) {
      particle.x = Math.random() * width;
      particle.y = weatherCondition === 'rain' ? -10 : Math.random() * height;
      particle.life = particle.maxLife;
      particle.opacity = Math.random() * 0.8 + 0.2;
    }

    // Add some floating motion
    particle.vy += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.01;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: any) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;

    if (particle.type === 'line') {
      // Draw rain drop
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x, particle.y + particle.size * 2);
      ctx.lineWidth = particle.size;
      ctx.strokeStyle = particle.color;
      ctx.stroke();
    } else if (particle.type === 'star') {
      // Draw snowflake
      drawStar(ctx, particle.x, particle.y, particle.size, particle.size * 0.5, 6);
    } else {
      // Draw circle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, outerRadius: number, innerRadius: number, points: number) => {
    const angle = Math.PI / points;
    ctx.beginPath();

    for (let i = 0; i < 2 * points; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const currentAngle = i * angle;
      const px = x + Math.cos(currentAngle) * radius;
      const py = y + Math.sin(currentAngle) * radius;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.closePath();
    ctx.fill();
  };

  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradient background based on weather */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: getBackgroundGradient(),
        }}
      />

      {/* Animated particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" />
    </div>
  );

  function getBackgroundGradient() {
    // Weather-specific gradients with more vibrant, weather-appropriate colors
    if (weatherCondition === 'rain') {
      return 'linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)';
    } else if (weatherCondition === 'snow') {
      return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)';
    } else if (weatherCondition === 'mist') {
      return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 25%, #d1d5db 50%, #e5e7eb 75%, #f3f4f6 100%)';
    } else if (weatherCondition === 'clouds') {
      return 'linear-gradient(135deg, #374151 0%, #4b5563 25%, #6b7280 50%, #9ca3af 75%, #d1d5db 100%)';
    } else if (temperature && temperature < 0) {
      return 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)';
    } else if (temperature && temperature > 35) {
      return 'linear-gradient(135deg, #dc2626 0%, #ea580c 25%, #f59e0b 50%, #fbbf24 75%, #fde047 100%)';
    } else if (temperature && temperature > 25) {
      return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 25%, #fde047 50%, #fef3c7 75%, #fefce8 100%)';
    } else if (temperature && temperature < 10) {
      return 'linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)';
    } else {
      // Default clear sky gradient
      return 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 25%, #7dd3fc 50%, #bae6fd 75%, #e0f2fe 100%)';
    }
  }
}
