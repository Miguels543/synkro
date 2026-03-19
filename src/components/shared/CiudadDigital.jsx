import { useEffect, useRef } from "react"
import * as THREE from "three"
import FOG from "vanta/dist/vanta.fog.min"

function CiudadDigital() {
  const mountRef = useRef(null)
  const vantaRef = useRef(null)

  useEffect(() => {
    if (!vantaRef.current) {
      vantaRef.current = FOG({
        el: mountRef.current,
        THREE,
        highlightColor: 0x00f3ff,
        midtoneColor: 0x0066ff,
        lowlightColor: 0x8a2be2,
        baseColor: 0x000000,
        blurFactor: 0.2,
        zoom: 1,
        speed: 1.5,
      })
    }
    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy()
        vantaRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  )
}

export default CiudadDigital