export type CourseResourceType = 'pdf' | 'video';
export type UserRole = 'client' | 'admin' | 'instructor';

export interface Course {
  id?: string;
  title: string;
  description: string;
  resourceType: CourseResourceType;
  tags: string[];
  accessibleTo: UserRole[];
  duration: number; // en minutes
  fileUrl?: string;
  thumbnailUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseUploadResponse {
  id: string;
  fileUrl: string;
  thumbnailUrl: string;
}

export interface CourseFilterOptions {
  resourceType?: CourseResourceType;
  tags?: string[];
  accessibleTo?: UserRole;
  search?: string;
}