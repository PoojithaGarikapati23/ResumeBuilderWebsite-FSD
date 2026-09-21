"use client"
import { useState } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { JobDescriptionData } from "@/lib/ai/jdParser"
import { ATSAnalysisResult } from "@/lib/ai/atsAnalyzer"
import { Badge } from "@/components/ui/badge"

export default function AnalyzeJobPage() {
  const { data: resumeData } = useResumeStore()
  const [jdText, setJdText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<{ jd: JobDescriptionData; analysis: ATSAnalysisResult } | null>(null)

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setError("Please paste a job description first.")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawJdText: jdText, resumeData }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Analysis failed")
      
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight mb-2">Analyze Job Description</h2>
        <p className="text-muted-foreground text-lg">
          Paste a job description to instantly see how well your current resume matches it.
        </p>
      </div>

      {!result ? (
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle>Paste Job Description</CardTitle>
            <CardDescription>We will extract the required skills and compare them to your resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[300px] text-base"
            />
            {error && <div className="text-destructive text-sm mt-3 font-medium">{error}</div>}
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border px-6 py-4">
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !jdText.trim()} className="w-full sm:w-auto h-12 px-8 text-base">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Match...
                </>
              ) : "Analyze Resume Match"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-heading">ATS Match Results</h3>
            <Button variant="outline" onClick={() => setResult(null)}>Analyze Another Job</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 border-primary/20 bg-primary/5">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full space-y-2">
                <div className="text-sm font-medium text-primary uppercase tracking-wider mb-2">Overall Score</div>
                <div className="text-6xl font-bold text-primary font-heading tracking-tighter">
                  {result.analysis.overallScore}<span className="text-3xl text-primary/60">/100</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  *Internal compatibility estimate based on keywords and experience.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{result.jd.title}</CardTitle>
                <CardDescription>{result.jd.company || "Unknown Company"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Experience Match</h4>
                  <p className="text-sm">{result.analysis.experienceMatch}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Education Match</h4>
                  <p className="text-sm">{result.analysis.educationMatch}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-500/20">
              <CardHeader className="bg-emerald-500/5 pb-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                  <CardTitle className="text-lg">Matched Skills</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {result.analysis.matchedSkills.length > 0 ? (
                    result.analysis.matchedSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No skills matched directly.</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader className="bg-destructive/5 pb-4">
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  <CardTitle className="text-lg">Missing Skills</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {result.analysis.missingSkills.length > 0 ? (
                    result.analysis.missingSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-destructive/10 text-destructive hover:bg-destructive/20">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">You hit all the key skills!</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-500">
                <AlertTriangle className="w-5 h-5" />
                <CardTitle>Actionable Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">{i + 1}</span>
                    <span className="mt-0.5 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t border-border pt-6 mt-6 bg-muted/30">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <Button className="w-full sm:w-auto gap-2">
                  <Sparkles className="w-4 h-4" />
                  Tailor Resume to This Job
                </Button>
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  Our AI will create a new, optimized version of your resume without altering the original.
                </p>
              </div>
            </CardFooter>
          </Card>

        </div>
      )}
    </div>
  )
}

// Ensure Sparkles is imported correctly
import { Sparkles } from "lucide-react"
