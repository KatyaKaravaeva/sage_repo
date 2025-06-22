export interface Backend {
  backendId: number;
  backendName: string;
  adapterName: string;
  backendURL: string;
}

export interface BackendRule {
  ruleId: number;
  priority: number;
  courseId: string;
  quizId: string;
  backendName: string;
  studentIds: string[];
  options?: {
    key: string;
    value: string;
  }[];
}

export interface BackendOption {
  key: string;
  values: string[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
} 