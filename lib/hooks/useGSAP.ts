'use client'

import { useEffect, RefObject } from 'react'

type AnimationFunction = (element: HTMLElement) => void

export function useGSAP(
  ref: RefObject<HTMLElement>,
  animation: AnimationFunction
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animation(el)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, animation])
}
