import { create } from "zustand";
import { ResumeData, defaultResumeData, Experience, Education, SkillCategory } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

interface ResumeStore {
  data: ResumeData;
  templateId: string;
  setResumeData: (data: ResumeData) => void;
  setTemplate: (id: string) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  updateSummary: (summary: string) => void;
  
  // Experience
  addExperience: () => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Education
  addEducation: () => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, category: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  data: { ...defaultResumeData, id: uuidv4() },
  templateId: "modern",
  
  setResumeData: (data) => set({ data }),
  setTemplate: (id) => set({ templateId: id }),
  
  updatePersonalInfo: (info) => 
    set((state) => ({
      data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } }
    })),
    
  updateSummary: (summary) => 
    set((state) => ({
      data: { ...state.data, summary }
    })),

  addExperience: () => 
    set((state) => ({
      data: {
        ...state.data,
        experience: [
          ...state.data.experience,
          { id: uuidv4(), company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: [] }
        ]
      }
    })),
    
  updateExperience: (id, exp) => 
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map(e => e.id === id ? { ...e, ...exp } : e)
      }
    })),
    
  removeExperience: (id) => 
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.filter(e => e.id !== id)
      }
    })),

  addEducation: () => 
    set((state) => ({
      data: {
        ...state.data,
        education: [
          ...state.data.education,
          { id: uuidv4(), institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", current: false, gpa: "" }
        ]
      }
    })),
    
  updateEducation: (id, edu) => 
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.map(e => e.id === id ? { ...e, ...edu } : e)
      }
    })),
    
  removeEducation: (id) => 
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.filter(e => e.id !== id)
      }
    })),

  addSkillCategory: () => 
    set((state) => ({
      data: {
        ...state.data,
        skills: [
          ...state.data.skills,
          { id: uuidv4(), name: "", skills: [] }
        ]
      }
    })),
    
  updateSkillCategory: (id, category) => 
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.map(s => s.id === id ? { ...s, ...category } : s)
      }
    })),
    
  removeSkillCategory: (id) => 
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.filter(s => s.id !== id)
      }
    })),
}));
