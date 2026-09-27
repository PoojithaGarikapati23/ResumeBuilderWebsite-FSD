import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  Target,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#05050f] text-slate-200 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30 relative">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-72 border-r border-slate-800/60 bg-slate-950/40 backdrop-blur-xl flex-shrink-0 flex flex-col z-10">
        <div className="h-20 flex items-center px-8 border-b border-slate-800/60">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              CareerCraft
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/20 text-indigo-300 font-medium group transition-all"
          >
            <LayoutDashboard className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/resumes"
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all font-medium group"
          >
            <FileText className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
            My Resumes
          </Link>
          <Link
            href="/dashboard/jobs/analyze"
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all font-medium group"
          >
            <Briefcase className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
            ATS Checker
          </Link>
          <Link
            href="/dashboard/career"
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all font-medium group"
          >
            <Target className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
            Career Matcher
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800/60">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all font-medium mb-2 group"
          >
            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            Settings
          </Link>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium text-left">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-20 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-xl flex items-center px-8 justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="font-heading font-bold text-2xl text-white tracking-tight">
              Overview
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Pro Plan Active
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                <span className="text-sm font-bold text-white">AL</span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {children}
        </div>
      </main>
    </div>
  );
}
