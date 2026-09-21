import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, FileText } from "lucide-react"

export default async function ResumesPage() {
  const session = await getServerSession(authOptions)
  
  const resumes = session?.user?.id ? await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  }) : []

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight mb-2">My Resumes</h2>
          <p className="text-muted-foreground text-lg">Manage and edit your saved resumes.</p>
        </div>
        <Link href="/builder">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Create New
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">No resumes yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              You haven't created any resumes yet. Start building your first professional resume now.
            </p>
            <Link href="/builder">
              <Button>Create Your First Resume</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {resumes.map(resume => (
            <Card key={resume.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{resume.name}</CardTitle>
                <CardDescription>Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/builder?id=${resume.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">Edit</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
