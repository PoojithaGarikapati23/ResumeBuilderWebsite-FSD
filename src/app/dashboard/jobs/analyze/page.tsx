"use client";
import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  FileSearch,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { JobDescriptionData } from "@/lib/ai/jdParser";
import { ATSAnalysisResult } from "@/lib/ai/atsAnalyzer";
import { Badge } from "@/components/ui/badge";

export default function AnalyzeJobPage() {
  const { data: resumeData } = useResumeStore();
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    jd: JobDescriptionData;
    analysis: ATSAnalysisResult;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawJdText: jdText, resumeData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate circular progress dash array
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = result
    ? circumference - (result.analysis.overallScore / 100) * circumference
    : circumference;

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
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-2xl blur opacity-20" />
        <div className="relative bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold font-heading tracking-tight mb-3 text-white">
              ATS{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                Analyzer
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl">
              Paste a job description to instantly see how well your current
              resume matches the ATS criteria.
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <FileSearch className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>

      {!result ? (
        <Card className="bg-slate-900/60 border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-slate-800/60 bg-slate-950/40 p-8">
            <CardTitle className="text-2xl text-white">
              Paste Job Description
            </CardTitle>
            <CardDescription className="text-slate-400 text-base">
              We will extract the required skills and calculate your match
              score.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[350px] text-base bg-slate-950 border-slate-700 text-slate-200 placeholder:text-slate-600 focus-visible:ring-emerald-500/50 rounded-2xl p-6"
            />
            {error && (
              <div className="text-red-400 text-sm mt-4 font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-slate-950/40 border-t border-slate-800/60 px-8 py-6">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jdText.trim()}
              className="w-full sm:w-auto h-14 px-10 text-lg rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-lg shadow-emerald-600/25 border-none transition-all hover:scale-105"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Running ATS Algorithm...
                </>
              ) : (
                "Analyze Resume Match"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold font-heading text-white">
              Match Results
            </h3>
            <Button
              variant="outline"
              onClick={() => setResult(null)}
              className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Analyze Another Job
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-emerald-500/30 bg-emerald-950/20 rounded-3xl overflow-hidden relative shadow-xl shadow-emerald-900/10">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full space-y-6 relative z-10">
                <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest">
                  Overall ATS Score
                </div>

                {/* Animated Circular Score */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-800"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="text-emerald-400 transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-white tracking-tighter">
                      {result.analysis.overallScore}
                    </div>
                    <div className="text-emerald-400 font-bold text-sm">
                      /100
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  Based on semantic keyword matching, experience alignment, and
                  formatting heuristics.
                </p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-slate-900/60 border-slate-800 rounded-3xl shadow-xl backdrop-blur-md">
              <CardHeader className="border-b border-slate-800/60 bg-slate-950/40 p-8">
                <CardTitle className="text-3xl text-white mb-2">
                  {result.jd.title}
                </CardTitle>
                <CardDescription className="text-slate-400 text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />{" "}
                  {result.jd.company || "Target Company"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80">
                  <h4 className="font-bold text-sm text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />{" "}
                    Experience Match
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {result.analysis.experienceMatch}
                  </p>
                </div>
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80">
                  <h4 className="font-bold text-sm text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />{" "}
                    Education Match
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {result.analysis.educationMatch}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-emerald-500/20 bg-slate-900/60 rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10 p-6">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                  <CardTitle className="text-xl text-white">
                    Matched Keywords
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2.5">
                  {result.analysis.matchedSkills.length > 0 ? (
                    result.analysis.matchedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 font-medium shadow-sm"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      No skills matched directly.
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-slate-900/60 rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="bg-red-500/5 border-b border-red-500/10 p-6">
                <div className="flex items-center gap-3 text-red-400">
                  <XCircle className="w-6 h-6" />
                  <CardTitle className="text-xl text-white">
                    Missing Keywords
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2.5">
                  {result.analysis.missingSkills.length > 0 ? (
                    result.analysis.missingSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 font-medium shadow-sm"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      You hit all the key skills!
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/60 border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-800/60">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
                <CardTitle className="text-2xl text-white">
                  Actionable Recommendations
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ul className="space-y-4">
                {result.analysis.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 text-slate-300 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm shadow-inner shadow-amber-500/20">
                      {i + 1}
                    </span>
                    <span className="mt-1 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t border-slate-800/60 p-8 bg-slate-950/40">
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                <Button className="w-full sm:w-auto gap-2 h-14 px-8 text-lg rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 border-none transition-all hover:scale-105">
                  <Sparkles className="w-5 h-5" />
                  Tailor Resume with AI
                </Button>
                <p className="text-sm text-slate-400 text-center sm:text-left leading-relaxed">
                  Our AI will generate a tailored version of your resume
                  optimized specifically for this job description, without
                  modifying your original content.
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
