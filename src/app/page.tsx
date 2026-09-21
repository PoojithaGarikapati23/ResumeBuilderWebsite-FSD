import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, CheckCircle, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Meet your AI Career Assistant</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-8 leading-tight">
            Build a Resume That <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Matches the Job.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create, optimize and analyze your resume with AI — and understand how well your profile matches the jobs you want.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base group">
                Build My Resume
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base">
                Analyze My Resume
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/30 border-y border-border py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Everything you need to land the job</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Stop guessing what recruiters want. Our AI analyzes job descriptions and tailors your profile to stand out.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="w-6 h-6 text-primary" />,
                  title: "AI Resume Builder",
                  desc: "Create beautiful, ATS-friendly resumes in minutes with intelligent suggestions."
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-primary" />,
                  title: "ATS Analysis",
                  desc: "Instantly see how well your resume scores against any job description."
                },
                {
                  icon: <TrendingUp className="w-6 h-6 text-primary" />,
                  title: "Smart Tailoring",
                  desc: "Automatically optimize your keywords and phrasing for the exact role you want."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CareerCraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
