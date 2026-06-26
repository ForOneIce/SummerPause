export type Page = 'dashboard' | 'resume_workshop' | 'tracker' | 'know_self' | 'know_others' | 'podcast' | 'job_channels';

export interface AssetRecord {
  id: string;
  category: 'work' | 'project' | 'edu' | 'skill' | 'honor' | 'portfolio' | 'social' | 'language' | 'volunteer';
  title: string;
  organization?: string;
  timeRange: string;
  description: string;
  tags: string[];
  results?: string;
  isVisible: boolean;
}

export interface ResumeVersion {
  id: string;
  name: string;
  targetJD: string;
  selectedAssetIds: string[];
  lastModified: string;
  aiSuggestions?: any;
}

export interface Interview {
  round: string;
  format: string;
  interviewer: string;
  date: string;
  nextStep: string;
  result: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  positionName: string;
  keywords: string;
  location: string;
  salaryRange: string;
  postDate: string;
  channel: string;
  jdLink: string;
  applyDate: string;
  cvVersion: string;
  currentStatus: string;
  statusUpdateDate: string;
  interviews: Interview[];
  notes: {
    techQuestions: string;
    projectFocus: string;
    improvementPoints: string;
    interviewerStyle: string;
    techStack: string;
  };
  decision: {
    intentRating: number;
    matchRating: number;
    companyEvaluation: string;
    concerns: string;
    offerDecision: string;
  };
  followUp: {
    hrContact: string;
    offerDetails: string;
    deadline: string;
    entryDate: string;
    isFinal: boolean;
  };
}

export interface Tool {
  name: string;
  value: string;
  desc: string;
  toolId?: string;
  link?: string;
}

export interface PodcastEpisode {
  url: string;
  title: string;
  show: string;
  category: 'gap' | 'anxiety';
}
