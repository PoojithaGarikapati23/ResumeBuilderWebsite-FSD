"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <header className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05)] rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <span className="font-heading font-bold text-lg tracking-tight text-slate-900">
            CareerCraft AI
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/builder"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Resume Builder
          </Link>
          <Link
            href="/dashboard/jobs/analyze"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            ATS Checker
          </Link>
          <Link
            href="/dashboard/career"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            AI Assistant
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/register">
            <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white h-10 px-6 font-medium group transition-all">
              Get Started
              <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-700 hover:text-slate-900 p-2"
          >
            Home
          </Link>
          <Link
            href="/builder"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-700 hover:text-slate-900 p-2"
          >
            Resume Builder
          </Link>
          <Link
            href="/dashboard/jobs/analyze"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-700 hover:text-slate-900 p-2"
          >
            ATS Checker
          </Link>
          <Link
            href="/dashboard/career"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-700 hover:text-slate-900 p-2"
          >
            AI Assistant
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium text-slate-700 hover:text-slate-900 p-2"
          >
            Dashboard
          </Link>
          <div className="h-px bg-slate-200 my-2" />
          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white h-12 font-medium">
              Get Started <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
