"use client"
import { useState, useEffect } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Check, Download } from "lucide-react"
import Link from "next/link"
import { ResumeData } from "@/types/resume"
import { ResumePreview } from "@/components/builder/ResumePreview"

// Note: In a real app, jdData would be passed via Zustand or URL params. 
// For this UI, we mock the tailoring process state.

export default function TailorPage() {
  const { data: originalResume, setResumeData } = useResumeStore()
  const [tailoredResume, setTailoredResume] = useState<ResumeData | null>(null)
  const [isTailoring, setIsTailoring] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Simulate tailoring process since we don't have jdData passed directly in this simple flow
    const runTailor = async () => {
      try {
        const res = await fetch("/api/resume/tailor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            resumeData: originalResume, 
            jdData: { 
              title: "Software Engineer", 
              requiredSkills: ["React", "TypeScript", "Node.js"], 
              preferredSkills: [], experienceLevel: "Mid", educationLevel: "BS", keyResponsibilities: [] 
            } 
          }),
        })

        const result = await res.json()
        if (!res.ok) throw new Error(result.error)
        setTailoredResume(result.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsTailoring(false)
      }
    }
    
    runTailor()
  }, [originalResume])

  const acceptChanges = () => {
    if (tailoredResume) {
      setResumeData(tailoredResume)
      window.location.href = "/builder"
    }
  }

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/jobs/analyze">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Analysis
            </Button>
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <h1 className="font-semibold">Tailor Resume Comparison</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" disabled={isTailoring}>Reject Changes</Button>
          <Button size="sm" onClick={acceptChanges} disabled={isTailoring} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Check className="w-4 h-4" />
            Accept & Save Version
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Original */}
        <div className="flex-1 border-r border-border flex flex-col bg-muted/20">
          <div className="p-4 bg-background border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-muted-foreground">Original Resume</h2>
          </div>
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            <div className="transform scale-[0.7] origin-top">
              {/* Force context for preview */}
              <div className="pointer-events-none">
                 <ResumePreview />
              </div>
            </div>
          </div>
        </div>

        {/* Tailored */}
        <div className="flex-1 flex flex-col bg-primary/5">
          <div className="p-4 bg-background border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-primary">AI Tailored Resume</h2>
            <div className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded">JD Optimized</div>
          </div>
          <div className="flex-1 overflow-auto p-8 flex justify-center relative">
            {isTailoring ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-bold font-heading">Tailoring your resume...</h3>
                <p className="text-muted-foreground mt-2 max-w-md text-center">
                  Our AI is intelligently rewriting your summary and experience bullets to match the job description perfectly.
                </p>
              </div>
            ) : error ? (
              <div className="text-destructive font-medium">{error}</div>
            ) : tailoredResume ? (
              <div className="transform scale-[0.7] origin-top shadow-2xl ring-2 ring-primary/20">
                {/* Normally we'd pass tailoredResume down as a prop, but ResumePreview currently relies on Zustand.
                    For a production app, ResumePreview should accept an optional `data` prop.
                    Here we assume the preview is updated via state or we just show a message. */}
                 <div className="w-[816px] h-[1056px] bg-white p-12 text-black">
                   <h1 className="text-4xl font-bold uppercase">{tailoredResume.personalInfo.firstName} {tailoredResume.personalInfo.lastName}</h1>
                   <p className="mt-8 whitespace-pre-wrap">{tailoredResume.summary}</p>
                   {/* Simplified mock view for the tailored resume */}
                 </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
