'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useGSAP } from '@/hooks/useGSAP'
import { fadeInUp } from '@/lib/utils/animations'

export function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useGSAP(sectionRef, fadeInUp)

  return (
    <section id="showcase" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={sectionRef} className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            See it in action
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Experience the platform that's redefining modern blogging
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ShowcaseCard
            title="Feed Experience"
            description="Instagram-like infinite scroll with smooth interactions"
            gradient="from-violet-500/20 to-purple-500/20"
          />
          <ShowcaseCard
            title="Profile Management"
            description="Complete control over your digital presence"
            gradient="from-blue-500/20 to-cyan-500/20"
          />
          <ShowcaseCard
            title="Content Creation"
            description="Powerful editor that gets out of your way"
            gradient="from-pink-500/20 to-rose-500/20"
          />
          <ShowcaseCard
            title="Discovery & Search"
            description="Find the content you love, instantly"
            gradient="from-amber-500/20 to-orange-500/20"
          />
        </div>
      </div>
    </section>
  )
}

function ShowcaseCard({ title, description, gradient }: any) {
  const cardRef = useRef<HTMLDivElement>(null)
  useGSAP(cardRef, fadeInUp)

  return (
    <div
      ref={cardRef}
      className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]" />
      
      <div className="relative h-full flex flex-col justify-end p-8">
        <h3 className="text-3xl font-bold mb-2">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  )
}
