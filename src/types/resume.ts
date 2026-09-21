export type ResumeData = {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
};

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  jobTitle: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
};

export type SkillCategory = {
  id: string;
  name: string; // e.g., "Languages", "Frameworks"
  skills: string[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
};

export const defaultResumeData: ResumeData = {
  id: "",
  title: "Untitled Resume",
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    jobTitle: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};
