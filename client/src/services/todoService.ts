import axios, { AxiosResponse } from 'axios';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface TodoService {
  getAllTodos(): Promise<Todo[]>;
  createTodo(text: string): Promise<Todo>;
  updateTodo(id: number, updates: UpdateTodoRequest): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
}

const todoService: TodoService = {
  getAllTodos: async (): Promise<Todo[]> => {
    const response: AxiosResponse<Todo[]> = await api.get('/todos');
    return response.data;
  },

  createTodo: async (text: string): Promise<Todo> => {
    const todoDto: CreateTodoRequest = { text: text };
    const response: AxiosResponse<Todo> = await api.post('/todos', todoDto);
    return response.data;
  },

  updateTodo: async (id: number, updates: UpdateTodoRequest): Promise<Todo> => {
    const response: AxiosResponse<Todo> = await api.put(`/todos/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  }
};

export default todoService;