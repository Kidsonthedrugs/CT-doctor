"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bitcoin } from "@/components/ui/bitcoin-icon"

interface HealthCheckFormProps {
  onResult: (result: string, username: string) => void
}

export function HealthCheckForm({ onResult }: HealthCheckFormProps) {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("[v0] API error:", errorData)
        alert(errorData.error || "Failed to analyze account. Please try again!")
        return
      }

      const data = await res.json()
      if (data.analysis) {
        onResult(data.analysis, username)
      } else {
        console.error("[v0] No analysis in response:", data)
        alert("No analysis returned. Please try again!")
      }
    } catch (error) {
      console.error("[v0] Analysis error:", error)
      alert("Network error. Please check your connection and try again!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleAnalyze} className="space-y-6 w-full max-w-md mx-auto">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-green/60 text-lg font-bold pointer-events-none">
          @
        </div>
        <Input
          type="text"
          placeholder="yourusername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-14 text-lg rounded-xl focus:ring-neon-green/50 focus:border-neon-green transition-all pl-9"
          disabled={isLoading}
        />
        <div className="absolute inset-0 rounded-xl bg-neon-green/5 blur-lg group-hover:bg-neon-green/10 transition-all -z-10" />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !username}
        className="w-full h-14 text-lg rounded-xl bg-transparent border-2 border-neon-green text-neon-green font-bold hover:bg-neon-green hover:text-black transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,157,0.5)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Bitcoin className="w-6 h-6 animate-[spin_2s_linear_infinite]" />
            <span>Analyzing your posts...</span>
          </div>
        ) : (
          <span className="relative z-10">Analyze My Account</span>
        )}
      </Button>
    </form>
  )
}
