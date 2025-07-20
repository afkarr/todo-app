export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
}

export interface TodoServiceResponse<T> {
  data?: T;
  error?: string;
}