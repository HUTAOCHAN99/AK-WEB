// File untuk tipe data yang digunakan bersama

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  tags?: string;
  created_at: string;
}

export interface PendingAdmin {
  id: string; // auth.users.id
  profile_id: number; // profiles.profile_id
  full_name?: string;
  email?: string;
  status: 'pending_verification' | 'active' | 'rejected';
  is_approved: boolean;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  reason?: string;
}


export interface Activity {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  status: 'active' | 'inactive';
  category?: string;
  order_index: number;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface Profile {
  id: string;
  profile_id: number;
  full_name?: string;
  email?: string;
  role: 'admin' | 'user' | 'super_admin';
  is_approved: boolean;
  status: 'pending_verification' | 'active' | 'rejected' | 'suspended';
  approved_by?: string;
  approved_at?: string;
  rejected_at?: string;
  suspended_at?: string;
  reason?: string;
  created_at: string;
  updated_at?: string;
}

export interface VerificationCode {
  id: string;
  user_id: string;
  code: string;
  expires_at: string;
  created_at: string;
  used_at?: string;
}

// Response types for API calls
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form data types
export interface ActivityFormData {
  title: string;
  description: string;
  icon_type: 'image' | 'icon';
  icon_name?: string;
  icon_file?: File;
  category?: string;
  status: 'active' | 'inactive';
  order_index: number;
  image_file?: File;
}

export interface TimelineFormData {
  title: string;
  date: string;
  description: string;
  tags?: string;
}

export interface AdminApprovalData {
  profile_id: number;
  admin_id: string;
  approved_by: string;
  action: 'approve' | 'reject';
}

// UI Component Props
export interface TabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Search and Filter types
export interface ActivityFilters {
  status?: 'active' | 'inactive';
  category?: string;
  search?: string;
  sortBy?: 'created_at' | 'order_index' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TimelineFilters {
  year?: number;
  month?: number;
  tags?: string[];
  search?: string;
}

// Statistics types
export interface DashboardStats {
  totalActivities: number;
  activeActivities: number;
  totalTimelineItems: number;
  pendingAdmins: number;
  totalAdmins: number;
  recentActivities: Activity[];
  recentTimeline: TimelineItem[];
}

// File upload types
export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
  fileSize: number;
  error?: string;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string[];
}

export interface AdminUser {
  id: string; // auth.users.id
  profile_id: number; // profiles.profile_id
  full_name?: string;
  email?: string;
  role: 'admin' | 'user' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  is_approved: boolean;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  last_login?: string;
}