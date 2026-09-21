"use client"
import { useResumeStore } from "@/store/useResumeStore"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function SummaryForm() {
  const { data, updateSummary } = useResumeStore()

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Professional Summary</CardTitle>
          <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10">
            <Sparkles className="w-3.5 h-3.5" />
            AI Write
          </Button>
        </div>
        <CardDescription>Write a brief summary highlighting your key achievements and skills.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-2">
          <Label className="sr-only">Summary</Label>
          <Textarea 
            value={data.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Passionate software engineer with 5+ years of experience in building scalable web applications..."
            className="min-h-[150px] resize-y"
          />
        </div>
      </CardContent>
    </Card>
  )
}
