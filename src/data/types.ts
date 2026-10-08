/**
 * TypeScript type definitions for Max Frenat Portfolio profile data.
 *
 * Rules:
 * 1. Every entry has an explicit single source: 'cv' or 'github:<repo>'.
 * 2. All structures are immutable (readonly).
 */

export type DataSource = 'cv' | 'direct' | `github:${string}` | `document:${string}`;

export interface SocialLink {
  readonly platform: string;
  readonly url: string;
  readonly label: string;
  readonly source: DataSource;
}

export interface EducationEntry {
  readonly institution: string;
  readonly degree: string;
  readonly gpa: string;
  readonly period: string;
  readonly location: string;
  readonly coursework: readonly string[];
  readonly source: DataSource;
}

export interface CertificationEntry {
  readonly name: string;
  readonly issuer: string;
  readonly issueDate: string;
  readonly notes?: string;
  readonly source: DataSource;
}

export interface CompletionCertificateEntry {
  readonly name: string;
  readonly issuer: string;
  readonly issueDate: string;
  readonly courseDuration?: string;
  readonly certificateId?: string;
  readonly source: DataSource;
}

export interface ExperienceEntry {
  readonly role: string;
  readonly organization: string;
  readonly period: string;
  readonly highlights: readonly string[];
  readonly source: DataSource;
}

export interface ActivityEntry {
  readonly title: string;
  readonly roleOrScope: string;
  readonly date: string;
  readonly highlights: readonly string[];
  readonly source: DataSource;
}

export interface SkillItem {
  readonly name: string;
  readonly category:
    | 'Binary & File Analysis'
    | 'Network & Systems'
    | 'Scripting & Programming'
    | 'Web & Frameworks'
    | 'Security Topics';
  readonly source: DataSource;
}

export interface ProjectEntry {
  readonly name: string;
  readonly repoName: string;
  readonly summary: string;
  readonly primaryLanguage: string;
  readonly url: string;
  readonly highlights?: readonly string[];
  readonly authorizedUseNotice?: string;
  readonly source: DataSource;
}

export interface SpokenLanguage {
  readonly language: string;
  readonly proficiency: string;
  readonly source: DataSource;
}

export interface ProfileData {
  readonly identity: {
    readonly displayName: string;
    readonly fullName: string;
    readonly headline: string;
    readonly backgroundSummary: string;
    readonly location: string;
    readonly emailPendingConfirmation: string | null;
    readonly links: readonly SocialLink[];
    readonly source: DataSource;
  };
  readonly education: readonly EducationEntry[];
  readonly certifications: readonly CertificationEntry[];
  readonly completionCertificates: readonly CompletionCertificateEntry[];
  readonly experience: readonly ExperienceEntry[];
  readonly activities: readonly ActivityEntry[];
  readonly skills: readonly SkillItem[];
  readonly projects: readonly ProjectEntry[];
  readonly spokenLanguages: readonly SpokenLanguage[];
}
