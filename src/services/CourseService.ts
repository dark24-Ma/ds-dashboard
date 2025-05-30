/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './api';
import type { Course, CourseFilterOptions, CourseUploadResponse } from '@/types/Course';

class CourseService {
  async getCourses(filters?: CourseFilterOptions): Promise<Course[]> {
    try {
      const params = filters || {};
      const response = await axiosInstance.get('/courses', { params });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des cours:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des cours');
    }
  }

  async getFreeCourses(): Promise<Course[]> {
    try {
      const response = await axiosInstance.get('/courses/free-access');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des cours gratuits:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des cours gratuits');
    }
  }

  async getCourseById(id: string): Promise<Course> {
    try {
      const response = await axiosInstance.get(`/courses/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération du cours:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du cours');
    }
  }

  async createCourse(courseData: FormData): Promise<Course> {
    try {
      const response = await axiosInstance.post('/courses', courseData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du cours:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du cours');
    }
  }

  async updateCourse(id: string, courseData: FormData): Promise<Course> {
    try {
      const response = await axiosInstance.put(`/courses/${id}`, courseData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du cours:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du cours');
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/courses/${id}`);
    } catch (error: any) {
      console.error('Erreur lors de la suppression du cours:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du cours');
    }
  }

  async uploadCourseThumbnail(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);
      
      const response = await axiosInstance.post('/courses/upload/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.thumbnailUrl;
    } catch (error: any) {
      console.error('Erreur lors de l\'upload de la miniature:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'upload de la miniature');
    }
  }

  // Méthode pour obtenir les tags disponibles
  async getAvailableTags(): Promise<string[]> {
    try {
      const response = await axiosInstance.get('/courses/tags');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des tags:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des tags');
    }
  }

  async downloadCourse(id: string): Promise<Blob> {
    try {
      // Utiliser responseType: 'blob' pour récupérer le fichier
      const response = await axiosInstance.get(`/courses/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors du téléchargement du cours:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement du cours');
    }
  }

  // Méthode pour obtenir tous les tags utilisés dans les cours
  async getAllTags(): Promise<string[]> {
    try {
      const courses = await this.getCourses();
      const tagsSet = new Set<string>();
      
      courses.forEach(course => {
        course.tags.forEach(tag => {
          tagsSet.add(tag);
        });
      });
      
      return Array.from(tagsSet);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des tags:', error);
      throw new Error('Erreur lors de la récupération des tags');
    }
  }
}

export default new CourseService();