"use client"
import { useState } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Target, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CareerRole } from "@/lib/ai/careerMatcher"

export default function CareerMatchPage() {
  const { data: resumeData } = useResumeStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [roles, setRoles] = useState<CareerRole[] | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError("")

    try {
      const res = await fetch("/api/career/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Analysis failed")
      
      setRoles(data.roles)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight mb-2">Career Compass</h2>
        <p className="text-muted-foreground text-lg">
          Discover which job roles perfectly align with your current skills and experience.
        </p>
      </div>

      {!roles ? (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading mb-2">Analyze Your Profile</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our AI will scan your resume and match you against industry-standard roles, identifying your strengths and gaps.
              </p>
            </div>
            {error && <div className="text-destructive font-medium">{error}</div>}
            <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg" className="h-12 px-8">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finding perfect matches...
                </>
              ) : "Find My Matches"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-heading">Your Top Matches</h3>
            <Button variant="outline" onClick={() => setRoles(null)}>Re-Analyze</Button>
          </div>

          <div className="grid gap-6">
            {roles.map((role, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className={`border-b ${role.matchLevel === 'Strong' ? 'bg-emerald-500/5 border-emerald-500/20' : role.matchLevel === 'Partial' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-destructive/5 border-destructive/20'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{role.role}</CardTitle>
                      <CardDescription>
                        {role.matchLevel === 'Strong' && "You are a great fit for this role."}
                        {role.matchLevel === 'Partial' && "You have the foundation, but need some upskilling."}
                        {role.matchLevel === 'Low' && "Significant upskilling required for this role."}
                      </CardDescription>
                    </div>
                    <Badge variant={role.matchLevel === 'Strong' ? 'default' : 'secondary'} className={
                      role.matchLevel === 'Strong' ? 'bg-emerald-500 hover:bg-emerald-600' :
                      role.matchLevel === 'Partial' ? 'bg-amber-500/20 text-amber-700' :
                      'bg-destructive/10 text-destructive'
                    }>
                      {role.matchLevel} Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Matching Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.matchingSkills.map(skill => (
                          <Badge key={skill} variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Missing Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.missingSkills.map(skill => (
                          <Badge key={skill} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="flex items-center gap-2 font-semibold mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Learning Path
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">{role.suggestedLearningPath}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="flex items-center gap-2 font-semibold mb-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Resume Improvements
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">{role.resumeImprovements}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
