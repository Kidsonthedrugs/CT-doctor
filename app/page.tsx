"use client"

import { useState } from "react"
import { HealthCheckForm } from "@/components/health-check-form"
import { AnalysisResult } from "@/components/analysis-result"

export default function Home() {
  const [result, setResult] = useState<string | null>(null)
  const [username, setUsername] = useState<string>("")

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {!result ? (
        <div className="w-full max-w-2xl text-center space-y-12 animate-in fade-in zoom-in duration-700">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-neon-green to-cyan-400 bg-clip-text text-transparent tracking-tighter">
              Crypto Twitter
              <br />
              Health Check 🚀
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-medium max-w-lg mx-auto">
              Get your full CT performance report – powered by Grok
            </p>
          </div>

          <div className="glass-card p-8 md:p-12 rounded-[2.5rem]">
            <HealthCheckForm
              onResult={(text, user) => {
                setResult(text)
                setUsername(user)
              }}
            />
          </div>
        </div>
      ) : (
        <AnalysisResult content={result} username={username} onReset={() => setResult(null)} />
      )}

      <footer className="mt-16 text-white/40 text-sm flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <span>Powered by Grok</span>
        <span className="hidden md:inline">•</span>
        <span>Made with ❤️</span>
        <span className="hidden md:inline">•</span>
        <span>
          built by{" "}
          <a
            href="https://x.com/0xdierich"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-green hover:underline font-bold"
          >
            @0xdierich
          </a>
        </span>
      </footer>
    </main>
  )
}
