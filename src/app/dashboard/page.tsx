import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Upload, Briefcase, Activity } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight mb-2">Welcome back, Alex!</h2>
        <p className="text-muted-foreground text-lg">Here's an overview of your career progression and resume health.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/builder" className="block">
          <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-dashed border-2 h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px] space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold">Create New Resume</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/upload" className="block">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-dashed border-2 h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px] space-y-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-5 h-5 text-foreground" />
              </div>
              <div className="font-semibold">Upload Existing Resume</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/jobs/analyze" className="block">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-dashed border-2 h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px] space-y-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-foreground" />
              </div>
              <div className="font-semibold">Analyze a Job Description</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-heading">Recent Resumes</h3>
            <Link href="/dashboard"><Button variant="ghost" size="sm">View All</Button></Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Software Engineer Resume</CardTitle>
                <CardDescription>Updated 2 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">ATS Score: 85/100</span>
                </div>
                <div className="flex gap-2">
                  <Link href="/builder" className="block w-full"><Button size="sm" variant="outline" className="w-full">Edit</Button></Link>
                  <Link href="/builder" className="block w-full"><Button size="sm" className="w-full">Download</Button></Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Data Analyst Resume</CardTitle>
                <CardDescription>Updated 1 week ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-500 font-medium">ATS Score: 62/100</span>
                </div>
                <div className="flex gap-2">
                  <Link href="/builder" className="block w-full"><Button size="sm" variant="outline" className="w-full">Edit</Button></Link>
                  <Link href="/builder" className="block w-full"><Button size="sm" className="w-full">Download</Button></Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-heading">Recent Job Analyses</h3>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold mb-1">Frontend Developer @ Vercel</div>
                <div className="text-sm text-muted-foreground mb-3">Matched with: Software Eng Resume</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded font-medium">88% Match</span>
                  <Link href="/dashboard/jobs/analyze"><Button variant="link" size="sm" className="h-auto p-0">View Report</Button></Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold mb-1">Fullstack Engineer @ Stripe</div>
                <div className="text-sm text-muted-foreground mb-3">Matched with: Software Eng Resume</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-medium">65% Match</span>
                  <Link href="/dashboard/jobs/analyze"><Button variant="link" size="sm" className="h-auto p-0">View Report</Button></Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
