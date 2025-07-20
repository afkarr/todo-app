import React, { useState, FormEvent } from 'react';
import { Todo, UpdateTodoRequest } from '../types/todo.types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: UpdateTodoRequest) => void;
  onDelete: (id: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onUpdate, 
  onDelete, 
  isUpdating = false, 
  isDeleting = false 
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(todo.text);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (editText.trim() && !isUpdating) {
      onUpdate(todo.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCheckboxChange = (): void => {
    if (!isUpdating) {
      onUpdate(todo.id, { completed: !todo.completed });
    }
  };

  const handleEdit = (): void => {
    setEditText(todo.text);
    setIsEditing(true);
  };

  const handleCancel = (): void => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleDelete = (): void => {
    if (!isDeleting) {
      onDelete(todo.id);
    }
  };

  return (
    <li className="flex items-center p-4 border-b border-gray-200 last:border-b-0 group">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleCheckboxChange}
        disabled={isUpdating}
        className="w-5 h-5 mr-3 text-primary-500 bg-gray-100 border-gray-300 rounded 
                   focus:ring-primary-500 focus:ring-2 cursor-pointer
                   disabled:cursor-not-allowed disabled:opacity-50"
      />
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-3 py-1 text-base border border-primary-500 rounded
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus
            disabled={isUpdating}
          />
          <button
            type="submit"
            disabled={!editText.trim() || isUpdating}
            className="px-3 py-1 bg-success-500 text-white text-sm font-medium rounded
                       hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-1
                       disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition-colors duration-200"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isUpdating}
            className="px-3 py-1 bg-gray-500 text-white text-sm font-medium rounded
                       hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1
                       disabled:cursor-not-allowed
                       transition-colors duration-200"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <span
            className={`flex-1 text-base cursor-pointer select-none transition-all duration-200 ${
              todo.completed
                ? 'line-through text-gray-500'
                : 'text-gray-900 hover:text-primary-600'
            }`}
            onDoubleClick={handleEdit}
          >
            {todo.text}
          </span>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEdit}
              disabled={isUpdating || isDeleting}
              className="px-3 py-1 bg-success-500 text-white text-sm font-medium rounded
                         hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-1
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isUpdating || isDeleting}
              className="px-3 py-1 bg-error-500 text-white text-sm font-medium rounded
                         hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-1
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem;