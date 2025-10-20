'use client'

import { useEffect } from 'react'

export function useSmoothScroll() {
  useEffect(() => {
    let scrollY = window.scrollY
    let targetY = window.scrollY
    let animationFrame: number

    const smoothScroll = () => {
      scrollY += (targetY - scrollY) * 0.1
      window.scrollTo(0, scrollY)
      
      if (Math.abs(targetY - scrollY) > 0.5) {
        animationFrame = requestAnimationFrame(smoothScroll)
      }
    }

    const handleScroll = () => {
      targetY = window.scrollY
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(smoothScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [])
}
