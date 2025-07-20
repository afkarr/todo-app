export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
}

export interface ErrorResponse {
  error: string;
}