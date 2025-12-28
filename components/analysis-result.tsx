"use client"

import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface AnalysisResultProps {
  content: string
  username: string
  onReset: () => void
}

export function AnalysisResult({ content, username, onReset }: AnalysisResultProps) {
  // Extract score if possible (looks for "SCORE: XX/100" or "Score: XX/100" or just numbers)
  const scoreMatch = content.match(/(?:SCORE|Score):\s*(\d+)\/100/i) || content.match(/(\d+)\/100/)
  const score = scoreMatch ? scoreMatch[1] : "??"

  return (
    <div className="w-full max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-start items-center mb-6 print:hidden">
        <Button variant="ghost" onClick={onReset} className="text-white/60 hover:text-neon-green hover:bg-white/5">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="glass-card rounded-3xl p-8 md:p-12 border-neon-green/20 relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">@{username.replace(/^@/, "")}</h2>
        </div>

        {/* Score Circle */}
        <div className="flex justify-center mb-12">
          <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-4 border-neon-green/30 bg-black/40 shadow-[0_0_30px_rgba(0,255,157,0.3)]">
            <div className="absolute inset-2 rounded-full border border-neon-green/20 animate-pulse" />
            <div className="text-center">
              <span className="text-6xl font-black text-neon-green neon-glow leading-none">{score}</span>
              <div className="text-xs text-white/40 font-bold tracking-widest uppercase mt-2">/100</div>
            </div>
          </div>
        </div>

        <div
          className="prose prose-invert max-w-none 
          prose-headings:text-neon-green prose-headings:font-black prose-headings:tracking-wide prose-headings:mb-4
          prose-h2:text-2xl prose-h3:text-xl
          prose-strong:text-neon-green prose-strong:font-bold
          prose-p:text-white/80 prose-p:leading-relaxed prose-p:text-base
          prose-li:text-white/70 prose-li:leading-relaxed
          prose-ul:list-none prose-ul:space-y-2
          prose-li:before:content-['●'] prose-li:before:text-neon-green prose-li:before:mr-3 prose-li:before:font-bold"
        >
          <ReactMarkdown>{content.replace(/(?:SCORE|Score):.*\/100/i, "")}</ReactMarkdown>
        </div>

        <div className="mt-12 pt-8 border-t border-neon-green/20 text-center bg-gradient-to-b from-neon-green/5 to-transparent -mx-8 -mb-8 p-8 rounded-b-3xl">
          <div className="max-w-2xl mx-auto">
            <div className="text-neon-green/40 text-4xl mb-2">"</div>
            <p className="text-white/60 italic text-lg leading-relaxed">
              Your crypto health is a reflection of your convictions. Stay solvent, stay humble.
            </p>
            <div className="text-neon-green/40 text-4xl mt-2">"</div>
          </div>
        </div>
      </div>
    </div>
  )
}
