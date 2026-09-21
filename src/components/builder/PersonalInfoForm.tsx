"use client"
import { useResumeStore } from "@/store/useResumeStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PersonalInfoForm() {
  const { data, updatePersonalInfo } = useResumeStore()
  const info = data.personalInfo

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalInfo({ [e.target.name]: e.target.value })
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input name="firstName" value={info.firstName} onChange={handleChange} placeholder="John" />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input name="lastName" value={info.lastName} onChange={handleChange} placeholder="Doe" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Professional Title</Label>
          <Input name="jobTitle" value={info.jobTitle} onChange={handleChange} placeholder="Software Engineer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" value={info.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input name="phone" value={info.phone} onChange={handleChange} placeholder="+1 234 567 890" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input name="location" value={info.location} onChange={handleChange} placeholder="San Francisco, CA" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <Input name="linkedin" value={info.linkedin} onChange={handleChange} placeholder="linkedin.com/in/johndoe" />
          </div>
          <div className="space-y-2">
            <Label>Website / GitHub</Label>
            <Input name="website" value={info.website} onChange={handleChange} placeholder="github.com/johndoe" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
