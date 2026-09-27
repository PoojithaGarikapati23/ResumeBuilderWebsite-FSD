"use client";
import { useRef } from "react";
import { PersonalInfoForm } from "@/components/builder/PersonalInfoForm";
import { SummaryForm } from "@/components/builder/SummaryForm";
import { ExperienceForm } from "@/components/builder/ExperienceForm";
import { EducationForm } from "@/components/builder/EducationForm";
import { SkillsForm } from "@/components/builder/SkillsForm";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Save, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { useResumeStore } from "@/store/useResumeStore";
import { useState } from "react";

export default function BuilderPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { data } = useResumeStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/resume/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (res.ok) {
        alert("Resume saved successfully!");
      } else {
        const error = await res.json();
        alert(`Failed to save: ${error.error}`);
      }
    } catch {
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Resume",
  });

  return (
    <div className="h-screen flex flex-col bg-[#05050f] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-[20%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Topbar */}
      <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/resumes">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-800/60"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white tracking-wide">
              AI Resume Builder
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            onClick={() => reactToPrintFn()}
            size="sm"
            className="gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 border-none transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Panel: Editor */}
        <div className="w-[500px] border-r border-slate-800/60 bg-slate-950/60 backdrop-blur-md flex flex-col shrink-0 z-10 shadow-2xl shadow-black/50">
          <ScrollArea className="flex-1">
            <div className="p-8 space-y-10 pb-32">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-heading text-white">
                  Resume Details
                </h2>
                <p className="text-sm text-slate-400">
                  Fill in your information to generate a beautiful resume.
                </p>
              </div>
              <PersonalInfoForm />
              <div className="h-px bg-slate-800/60"></div>
              <SummaryForm />
              <div className="h-px bg-slate-800/60"></div>
              <ExperienceForm />
              <div className="h-px bg-slate-800/60"></div>
              <EducationForm />
              <div className="h-px bg-slate-800/60"></div>
              <SkillsForm />
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-1 overflow-auto bg-[#0a0a16] p-8 flex items-start justify-center pattern-grid-lg text-slate-800/20">
          <div className="transform origin-top scale-[0.85] xl:scale-100 transition-transform mt-4">
            <div className="shadow-2xl shadow-black/40 ring-1 ring-white/10 rounded-sm bg-white overflow-hidden">
              <ResumePreview ref={contentRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
