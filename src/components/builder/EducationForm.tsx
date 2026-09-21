"use client"
import { useResumeStore } from "@/store/useResumeStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, GripVertical } from "lucide-react"

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore()

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Education</CardTitle>
            <CardDescription>Add your academic background.</CardDescription>
          </div>
          <Button onClick={addEducation} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="relative bg-card border border-border p-5 rounded-xl space-y-4 shadow-sm group">
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-grab">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button onClick={() => removeEducation(edu.id)} variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>School / University</Label>
                <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} placeholder="Stanford University" />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} placeholder="B.S." />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Field of Study</Label>
                <Input value={edu.fieldOfStudy} onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })} placeholder="Computer Science" />
              </div>
              <div className="space-y-2">
                <Label>End Date / Expected</Label>
                <Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} placeholder="May 2024" />
              </div>
              <div className="space-y-2">
                <Label>GPA</Label>
                <Input value={edu.gpa} onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })} placeholder="3.8/4.0" />
              </div>
            </div>
          </div>
        ))}
        {data.education.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            No education added yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
