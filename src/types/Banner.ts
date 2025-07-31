export interface Banner {
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  displayOrder: number;
  startDate?: Date;
  endDate?: Date;
  targetAudience?: 'all' | 'clients' | 'subscribers';
  clickCount?: number;
  impressions?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BannerFilterOptions {
  isActive?: boolean;
  targetAudience?: string;
  page?: number;
  limit?: number;
}

export interface BannerUploadResponse {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  displayOrder: number;
} 