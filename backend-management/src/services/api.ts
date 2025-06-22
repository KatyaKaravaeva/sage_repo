import axios from 'axios';
import { Backend, BackendRule, BackendOption } from '../types';

// Mock data for development
const MOCK_MODE = true; // Set this to false when backend is ready

interface MockBackendOptions {
  [key: string]: BackendOption[];
}

const mockData = {
  adapters: ['OpenAI', 'Anthropic', 'Google', 'Custom'],
  backends: [
    { backendId: 1, backendName: 'GPT-4', adapterName: 'OpenAI', backendURL: 'https://api.openai.com/v1' },
    { backendId: 2, backendName: 'Claude', adapterName: 'Anthropic', backendURL: 'https://api.anthropic.com' },
  ],
  rules: [
    {
      ruleId: 1,
      priority: 0,
      courseId: 'COURSE-101',
      quizId: '*',
      backendName: 'GPT-4',
      studentIds: [],
      options: [{ key: 'model', value: 'gpt-4' }],
    },
    {
      ruleId: 2,
      priority: 1,
      courseId: 'COURSE-102',
      quizId: 'QUIZ-1',
      backendName: 'Claude',
      studentIds: ['student1', 'student2'],
      options: [{ key: 'model', value: 'claude-2' }],
    },
  ],
  backendOptions: {
    'GPT-4': [
      { key: 'model', values: ['gpt-4', 'gpt-3.5-turbo'] },
      { key: 'temperature', values: ['0.0', '0.5', '1.0'] },
    ],
    'Claude': [
      { key: 'model', values: ['claude-2', 'claude-instant'] },
      { key: 'temperature', values: ['0.1', '0.5', '0.9'] },
    ],
  } as MockBackendOptions,
};

const api = axios.create({
  baseURL: '/api/config',
  timeout: 5000, // 5 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (MOCK_MODE) {
      // Return mock data in development
      return Promise.resolve({ data: {} });
    }
    return Promise.reject(error);
  }
);

export const getAvailableAdapters = async (): Promise<string[]> => {
  if (MOCK_MODE) return mockData.adapters;
  const response = await api.get('/getAvailableAdapters');
  return response.data.adapters;
};

export const getAvailableBackends = async (): Promise<Backend[]> => {
  if (MOCK_MODE) return mockData.backends;
  const response = await api.get('/getAvailableBackends');
  return response.data.backends;
};

export const addBackend = async (data: Omit<Backend, 'backendId'>): Promise<number> => {
  if (MOCK_MODE) return Math.floor(Math.random() * 1000) + 3;
  const response = await api.post('/addBackend', data);
  return response.data.backendId;
};

export const editBackend = async (data: Backend): Promise<void> => {
  if (MOCK_MODE) return;
  await api.post('/editBackend', data);
};

export const removeBackend = async (backendId: number): Promise<void> => {
  if (MOCK_MODE) return;
  await api.post('/removeBackend', { backendId });
};

export const getBackendToCourseRules = async (): Promise<BackendRule[]> => {
  if (MOCK_MODE) return mockData.rules;
  const response = await api.get('/getBackendToCourseRules');
  return response.data.links;
};

export const addBackendToCourseRule = async (data: Omit<BackendRule, 'ruleId'>): Promise<number> => {
  if (MOCK_MODE) return Math.floor(Math.random() * 1000) + 3;
  const response = await api.post('/addBackendToCourseRule', data);
  return response.data.ruleId;
};

export const editBackendToCourseRule = async (data: BackendRule): Promise<void> => {
  if (MOCK_MODE) return;
  await api.post('/editBackendToCourseRule', data);
};

export const removeBackendToCourseRule = async (ruleId: number): Promise<void> => {
  if (MOCK_MODE) return;
  await api.post('/removeBackendToCourseRule', { ruleId });
};

export const getBackendOptions = async (backendName: string): Promise<BackendOption[]> => {
  if (MOCK_MODE) return mockData.backendOptions[backendName] || [];
  const response = await api.get('/getBackendOptions', { params: { backendName } });
  return response.data.options;
}; 