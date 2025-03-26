export interface Subscriber {
    id: number;
    email: string;
    subscribed_at: Date;
    status: 'active' | 'unsubscribed';
    last_email_sent?: Date;
  }
  
  export interface NewsletterTemplate {
    id: number;
    title: string;
    content: string;
    created_at: Date;
  }