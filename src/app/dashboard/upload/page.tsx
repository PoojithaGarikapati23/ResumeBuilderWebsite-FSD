"use client"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"
import { useResumeStore } from "@/store/useResumeStore"
import { Card, CardContent } from "@/components/ui/card"
import { UploadCloud, FileText, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const { setResumeData } = useResumeStore()
  const router = useRouter()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to upload")
      }

      // Update global Zustand store with parsed data
      setResumeData(result.data)
      
      // Redirect to builder
      router.push("/builder")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }, [router, setResumeData])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight mb-2">Upload Resume</h2>
        <p className="text-muted-foreground text-lg">
          Upload your existing PDF resume and our AI will automatically extract and structure your information.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div 
            {...getRootProps()} 
            className={`
              flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-xl cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="text-xl font-medium">Extracting with AI...</div>
                <p className="text-muted-foreground text-sm">This usually takes about 5-10 seconds.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-medium mb-1">Click to upload or drag and drop</div>
                  <p className="text-muted-foreground">PDF files up to 5MB are supported.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg font-medium">
          Error: {error}
        </div>
      )}
    </div>
  )
}
