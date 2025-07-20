import { Router, Request, Response, NextFunction } from 'express';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo.types';

const router: Router = Router();

// In-memory storage
let todos: Todo[] = [];

// Validation middleware
const validateTodoText = (req: Request, res: Response, next: NextFunction): void => {
  const { text } = req.body as CreateTodoRequest;
  
  if (!text || typeof text !== 'string' || text.trim() === '') {
    res.status(400).json({ error: 'Todo text is required and must be a non-empty string' });
    return;
  }
  
  next();
};

// Get all todos
router.get('/', (_: Request, res: Response): void => {
  res.json(todos);
});

// Create a new todo
router.post('/', validateTodoText, (req: Request, res: Response): void => {
  const { text } = req.body as CreateTodoRequest;
  
  const newTodo: Todo = {
    id: todos.length + 1,
    text: text.trim(),
    completed: false,
    createdAt: new Date()
  };
  
  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// Update a todo
router.put('/:id', (req: Request, res: Response): void => {
  const id: number = parseInt(req.params.id, 10);
  const { text, completed } = req.body as UpdateTodoRequest;
  
  if (isNaN(id)) {
    res.status(422).json({ error: 'Invalid todo ID' });
    return;
  }
  
  const todoIndex: number = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }
  
  // Validate and update
  if (text !== undefined) {
    if (typeof text !== 'string' || text.trim() === '') {
      res.status(422).json({ error: 'Text must be a non-empty string' });
      return;
    }
    todos[todoIndex].text = text.trim();
  }
  
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      res.status(422).json({ error: 'Completed must be a boolean' });
      return;
    }
    todos[todoIndex].completed = completed;
  }
  
  todos[todoIndex].updatedAt = new Date();
  res.json(todos[todoIndex]);
});

// Delete a todo
router.delete('/:id', (req: Request, res: Response): void => {
  const id: number = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(422).json({ error: 'Invalid todo ID' });
    return;
  }
  
  const initialLength: number = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  
  if (todos.length === initialLength) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }
  
  res.status(204).send();
});

export { router as todoRouter };