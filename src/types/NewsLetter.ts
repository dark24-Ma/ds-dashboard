export interface Subscriber {
    id: number;
    email: string;
    subscribed_at: Date;
    status: 'active' | 'unsubscribed';
    last_email_sent?: Date;
  }
  
  export interface NewsletterTemplate {
    name?: string;
    subject: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    status?: 'draft' | 'published';
  }

  export interface SendNewsletterRequest {
    templateId: string;
    recipientIds?: string[]; // Si null, envoi à tous les abonnés
    subject?: string; 
  }
