import { useEffect, useRef } from 'react'

function WeatherBackground({ weatherCode, theme }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animRef = useRef(null)

  const getWeatherType = (code) => {
    if (!code) return 'clear'
    if (code >= 200 && code < 300) return 'thunder'
    if (code >= 300 && code < 600) return 'rain'
    if (code >= 600 && code < 700) return 'snow'
    if (code >= 700 && code < 800) return 'fog'
    if (code === 800) return 'clear'
    if (code > 800) return 'cloudy'
    return 'clear'
  }

  const typeRef = useRef(getWeatherType(weatherCode))
  if (weatherCode && getWeatherType(weatherCode) !== 'clear' && getWeatherType(weatherCode) !== 'cloudy') {
    typeRef.current = getWeatherType(weatherCode)
  }
  const type = typeRef.current

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    particlesRef.current = []

    const createParticles = () => {
      const count = type === 'snow' ? 80 : type === 'rain' ? 120 : type === 'fog' ? 30 : 0
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: type === 'rain' ? 8 + Math.random() * 6 : type === 'snow' ? 1 + Math.random() * 2 : 0.3 + Math.random() * 0.5,
          size: type === 'rain' ? 1 : type === 'snow' ? 2 + Math.random() * 3 : 20 + Math.random() * 40,
          opacity: type === 'fog' ? 0.03 + Math.random() * 0.05 : 0.4 + Math.random() * 0.4,
          wind: type === 'rain' ? 1 + Math.random() * 2 : type === 'snow' ? Math.sin(Math.random() * Math.PI) * 0.5 : 0,
          length: type === 'rain' ? 15 + Math.random() * 10 : 0
        })
      }
    }

    createParticles()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(p => {
        ctx.beginPath()
        ctx.globalAlpha = p.opacity

        if (type === 'rain') {
          ctx.strokeStyle = theme === 'light' ? 'rgba(1, 1, 37, 0.6)' : '#a8d8ea'
          ctx.lineWidth = 1
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.wind, p.y + p.length)
          ctx.stroke()
          p.x += p.wind
          p.y += p.speed
          if (p.y > canvas.height) {
            p.y = -20
            p.x = Math.random() * canvas.width
          }
        } else if (type === 'snow') {
          ctx.fillStyle = 'white'
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          p.x += p.wind
          p.y += p.speed
          if (p.y > canvas.height) {
            p.y = -10
            p.x = Math.random() * canvas.width
          }
        } else if (type === 'fog') {
          ctx.fillStyle = 'white'
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          p.x += p.speed
          if (p.x > canvas.width + p.size) {
            p.x = -p.size
          }
        }

        ctx.globalAlpha = 1
      })

      if (type === 'thunder') {
        if (Math.random() < 0.005) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    if (['rain', 'snow', 'fog', 'thunder'].includes(type)) {
      draw()
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [type, theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  )
}

export default WeatherBackground