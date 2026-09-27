"use client";
import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CareerRole } from "@/lib/ai/careerMatcher";

export default function CareerMatchPage() {
  const { data: resumeData } = useResumeStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<CareerRole[] | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/career/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setRoles(data.roles);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 relative">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-2xl blur opacity-20" />
        <div className="relative bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl">
          <h2 className="text-4xl font-bold font-heading tracking-tight mb-3 text-white">
            Career{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
              Compass
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Discover which job roles perfectly align with your current skills
            and experience, powered by AI.
          </p>
        </div>
      </div>

      {!roles ? (
        <Card className="border-dashed border-2 border-slate-700 bg-slate-900/40 hover:bg-slate-900/60 transition-colors backdrop-blur-sm rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-16 flex flex-col items-center text-center space-y-8 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform duration-500">
              <Target className="w-12 h-12 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold font-heading mb-3 text-white">
                Analyze Your Profile
              </h3>
              <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
                Our AI will scan your resume and match you against
                industry-standard roles, identifying your strengths and gaps.
              </p>
            </div>
            {error && (
              <div className="text-red-400 font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="lg"
              className="h-14 px-10 text-lg rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 border-none transition-all hover:scale-105"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Analyzing Matrix...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> Find My Matches
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold font-heading text-white flex items-center gap-3">
              <Target className="w-8 h-8 text-indigo-400" />
              Your Top Matches
            </h3>
            <Button
              variant="outline"
              onClick={() => setRoles(null)}
              className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Re-Analyze
            </Button>
          </div>

          <div className="grid gap-8">
            {roles.map((role, i) => (
              <Card
                key={i}
                className="overflow-hidden bg-slate-900/60 border-slate-800 rounded-3xl shadow-xl backdrop-blur-md"
              >
                <CardHeader
                  className={`border-b border-slate-800 ${role.matchLevel === "Strong" ? "bg-emerald-500/10" : role.matchLevel === "Partial" ? "bg-amber-500/10" : "bg-red-500/10"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl mb-2 text-white font-bold">
                        {role.role}
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-base">
                        {role.matchLevel === "Strong" &&
                          "You are a fantastic fit for this role. Only minor tweaks needed."}
                        {role.matchLevel === "Partial" &&
                          "You have the foundation, but need some upskilling and tailored positioning."}
                        {role.matchLevel === "Low" &&
                          "Significant upskilling required for this role."}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        role.matchLevel === "Strong" ? "default" : "secondary"
                      }
                      className={`px-4 py-1.5 text-sm font-bold shadow-lg ${
                        role.matchLevel === "Strong"
                          ? "bg-emerald-500 text-white shadow-emerald-500/20"
                          : role.matchLevel === "Partial"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {role.matchLevel} Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />{" "}
                        Matching Skills
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {role.matchingSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-medium shadow-sm shadow-emerald-500/5"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" />{" "}
                        Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {role.missingSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1 font-medium shadow-sm shadow-red-500/5"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-slate-950/50 border border-slate-800/80 p-6 rounded-2xl">
                      <h4 className="flex items-center gap-2 font-bold mb-3 text-indigo-300">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        Learning Path
                      </h4>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {role.suggestedLearningPath}
                      </p>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/80 p-6 rounded-2xl">
                      <h4 className="flex items-center gap-2 font-bold mb-3 text-purple-300">
                        <AlertCircle className="w-5 h-5 text-purple-400" />
                        Resume Improvements
                      </h4>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {role.resumeImprovements}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
