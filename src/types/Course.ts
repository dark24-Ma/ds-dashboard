/* eslint-disable @typescript-eslint/no-explicit-any */
export type CourseResourceType = 'pdf' | 'video' | 'link';
export type UserRole = 'client' | 'admin' | 'instructor';

export interface CourseResource {
  id?: string;
  title: string;
  resourceType: CourseResourceType;
  resourceUrl: string;
  fileName?: string;
  duration: number;
  order: number;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  resourceType?: CourseResourceType;
  resourceUrl?: string;
  thumbnailUrl?: string;
  duration: number;
  tags: string[];
  accessibleTo: string[];
  isFeatured?: boolean;
  isFreeAccess?: boolean;
  downloadCount?: number;
  viewCount?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  fileName?: string;
  resources: CourseResource[];
}

export interface CourseFilterOptions {
  tag?: string;
  search?: string;
  resourceType?: string;
  userType?: string;
  page?: number;
  limit?: number;
}

export interface CourseFilter {
  search?: string;
  resourceType?: CourseResourceType;
  tags?: string[];
}

export interface CourseUploadResponse {
  id: string;
  title: string;
  description: string;
  resourceType: CourseResourceType;
  resourceUrl: string;
  thumbnailUrl?: string;
  duration: number;
  tags: string[];
}