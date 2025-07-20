import React, { useState, FormEvent } from 'react';

interface TodoFormProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, isLoading = false }) => {
  const [text, setText] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isLoading}
        className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   transition-all duration-200 ease-in-out
                   placeholder-gray-500"
      />
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg
                   hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-all duration-200 ease-in-out
                   transform active:scale-95"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </div>
        ) : (
          'Add Todo'
        )}
      </button>
    </form>
  );
};

export default TodoForm;