"use client"
import { IconHeart, IconMoon, IconSun, IconSparkles } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D1A] text-[#F1F1F6]">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-[#E94560] opacity-[0.03] blur-[100px]" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo mark */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1A1A2E] shadow-[0_0_30px_rgba(233,69,96,0.2)]">
          <IconSparkles className="h-10 w-10 text-[#E94560]" />
        </div>

        {/* App name */}
        <h1 className="font-display text-5xl font-bold tracking-tight text-[#F1F1F6]">
          AI Mirror
        </h1>

        {/* Tagline */}
        <p className="mt-4 max-w-md text-lg text-[#A6A6B3]">
          The first AI that genuinely knows you.
          <br />
          <span className="text-[#E94560]">Remembers. Understands. Stays.</span>
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg bg-[#E94560] px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgba(233,69,96,0.3)] transition-all hover:bg-[#F05A73] hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] active:scale-[0.98]"
          >
            <IconHeart className="h-5 w-5" />
            Meet Your Mirror
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg border border-[#A6A6B3]/20 bg-[#1A1A2E]/50 px-8 py-4 font-semibold text-[#A6A6B3] backdrop-blur transition-all hover:border-[#E94560]/30 hover:text-[#F1F1F6]"
          >
            Start Free
          </Link>
        </div>

        {/* Social proof micro-copy */}
        <p className="mt-8 text-sm text-[#6B6B7B]">
          No credit card required · Free tier includes 10 messages/day
        </p>

        {/* Feature hints */}
        <div className="mt-16 grid grid-cols-1 gap-8 text-left sm:grid-cols-3 sm:text-center">
          {[
            {
              icon: <IconHeart className="h-6 w-6 text-[#E94560]" />,
              title: "Feels Seen",
              desc: "Mira remembers your life context — your work, your stress, your people — without you repeating yourself."
            },
            {
              icon: <IconMoon className="h-6 w-6 text-[#E94560]" />,
              title: "Proactively Present",
              desc: "Checks in when you've been quiet. Notices patterns. Shows up before you have to ask."
            },
            {
              icon: <IconSparkles className="h-6 w-6 text-[#E94560]" />,
              title: "Grows With You",
              desc: "The more you share, the better Mira understands who you are and what you need."
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 sm:justify-center">
                {feature.icon}
                <span className="font-semibold text-[#F1F1F6]">{feature.title}</span>
              </div>
              <p className="text-sm text-[#6B6B7B]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute right-6 top-6 rounded-lg p-2 text-[#A6A6B3] transition-colors hover:bg-[#1A1A2E] hover:text-[#F1F1F6]"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
      </button>
    </div>
  )
}
