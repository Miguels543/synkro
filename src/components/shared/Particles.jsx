import { useEffect, useMemo, useState, memo } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

const ParticlesBackground = memo(function ParticlesBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  const options = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 120, duration: 0.4 },
        push: { quantity: 4 },
      },
    },
    particles: {
      color: { value: "#00f3ff" },
      links: {
        color: "#00f3ff",
        distance: 130,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        bounce: true,
      },
      number: { value: 500, density: { enable: true } },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 4 } },
    },
    detectRetina: true,
  }), [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      options={options}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  )
})

export default ParticlesBackground