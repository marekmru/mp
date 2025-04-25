// src/types/project.ts

// Country reference
import type {Budget} from "./mediaplan.ts";

export interface Country {
  code: string;
  name: string;
}

// Basic structure for default variables
export interface ProjectDefaultVars {
  targeturls: string | null;
  subsegment: string | null;
  campaigntype: string | null;
  language: string | null;
  campaigndetail: string | null;
  adtype: string | null;
  dimension: string | null;
}

// Basic structure for descriptive variables
export interface ProjectDescriptiveVars {
  brand: string;
  country: string;
  bmwponumber: string;
  adobecampaignname: string;
  subsegment: string;
  campaigntype: string;
  projectname: string;
  year: number;
}

// Duration information
export interface ProjectDuration {
  start_date: string;
  end_date: string;
  formatted: string;
}

// Project object
export interface Project {
  _id: string;
  abbreviation: string;
  created_at: string;
  default_vars: ProjectDefaultVars;
  descriptive_vars: ProjectDescriptiveVars;
  is_locked: boolean;
  labels: string[];
  lock_state: number;
  owner: string;
  updated_at: string;
  uploaded_at: string;
  message: string;
  timestamp: string;
  version: string;
  duration?: ProjectDuration;
  detail?: string;
  budget?: Budget;
  mediaplanId?: string;
}

// Project create request
export interface ProjectCreate {
  abbreviation?: string;
  default_vars: ProjectDefaultVars;
  descriptive_vars: ProjectDescriptiveVars;
  labels?: string[];
}

// API response for project list
export interface ProjectListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  items: Project[];
}
