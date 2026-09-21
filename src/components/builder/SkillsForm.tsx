"use client"
import { useResumeStore } from "@/store/useResumeStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, GripVertical } from "lucide-react"

export function SkillsForm() {
  const { data, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeStore()

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Skills</CardTitle>
            <CardDescription>Group your skills by categories.</CardDescription>
          </div>
          <Button onClick={addSkillCategory} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Skill Category
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        {data.skills.map((cat, index) => (
          <div key={cat.id} className="relative bg-card border border-border p-5 rounded-xl space-y-4 shadow-sm group">
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-grab">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button onClick={() => removeSkillCategory(cat.id)} variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2 pt-2 pr-20">
              <Label>Category Name</Label>
              <Input value={cat.name} onChange={(e) => updateSkillCategory(cat.id, { name: e.target.value })} placeholder="Programming Languages" />
            </div>
            
            <div className="space-y-2">
              <Label>Skills (Comma separated)</Label>
              <Textarea 
                value={cat.skills.join(", ")}
                onChange={(e) => updateSkillCategory(cat.id, { skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                placeholder="Python, TypeScript, SQL, React"
                className="min-h-[80px]"
              />
            </div>
          </div>
        ))}
        {data.skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            No skill categories added yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
