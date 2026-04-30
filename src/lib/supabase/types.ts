export type Database = {
  public: {
    Tables: {
      programs: {
        Row: {
          id: string;
          title: string;
          description: string;
          full_description: string | null;
          image: string;
          duration: string | null;
          participants: string | null;
          locations: string[] | null;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          full_description?: string | null;
          image: string;
          duration?: string | null;
          participants?: string | null;
          locations?: string[] | null;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          full_description?: string | null;
          image?: string;
          duration?: string | null;
          participants?: string | null;
          locations?: string[] | null;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          image: string;
          type: 'featured' | 'upcoming';
          participants: number;
          feedback: number | null;
          hours: number | null;
          summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          location: string;
          image: string;
          type: 'featured' | 'upcoming';
          participants?: number;
          feedback?: number | null;
          hours?: number | null;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          location?: string;
          image?: string;
          type?: 'featured' | 'upcoming';
          participants?: number;
          feedback?: number | null;
          hours?: number | null;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          phone: string | null;
          status: 'pending' | 'confirmed' | 'cancelled';
          registered_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          phone?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          registered_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          registered_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      trainings: {
        Row: {
          id: string;
          title: string;
          description: string;
          duration: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          image: string;
          instructor: string | null;
          price: string | null;
          format: 'online' | 'in-person' | 'hybrid' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          duration: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          image: string;
          instructor?: string | null;
          price?: string | null;
          format?: 'online' | 'in-person' | 'hybrid' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          duration?: string;
          level?: 'beginner' | 'intermediate' | 'advanced';
          image?: string;
          instructor?: string | null;
          price?: string | null;
          format?: 'online' | 'in-person' | 'hybrid' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: 'active' | 'completed' | 'upcoming';
          image: string;
          start_date: string | null;
          end_date: string | null;
          progress: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status: 'active' | 'completed' | 'upcoming';
          image: string;
          start_date?: string | null;
          end_date?: string | null;
          progress?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'active' | 'completed' | 'upcoming';
          image?: string;
          start_date?: string | null;
          end_date?: string | null;
          progress?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          title: string;
          description: string;
          start_year: number;
          end_year: number;
          image: string;
          category: string;
          summary: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          start_year: number;
          end_year: number;
          image?: string;
          category: string;
          summary?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          start_year?: number;
          end_year?: number;
          image?: string;
          category?: string;
          summary?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_info: {
        Row: {
          id: string;
          type: 'email' | 'phone' | 'address' | 'social';
          label: string;
          value: string;
          is_primary: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'email' | 'phone' | 'address' | 'social';
          label: string;
          value: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'email' | 'phone' | 'address' | 'social';
          label?: string;
          value?: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

