// Types for Indian Legal System Case Analysis

export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  court: CourtType;
  state: IndianState;
  caseType: CaseType;
  filingDate: Date;
  lastHearing: Date;
  status: CaseStatus;
  judges: Judge[];
  parties: Party[];
  lawyers: Lawyer[];
  caseDetails: CaseDetails;
  documents: Document[];
  timeline: CaseEvent[];
  analysisResults?: AnalysisResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Judge {
  id: string;
  name: string;
  designation: string;
  court: string;
  appointmentDate: Date;
  experience: number;
  specializations: string[];
}

export interface Party {
  id: string;
  name: string;
  type: PartyType;
  address: string;
  demographics?: Demographics;
  representation: string;
}

export interface Lawyer {
  id: string;
  name: string;
  barRegistration: string;
  experience: number;
  specialization: string[];
  success_rate?: number;
  representing: PartyType;
}

export interface CaseDetails {
  summary: string;
  charges: string[];
  sections: LegalSection[];
  evidence: Evidence[];
  witnesses: Witness[];
  proceduresFollowed: string[];
  verdict?: Verdict;
  sentence?: Sentence;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  description: string;
  source: string;
  reliability: ReliabilityScore;
  dateCollected: Date;
  chainOfCustody: string[];
}

export interface Witness {
  id: string;
  name: string;
  type: WitnessType;
  testimony: string;
  credibility: CredibilityScore;
  crossExamination?: string;
}

export interface AnalysisResult {
  id: string;
  caseId: string;
  analysisType: AnalysisType;
  riskScore: number; // 1-10 scale
  confidence: number; // 0-1 scale
  findings: Finding[];
  recommendations: Recommendation[];
  aiModel: string;
  analysisDate: Date;
  reviewedBy?: string;
}

export interface Finding {
  category: string;
  severity: Severity;
  description: string;
  evidence: string[];
  precedents?: string[];
}

export interface Recommendation {
  type: RecommendationType;
  priority: Priority;
  description: string;
  actionItems: string[];
  timeline?: string;
}

// Enums and Types

export enum CourtType {
  SUPREME_COURT = 'Supreme Court',
  HIGH_COURT = 'High Court',
  DISTRICT_COURT = 'District Court',
  SESSIONS_COURT = 'Sessions Court',
  MAGISTRATE_COURT = 'Magistrate Court',
  FAMILY_COURT = 'Family Court',
  CONSUMER_COURT = 'Consumer Court'
}

export enum IndianState {
  ANDHRA_PRADESH = 'Andhra Pradesh',
  ARUNACHAL_PRADESH = 'Arunachal Pradesh',
  ASSAM = 'Assam',
  BIHAR = 'Bihar',
  CHHATTISGARH = 'Chhattisgarh',
  DELHI = 'Delhi',
  GOA = 'Goa',
  GUJARAT = 'Gujarat',
  HARYANA = 'Haryana',
  HIMACHAL_PRADESH = 'Himachal Pradesh',
  JAMMU_KASHMIR = 'Jammu and Kashmir',
  JHARKHAND = 'Jharkhand',
  KARNATAKA = 'Karnataka',
  KERALA = 'Kerala',
  MADHYA_PRADESH = 'Madhya Pradesh',
  MAHARASHTRA = 'Maharashtra',
  MANIPUR = 'Manipur',
  MEGHALAYA = 'Meghalaya',
  MIZORAM = 'Mizoram',
  NAGALAND = 'Nagaland',
  ODISHA = 'Odisha',
  PUNJAB = 'Punjab',
  RAJASTHAN = 'Rajasthan',
  SIKKIM = 'Sikkim',
  TAMIL_NADU = 'Tamil Nadu',
  TELANGANA = 'Telangana',
  TRIPURA = 'Tripura',
  UTTAR_PRADESH = 'Uttar Pradesh',
  UTTARAKHAND = 'Uttarakhand',
  WEST_BENGAL = 'West Bengal'
}

export enum CaseType {
  CRIMINAL = 'Criminal',
  CIVIL = 'Civil',
  CONSTITUTIONAL = 'Constitutional',
  FAMILY = 'Family',
  COMMERCIAL = 'Commercial',
  LABOR = 'Labor',
  TAX = 'Tax',
  ENVIRONMENTAL = 'Environmental'
}

export enum CaseStatus {
  FILED = 'Filed',
  PENDING = 'Pending',
  UNDER_TRIAL = 'Under Trial',
  JUDGMENT_RESERVED = 'Judgment Reserved',
  DECIDED = 'Decided',
  DISPOSED = 'Disposed',
  APPEALED = 'Appealed',
  DISMISSED = 'Dismissed'
}

export enum PartyType {
  PLAINTIFF = 'Plaintiff',
  DEFENDANT = 'Defendant',
  PETITIONER = 'Petitioner',
  RESPONDENT = 'Respondent',
  ACCUSED = 'Accused',
  COMPLAINANT = 'Complainant'
}

export enum EvidenceType {
  DOCUMENTARY = 'Documentary',
  PHYSICAL = 'Physical',
  DIGITAL = 'Digital',
  TESTIMONIAL = 'Testimonial',
  FORENSIC = 'Forensic',
  CIRCUMSTANTIAL = 'Circumstantial'
}

export enum WitnessType {
  EYE_WITNESS = 'Eye Witness',
  EXPERT_WITNESS = 'Expert Witness',
  CHARACTER_WITNESS = 'Character Witness',
  POLICE_WITNESS = 'Police Witness'
}

export enum AnalysisType {
  WRONGFUL_CONVICTION = 'Wrongful Conviction Analysis',
  PROSECUTORIAL_MISCONDUCT = 'Prosecutorial Misconduct',
  CASE_SIMILARITY = 'Case Similarity Analysis',
  BIAS_DETECTION = 'Bias Detection',
  PROCEDURAL_REVIEW = 'Procedural Review',
  EVIDENCE_RELIABILITY = 'Evidence Reliability'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum RecommendationType {
  INVESTIGATION = 'Investigation Required',
  LEGAL_REVIEW = 'Legal Review',
  POLICY_CHANGE = 'Policy Change',
  TRAINING = 'Training Required',
  ESCALATION = 'Escalate to Higher Authority',
  NO_ACTION = 'No Action Required'
}

export type ReliabilityScore = 1 | 2 | 3 | 4 | 5;
export type CredibilityScore = 1 | 2 | 3 | 4 | 5;

export interface Demographics {
  age?: number;
  gender?: string;
  caste?: string;
  religion?: string;
  economicStatus?: string;
  education?: string;
  occupation?: string;
}

export interface LegalSection {
  act: string;
  section: string;
  description: string;
  penalty?: string;
}

export interface Verdict {
  type: 'Guilty' | 'Not Guilty' | 'Acquitted' | 'Convicted';
  reasoning: string;
  date: Date;
}

export interface Sentence {
  type: string;
  duration?: string;
  fine?: number;
  conditions?: string[];
}

export interface CaseEvent {
  id: string;
  date: Date;
  type: string;
  description: string;
  participants: string[];
  documents?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  size: number;
  url: string;
}

// API Request/Response Types
export interface AnalysisRequest {
  caseId: string;
  analysisType: AnalysisType;
  additionalContext?: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  processingTime: number;
}