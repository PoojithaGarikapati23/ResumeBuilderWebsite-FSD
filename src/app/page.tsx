import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  CheckCircle,
  Sparkles,
  TrendingUp,
  ChevronRight,
  MessageSquare,
  Briefcase,
  FileBadge2,
  LineChart,
  MoveRight,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans overflow-x-hidden selection:bg-pink-100 selection:text-pink-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Soft Dreamy Gradient Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] bg-pink-300/30 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] bg-purple-300/30 blur-[100px] rounded-full mix-blend-multiply opacity-60 animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-blue-200/40 blur-[140px] rounded-full mix-blend-multiply opacity-60 animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "2s" }}
          />
          <div className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] bg-orange-100/40 blur-[80px] rounded-full mix-blend-multiply opacity-80" />

          {/* Subtle curved lines (SVG background) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-slate-600 mb-8 font-medium text-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>Meet your new AI Career Assistant</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight mb-8 leading-[1.1] text-[#0A1A3A] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Grow your career <br className="hidden md:block" />
            with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              CareerCraft AI.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Build stronger resumes, check your ATS score, and get personalized
            AI-powered career guidance — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base group rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 border-0"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Build My Resume
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard/jobs/analyze">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-white/50 backdrop-blur-md border border-slate-200 hover:bg-white text-slate-700 shadow-sm transition-all hover:scale-105 group"
              >
                Check ATS Score
                <ArrowUpRight className="ml-2 w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating UI Cards */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block">
          {/* Card 1: ATS Score */}
          <div className="absolute top-[20%] left-[10%] w-64 bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 rounded-2xl p-5 animate-[float_6s_ease-in-out_infinite]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-slate-800">
                Resume Analysis
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 border-b border-slate-100 mb-4">
              <span className="text-sm text-slate-500 font-medium mb-1">
                ATS Score
              </span>
              <div className="text-4xl font-bold text-slate-800">
                87
                <span className="text-xl text-slate-400 font-medium">/100</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Skills
                match
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Keywords
                found
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Experience
                aligned
              </div>
            </div>
          </div>

          {/* Card 2: AI Assistant */}
          <div className="absolute top-[35%] right-[8%] w-72 bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 rounded-2xl p-5 animate-[float_8s_ease-in-out_infinite_1s]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-semibold text-slate-800">
                CareerCraft AI
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 mb-3 text-sm text-slate-700 shadow-inner">
              How can I improve my resume for a Product Manager role?
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 text-sm text-slate-800 shadow-inner border border-purple-100/50">
              <span className="font-medium text-purple-700">AI: </span> I
              suggest highlighting your data-driven metrics in the latest
              project. Let's add...
            </div>
          </div>

          {/* Card 3: Career Readiness */}
          <div className="absolute bottom-[20%] left-[15%] w-56 bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 rounded-2xl p-5 animate-[float_7s_ease-in-out_infinite_2s]">
            <div className="font-semibold text-slate-800 mb-2">
              Career Readiness
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-3">82%</div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-2.5 rounded-full"
                style={{ width: "82%" }}
              ></div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Ready for applications
            </span>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4 tracking-tight">
              Everything you need to grow your career.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#FAFAFC] border border-slate-100 p-8 rounded-[2rem] hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mb-6 shadow-inner">
                <FileBadge2 className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-3 text-slate-900">
                AI Resume Builder
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                Build a professional resume with intelligent assistance. Our AI
                suggests bullet points and phrasing tailored to your industry.
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center text-pink-600 font-semibold group-hover:text-pink-700"
              >
                Try Builder{" "}
                <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#FAFAFC] border border-slate-100 p-8 rounded-[2rem] hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-6 shadow-inner">
                <LineChart className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-3 text-slate-900">
                ATS Score Checker
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                Understand how ATS systems evaluate your resume. Instantly
                compare your profile against specific job descriptions.
              </p>
              <Link
                href="/dashboard/jobs/analyze"
                className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700"
              >
                Check Score{" "}
                <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#FAFAFC] border border-slate-100 p-8 rounded-[2rem] hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-6 shadow-inner">
                <MessageSquare className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-3 text-slate-900">
                AI Career Assistant
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                Get personalized career guidance. Ask about interview
                preparation, salary negotiation, or skill development.
              </p>
              <Link
                href="/dashboard/career"
                className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700"
              >
                Chat Now{" "}
                <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#FAFAFC] border border-slate-100 p-8 rounded-[2rem] hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6 shadow-inner">
                <Briefcase className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-3 text-slate-900">
                Career Guidance
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                Discover skills and career opportunities. We map out the exact
                progression you need to reach your dream role.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700"
              >
                View Roadmap{" "}
                <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ATS SECTION */}
      <section className="py-24 bg-[#FAFAFC] relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Decorative blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-200/40 to-purple-200/40 blur-3xl rounded-full -z-10" />

              <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative z-10 flex flex-col sm:flex-row items-center gap-10">
                {/* Circular Score Visual */}
                <div className="relative w-48 h-48 flex-shrink-0">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset="36"
                      strokeLinecap="round"
                      className="animate-[stroke_1.5s_ease-out_forward]"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-800">
                      87
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <h4 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                    Analysis Results
                  </h4>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">Skills detected</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">Keywords optimized</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">Experience relevant</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">Formatting standard</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-6 tracking-tight">
                Know how strong your resume really is.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Stop guessing if your resume will pass the screening software.
                Our ATS engine analyzes your profile just like employers do,
                giving you actionable steps to improve.
              </p>
              <Link href="/dashboard/jobs/analyze">
                <Button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white h-12 px-8 font-medium shadow-lg shadow-purple-500/25 border-0">
                  Improve My Resume <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI ASSISTANT SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-6 tracking-tight">
                Your AI career companion.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Prepare for interviews, ask about salary expectations, or get
                personalized advice on pivoting your career path. CareerCraft AI
                is available 24/7.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-medium text-slate-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors">
                  Improve Resume
                </span>
                <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-medium text-slate-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors">
                  Suggest Skills
                </span>
                <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-medium text-slate-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors">
                  Interview Prep
                </span>
                <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-medium text-slate-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors">
                  Career Advice
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-purple-200/40 to-pink-200/40 blur-3xl rounded-full -z-10" />

              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden flex flex-col h-[400px]">
                <div className="p-4 border-b border-slate-100 bg-white/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">
                      CareerCraft AI
                    </h5>
                    <span className="text-xs text-emerald-500 font-medium">
                      ● Online
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 mb-1 mr-1">
                      You
                    </span>
                    <div className="bg-slate-900 text-white rounded-2xl rounded-tr-sm px-5 py-3 text-sm max-w-[85%] shadow-sm">
                      How can I improve my resume for a senior role?
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-slate-400 mb-1 ml-1">
                      CareerCraft AI
                    </span>
                    <div className="bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm px-5 py-3 text-sm max-w-[90%] shadow-sm leading-relaxed">
                      Your projects are strong. To target senior roles, focus on
                      leadership and impact. Add measurable results (e.g., "Led
                      a team of 5 to increase revenue by 20%") and include
                      architectural decision-making keywords to improve your ATS
                      compatibility.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/50 border-t border-slate-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      readOnly
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESUME BUILDER SECTION */}
      <section className="py-24 bg-[#FAFAFC] overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4 tracking-tight">
              Craft the perfect resume.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our intelligent split-view editor lets you fill in your details
              while seeing exactly how your final resume will look in real-time.
            </p>
          </div>

          <div className="relative rounded-3xl bg-slate-900 shadow-2xl overflow-hidden border border-slate-800 p-2 sm:p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
            <div className="bg-[#0f172a] rounded-2xl overflow-hidden border border-slate-800 flex flex-col md:flex-row h-[500px]">
              {/* Left Side: Editor Panel */}
              <div className="w-full md:w-1/3 border-r border-slate-800 bg-[#1e293b]/50 p-4 overflow-y-auto">
                <div className="space-y-2">
                  {[
                    "Personal Information",
                    "Education",
                    "Skills",
                    "Experience",
                    "Projects",
                    "Certifications",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors ${i === 3 ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item}</span>
                        {i === 3 && <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Preview */}
              <div className="w-full md:w-2/3 bg-slate-950 p-4 md:p-8 flex items-center justify-center relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                </div>

                {/* Mock Resume Document */}
                <div className="w-full max-w-md h-full bg-white rounded-sm shadow-xl p-6 sm:p-8 space-y-4 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500 origin-top">
                  <div className="border-b-2 border-slate-800 pb-4">
                    <div className="h-6 w-48 bg-slate-800 rounded-sm mb-2" />
                    <div className="h-3 w-64 bg-slate-300 rounded-sm" />
                  </div>
                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="h-4 w-32 bg-indigo-600 rounded-sm mb-3" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-3 w-40 bg-slate-700 rounded-sm" />
                          <div className="h-3 w-16 bg-slate-300 rounded-sm" />
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-sm" />
                        <div className="h-2 w-[90%] bg-slate-200 rounded-sm" />
                        <div className="h-2 w-[95%] bg-slate-200 rounded-sm" />
                      </div>
                    </div>
                    <div>
                      <div className="h-4 w-32 bg-indigo-600 rounded-sm mb-3" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-3 w-40 bg-slate-700 rounded-sm" />
                          <div className="h-3 w-16 bg-slate-300 rounded-sm" />
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-sm" />
                        <div className="h-2 w-[85%] bg-slate-200 rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER GROWTH SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4 tracking-tight">
              Your path to success.
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between relative max-w-4xl mx-auto px-4 md:px-0">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 -translate-y-1/2 hidden md:block z-0" />
            <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200 -translate-x-1/2 md:hidden z-0" />

            {/* Nodes */}
            {[
              {
                icon: <Layers className="w-5 h-5 text-pink-600" />,
                label: "Skills",
                bg: "bg-pink-100",
                border: "border-pink-200",
              },
              {
                icon: <FileText className="w-5 h-5 text-purple-600" />,
                label: "Resume",
                bg: "bg-purple-100",
                border: "border-purple-200",
              },
              {
                icon: <CheckCircle className="w-5 h-5 text-indigo-600" />,
                label: "ATS Score",
                bg: "bg-indigo-100",
                border: "border-indigo-200",
              },
              {
                icon: <Sparkles className="w-5 h-5 text-blue-600" />,
                label: "AI Guidance",
                bg: "bg-blue-100",
                border: "border-blue-200",
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
                label: "Career Growth",
                bg: "bg-emerald-100",
                border: "border-emerald-200",
              },
            ].map((node, i) => (
              <div
                key={i}
                className="flex flex-col items-center relative z-10 my-6 md:my-0 group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${node.bg} border ${node.border} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-white`}
                >
                  {node.icon}
                </div>
                <span className="font-semibold text-slate-700 text-sm">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl bg-gradient-to-br from-slate-900 to-[#0A1A3A] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* CTA Background blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-[3rem]">
            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-pink-500/20 blur-[100px] mix-blend-screen transform rotate-12" />
            <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] bg-blue-500/20 blur-[100px] mix-blend-screen transform -rotate-12" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-6 tracking-tight">
              Ready to build your future?
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Build your resume, improve your ATS score and get AI-powered
              career guidance with CareerCraft.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="h-16 px-10 text-lg rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 text-white shadow-xl shadow-purple-500/30 transition-all hover:scale-105 border-0 font-bold group"
              >
                <Sparkles className="mr-2 w-6 h-6" />
                Start Building My Resume
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🌸</span>
              <span className="font-heading font-bold text-xl text-slate-900 tracking-tight">
                CareerCraft AI
              </span>
            </div>
            <p className="text-slate-500 text-sm">Your AI Career Assistant.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link
              href="/builder"
              className="hover:text-slate-900 transition-colors"
            >
              Resume Builder
            </Link>
            <Link
              href="/dashboard/jobs/analyze"
              className="hover:text-slate-900 transition-colors"
            >
              ATS Checker
            </Link>
            <Link
              href="/dashboard/career"
              className="hover:text-slate-900 transition-colors"
            >
              AI Assistant
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-slate-900 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
