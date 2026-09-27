import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText, ArrowRight } from "lucide-react";

export default async function ResumesPage() {
  const session = await getServerSession(authOptions);

  const resumes = session?.user?.id
    ? await prisma.resume.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold font-heading tracking-tight mb-2 text-white">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Resumes
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Manage, edit, and optimize your saved resumes.
          </p>
        </div>
        <Link href="/builder" className="relative z-10">
          <Button className="gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 border-none transition-all hover:scale-105">
            <Plus className="w-5 h-5" /> Create New Resume
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-800 bg-slate-900/20 backdrop-blur-sm rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="flex flex-col items-center justify-center py-24 text-center relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-6 shadow-inner shadow-slate-900">
              <FileText className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-3 text-white">
              No resumes yet
            </h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
              You haven't created any resumes yet. Start building your first
              professional resume with AI assistance now.
            </p>
            <Link href="/builder">
              <Button className="h-12 px-8 rounded-xl bg-white text-indigo-950 hover:bg-slate-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                Create Your First Resume <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="bg-slate-900/50 border-slate-800/60 rounded-3xl overflow-hidden hover:border-slate-700 hover:bg-slate-800/40 transition-colors group"
            >
              <CardHeader className="pb-4 border-b border-slate-800/40 bg-slate-800/20">
                <CardTitle className="text-xl text-white font-bold">
                  {resume.name || "Untitled Resume"}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Last updated:{" "}
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Link href={`/builder?id=${resume.id}`} className="flex-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-xl border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200 h-10 font-semibold bg-indigo-500/5"
                    >
                      Open Builder
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
