"use client"
import { useRef } from "react"
import { PersonalInfoForm } from "@/components/builder/PersonalInfoForm"
import { SummaryForm } from "@/components/builder/SummaryForm"
import { ExperienceForm } from "@/components/builder/ExperienceForm"
import { EducationForm } from "@/components/builder/EducationForm"
import { SkillsForm } from "@/components/builder/SkillsForm"
import { ResumePreview } from "@/components/builder/ResumePreview"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Download, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useReactToPrint } from "react-to-print"

export default function BuilderPage() {
  const contentRef = useRef<HTMLDivElement>(null)
  
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Resume",
  })

  return (
    <div className="h-screen flex flex-col bg-muted/30 overflow-hidden">
      {/* Topbar */}
      <header className="h-14 bg-background border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <span className="font-medium text-sm">Untitled Resume</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button onClick={() => reactToPrintFn()} size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Editor */}
        <div className="w-[500px] border-r border-border bg-background flex flex-col shrink-0 z-10 shadow-xl shadow-black/5">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8 pb-32">
              <PersonalInfoForm />
              <div className="h-px bg-border"></div>
              <SummaryForm />
              <div className="h-px bg-border"></div>
              <ExperienceForm />
              <div className="h-px bg-border"></div>
              <EducationForm />
              <div className="h-px bg-border"></div>
              <SkillsForm />
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-1 overflow-auto bg-muted/40 p-8 flex items-start justify-center">
          <div className="transform origin-top scale-[0.85] xl:scale-100 transition-transform">
            <div className="shadow-2xl ring-1 ring-black/5">
              <ResumePreview ref={contentRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
