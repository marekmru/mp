// src/types/project.ts

export interface ProjectCountry {
  code: string;
  name: string;
}

export interface ProjectLanguage {
  code: string;
  name: string;
}

export interface ProjectCampaignType {
  id: string;
  name: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
}

export interface ProjectGoal {
  id: string;
  name: string;
}

export interface ProjectCreate {
  name: string;
  mediaplanId: string;
  country: ProjectCountry;
  language: string;
  campaignType: string;
  phase: string;
  goal: string;
}

export interface Project {
  _id: string;
  name: string;
  mediaplanId: string;
  country: ProjectCountry;
  language: string;
  campaignType: string;
  phase: string;
  goal: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  items: Project[];
}
