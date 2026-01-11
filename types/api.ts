// ============================================
// API Response Types
// ============================================

export type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// ============================================
// Auth Types
// ============================================

export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = LoginCredentials & {
  displayName?: string;
  nativeLanguage: string;
  targetLanguage: string;
};
