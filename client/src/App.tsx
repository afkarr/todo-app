import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import todoService from './services/todoService';
import { Todo, UpdateTodoRequest } from './types/todo.types';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [operationStates, setOperationStates] = useState<{
    adding: boolean;
    updating: Record<number, boolean>;
    deleting: Record<number, boolean>;
  }>({
    adding: false,
    updating: {},
    deleting: {}
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await todoService.getAllTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos. Please try again.');
      console.error('Fetch todos error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (text: string): Promise<void> => {
    try {
      setOperationStates(prev => ({ ...prev, adding: true }));
      const newTodo = await todoService.createTodo(text);
      setTodos([...todos, newTodo]);
      setError(null);
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Add todo error:', err);
    } finally {
      setOperationStates(prev => ({ ...prev, adding: false }));
    }
  };

  const handleUpdateTodo = async (id: number, updates: UpdateTodoRequest): Promise<void> => {
    try {
      setOperationStates(prev => ({
        ...prev,
        updating: { ...prev.updating, [id]: true }
      }));
      
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setError(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Update todo error:', err);
    } finally {
      setOperationStates(prev => ({
        ...prev,
        updating: { ...prev.updating, [id]: false }
      }));
    }
  };

  const handleDeleteTodo = async (id: number): Promise<void> => {
    try {
      setOperationStates(prev => ({
        ...prev,
        deleting: { ...prev.deleting, [id]: true }
      }));
      
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Delete todo error:', err);
    } finally {
      setOperationStates(prev => ({
        ...prev,
        deleting: { ...prev.deleting, [id]: false }
      }));
    }
  };

  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-light text-gray-800 mb-2">
            Todo App
          </h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </header>

        <main className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Todo Form */}
            <TodoForm onSubmit={handleAddTodo} isLoading={operationStates.adding} />

            {/* Todo List */}
            {(
              <ul className="border border-gray-200 rounded-lg overflow-hidden">
                {todos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={handleUpdateTodo}
                    onDelete={handleDeleteTodo}
                    isUpdating={operationStates.updating[todo.id]}
                    isDeleting={operationStates.deleting[todo.id]}
                  />
                ))}
              </ul>
            )}

            {/* Footer */}
            {todos.length > 0 && (
              <footer className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  <span className="font-semibold text-primary-600">{activeTodoCount}</span>{' '}
                  {activeTodoCount === 1 ? 'active item' : 'active items'} left
                </p>
              </footer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;