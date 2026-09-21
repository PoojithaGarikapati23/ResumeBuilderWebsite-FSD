import { useResumeStore } from "@/store/useResumeStore"
import { forwardRef } from "react"

export const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
  const { data } = useResumeStore()
  const { personalInfo: info, summary, experience, education, skills } = data

  return (
    <div ref={ref} className="bg-white text-black min-h-[1056px] w-full max-w-[816px] shadow-2xl rounded-sm mx-auto p-12 font-sans overflow-hidden">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold tracking-tight uppercase">
          {info.firstName || "FIRST"} {info.lastName || "LAST"}
        </h1>
        {info.jobTitle && <h2 className="text-xl text-gray-600 mt-1 uppercase tracking-widest">{info.jobTitle}</h2>}
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-sm text-gray-600">
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>• {info.phone}</span>}
          {info.location && <span>• {info.location}</span>}
          {info.linkedin && <span>• {info.linkedin}</span>}
          {info.website && <span>• {info.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-2 border-b border-gray-300 pb-1">Professional Summary</h3>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-800">{exp.position}</h4>
                  <span className="text-sm text-gray-600 font-medium">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <div className="text-sm font-medium text-gray-700">{exp.company}</div>
                  <div className="text-sm text-gray-500 italic">{exp.location}</div>
                </div>
                {exp.description.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-1">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-800">{edu.institution}</h4>
                  <span className="text-sm text-gray-600 font-medium">{edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div className="text-sm text-gray-700">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </div>
                  {edu.gpa && <div className="text-sm text-gray-500">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">Skills</h3>
          <div className="space-y-2">
            {skills.map((cat) => (
              <div key={cat.id} className="text-sm">
                {cat.name && <span className="font-bold text-gray-800 mr-2">{cat.name}:</span>}
                <span className="text-gray-700">{cat.skills.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for Empty State */}
      {!summary && !info.firstName && experience.length === 0 && education.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          Start filling out your details to see the preview
        </div>
      )}
    </div>
  )
})

ResumePreview.displayName = "ResumePreview"
