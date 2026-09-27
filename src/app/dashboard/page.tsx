import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Upload,
  Activity,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20" />
        <div className="relative bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl">
          <h2 className="text-4xl font-bold font-heading tracking-tight mb-3 text-white">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Alex
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Your career progression and resume health look excellent today. You
            have 2 optimized resumes and 1 active job match.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/builder" className="block group">
          <Card className="border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all cursor-pointer border-dashed border-2 h-full rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[180px] space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
                <Plus className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <div className="font-bold text-lg text-white mb-1">
                  Create New Resume
                </div>
                <div className="text-sm text-slate-400">
                  Start from scratch with AI
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/upload" className="block group">
          <Card className="border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 transition-all cursor-pointer border-2 h-full rounded-3xl overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[180px] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-slate-300" />
              </div>
              <div>
                <div className="font-bold text-lg text-white mb-1">
                  Upload Existing
                </div>
                <div className="text-sm text-slate-400">
                  Import your PDF resume
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/jobs/analyze" className="block group">
          <Card className="border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 transition-all cursor-pointer border-2 h-full rounded-3xl overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[180px] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <div className="font-bold text-lg text-white mb-1">
                  Match Job
                </div>
                <div className="text-sm text-slate-400">
                  Analyze ATS compatibility
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Recent Resumes
            </h3>
            <Link href="/dashboard/resumes">
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800/60 rounded-3xl overflow-hidden group">
              <CardHeader className="pb-4 border-b border-slate-800/40 bg-slate-800/20">
                <CardTitle className="text-xl text-white">
                  Software Engineer
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Updated 2 days ago
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-sm mb-6 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold tracking-wide">
                    ATS Score: 85/100
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link href="/builder" className="block w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-xl border-slate-700 text-white hover:bg-slate-800"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Link href="/builder" className="block w-full">
                    <Button
                      size="sm"
                      className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                    >
                      Download
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800/60 rounded-3xl overflow-hidden group">
              <CardHeader className="pb-4 border-b border-slate-800/40 bg-slate-800/20">
                <CardTitle className="text-xl text-white">
                  Data Analyst
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Updated 1 week ago
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-sm mb-6 bg-amber-500/10 w-fit px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-semibold tracking-wide">
                    ATS Score: 62/100
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link href="/builder" className="block w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-xl border-slate-700 text-white hover:bg-slate-800"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Link href="/builder" className="block w-full">
                    <Button
                      size="sm"
                      className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                    >
                      Download
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Recent Job Analyses
            </h3>
          </div>
          <div className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800/60 rounded-2xl hover:border-slate-700 transition-colors">
              <CardContent className="p-5">
                <div className="font-bold text-white text-lg mb-1">
                  Frontend Developer @ Vercel
                </div>
                <div className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Matched with: Software Eng
                  Resume
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold shadow-sm shadow-emerald-500/10">
                    88% Match
                  </span>
                  <Link href="/dashboard/jobs/analyze">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-indigo-400 hover:text-indigo-300"
                    >
                      View Report <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800/60 rounded-2xl hover:border-slate-700 transition-colors">
              <CardContent className="p-5">
                <div className="font-bold text-white text-lg mb-1">
                  Fullstack Engineer @ Stripe
                </div>
                <div className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Matched with: Software Eng
                  Resume
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg font-bold shadow-sm shadow-amber-500/10">
                    65% Match
                  </span>
                  <Link href="/dashboard/jobs/analyze">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-indigo-400 hover:text-indigo-300"
                    >
                      View Report <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
