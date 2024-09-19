import { useData } from '@/app/context/dataContext';
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import ChildCardHori from '../child/ChildCardHori';

interface QuizFormProps {
  childrenData : any
  isLoading : string, 
  onSelect : (id : number) => void, 
  setTopic: (topic: string) => void, 
  onSave : () => void, 
  onClear : () => void, 
}

const QuizForm: React.FC<QuizFormProps> = ({childrenData, isLoading, onSelect, setTopic, onSave, onClear }) => {
  const [input, setInput] = useState('');
  const [childSelectedId, setChildSelectedId] = useState<number>() 
  const [showButtons, setShowButtons] = useState(false); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTopic(input);
      setInput('');
    }
  };

  const   handleSelect = (id : number ) => {
    setChildSelectedId(id);
    setShowButtons(true);
    onSelect(id);
  }

  const handleClear = () => {
    setShowButtons(false);
    onClear();
  }

  return (
    <div className="max-w-lg mx-auto p-6 shadow-md rounded-lg bg-gradient-to-r from-blue-800 via-blue-900 to-blue-600 font-stix">
      <h2 className="text-2xl font-bold mb-6 text-center font-satisfy text-white">Generate quizzes using AI</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          id="topic"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a quiz topic (e.g., animals, math)"
          className="w-full p-4 rounded-lg bg-white bg-opacity-20 placeholder-transparent text-white border border-gray-300 focus:ring-indigo-400 focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-gray-200"         
        />
        {childrenData && childrenData.length > 0 && childrenData.map((child : any) => (
          <div key={child.id}>
            <ChildCardHori 
              type='quiz'
              id={child.id}
              name={child.name} 
              age={child.age} 
              gender={child.gender} 
              icon={child.icon}
              callback={(id : any) => handleSelect(id)} 
            />
            {(!isLoading && showButtons && childSelectedId && childSelectedId === child.id) && (
            <div className='flex flex-row justify-between mt-4'>
              <button
                type="button"
                onClick={onSave}
                className="w-1/2 py-2 px-3 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300 ease-in-out mx-2">
                <div className='flex flex-row justify-center items-center space-x-2'>
                {isLoading === "save" ? <FaSpinner className='animate-spin' /> : "Save"}
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleClear()}
                className="w-1/2 py-2 px-3 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 ease-in-out mx-2">
                <div className='flex flex-row justify-center items-center space-x-2'>
                  {isLoading === "clear" ? <FaSpinner className='animate-spin' /> : "Clear"}
                </div>
              </button>
            </div>
          )}
        </div>
        ))}

        <button
          type="submit"
          className="w-full py-4 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <div className='flex flex-row justify-center'>
            {isLoading === "generate"? <FaSpinner className='animate-spin'/> : "Generate Quizzes"}
          </div>
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
