export interface SubscriptionType {
    id?: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    level?: number;
    features?: string[];
  }
  
  export interface UserSubscription {
    id: string;
    userId: string;
    user: {
      id: string;
      firstname: string;
      name: string;
      email: string;
    };
    isActive: string;
    subscriptionTypeId: string;
    subscriptionType: SubscriptionType;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'cancelled';
  }
  
  export interface SubscribeUserRequest {
    userId: string;
    subscriptionTypeId: string;
  }
  
  export interface CourseAccess {
    courseId: string;
    accessType: 'free' | 'premium';
    requiredSubscriptionTypes?: string[];
  }