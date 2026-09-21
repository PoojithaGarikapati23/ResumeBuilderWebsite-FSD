"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, FileText, Briefcase, Activity, Target } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-muted/20 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">Platform analytics and system health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-none">+12%</Badge>
              </div>
              <div className="text-3xl font-bold font-heading">1,248</div>
              <div className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-none">+34%</Badge>
              </div>
              <div className="text-3xl font-bold font-heading">4,892</div>
              <div className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Resumes Generated</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-foreground" />
                </div>
              </div>
              <div className="text-3xl font-bold font-heading">8,211</div>
              <div className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Job Analyses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Target className="w-5 h-5 text-foreground" />
                </div>
              </div>
              <div className="text-3xl font-bold font-heading">82%</div>
              <div className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Avg ATS Match</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Recent actions across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">User {i * 123} tailored a resume for "Product Manager"</p>
                      <p className="text-xs text-muted-foreground">{i * 2} minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Service Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">OpenAI Parsing API</span>
                  <span className="text-emerald-600 font-bold">Online</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Vercel AI SDK</span>
                  <span className="text-emerald-600 font-bold">Online</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[100%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Database Latency</span>
                  <span className="text-emerald-600 font-bold">42ms</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { Badge } from "@/components/ui/badge"
