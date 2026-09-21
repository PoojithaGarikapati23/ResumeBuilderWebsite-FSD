"use client"
import { useResumeStore } from "@/store/useResumeStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, GripVertical } from "lucide-react"

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore()

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Work Experience</CardTitle>
            <CardDescription>Add your relevant professional experience.</CardDescription>
          </div>
          <Button onClick={addExperience} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        {data.experience.map((exp) => (
          <div key={exp.id} className="relative bg-card border border-border p-5 rounded-xl space-y-4 shadow-sm group">
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-grab">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button onClick={() => removeExperience(exp.id)} variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} placeholder="Google" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} placeholder="Jan 2021" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} placeholder="Present" disabled={exp.current} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={exp.location} onChange={(e) => updateExperience(exp.id, { location: e.target.value })} placeholder="Mountain View, CA" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description (Bullet points)</Label>
              <Textarea 
                value={exp.description.join("\n")}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value.split("\n") })}
                placeholder="• Developed new features for the main product&#10;• Improved performance by 30%"
                className="min-h-[120px]"
              />
            </div>
          </div>
        ))}
        {data.experience.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            No experience added yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
