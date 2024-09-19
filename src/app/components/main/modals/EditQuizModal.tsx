import React, { useState, ChangeEvent, useEffect } from 'react';
import { FaCheck, FaEdit, FaLightbulb, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { Quiz } from '@/types/interface';

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizToEdit: Quiz;
  onSave: (updatedQuiz: Quiz) => void;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({ isOpen, onClose, quizToEdit, onSave }) => {
  const [question, setQuestion] = useState(quizToEdit.question);
  const [correctAnswer, setCorrectAnswer] = useState(quizToEdit.correctAnswer);
  const [points, setPoints] = useState<any>(quizToEdit.points);
  const [optionsArray, setOptionsArray] = useState(quizToEdit.options ? quizToEdit.options.split(', ') : []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    setQuestion(quizToEdit.question);
    setCorrectAnswer(quizToEdit.correctAnswer);
    setPoints(quizToEdit.points);
    setOptionsArray(quizToEdit.options ? quizToEdit.options.split(', ') : []);
  }, [quizToEdit]);

  // Generate letters based on the current number of options (A, B, C, etc.)
  const getNextLetter = () => {
    return String.fromCharCode(65 + optionsArray.length);
  };

  const handleSave = () => {
    const options = optionsArray.join(', ');
    const updatedQuiz = {
      ...quizToEdit,
      question,
      options,
      correctAnswer,
      points,
    };
    onSave(updatedQuiz);
    onClose();
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptionsArray((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditValue(optionsArray[index]);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = (index: number) => {
    handleOptionChange(index, editValue);
    setEditingIndex(null);
    setEditValue('');
  };

  const handleAddOption = () => {
    const newLetter = getNextLetter(); // Get the next available letter (A, B, C, etc.)
    const newOptionsArray = [...optionsArray, newLetter];
    setOptionsArray(newOptionsArray);
    setEditingIndex(newOptionsArray.length - 1); // Set the newly added option into editing mode
    setEditValue(newLetter +") "); // Set the initial value to the letter
  };

  const handleRemoveOption = (index: number) => {
    setOptionsArray((prevOptions) => prevOptions.filter((_, i) => i !== index));
  };

  return isOpen ? (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 dark:from-blue-800 dark:via-blue-900 dark:to-blue-600 rounded-lg shadow-lg p-4 px-8 mt-3 w-full md:w-[60vw] lg:w-[60vw] max-h-[95vh] overflow-y-auto flex flex-col font-stix">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaLightbulb className="text-3xl mr-3" />
            <h2 className="text-xl font-bold font-satisfy">Edit Quiz</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>
        <div className="flex flex-col lg:flex-row md:justify-between gap-3 mb-3 mt-3">
          <input
            type="text"
            value={question}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
            className="text-lg font-semibold bg-white text-light-text placeholder:text-gray-500 bg-transparent border-none outline-none px-3 py-2 rounded-lg flex-grow"
            placeholder="Question"
          />
          <input
            type="number"
            value={points}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPoints(Number(e.target.value))}
            className="text-lg font-semibold bg-white text-light-text placeholder:text-gray-500 bg-transparent border-none outline-none px-3 py-2 rounded-lg flex-grow"
            placeholder="Points"
          />
        </div>

        <ul className="mb-4">
          {optionsArray.map((option, index) => (
            <li
              key={index}
              className="flex items-center justify-between mb-3 bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-400 text-white rounded-lg px-3 py-2"
              style={{ height: '50px' }} 
            >
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={handleEditChange}
                  onBlur={() => handleEditSave(index)}
                  className="text-lg text-dark-text placeholder:text-gray-500 bg-transparent border-none outline-none px-3 py-2 rounded-lg w-full"
                />
              ) : (
                <span className="flex-grow">{option}</span>
              )}
              {editingIndex !== index && (
                <FaEdit
                  onClick={() => handleEditClick(index)}
                  className="ml-2 cursor-pointer"
                />
              )}
              {editingIndex === index && (
                <FaCheck
                  onClick={() => handleEditSave(index)}
                  className="ml-2 cursor-pointer text-dark-text"
                />
              )}
              <FaTrash
                onClick={() => handleRemoveOption(index)}
                className="ml-2 cursor-pointer text-dark-text"
              />
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center">
          <button
            onClick={handleAddOption}
            className="bg-transparent text-dark-text px-4 py-2 rounded-full flex items-center justify-center space-x-2 hover:bg-indigo-500 dark:hover:bg-indigo-500 transition"
          >
            <FaPlus />
            <span>Add Option</span>
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-dark-text px-4 py-2 rounded-full flex items-center justify-center space-x-2 hover:bg-indigo-500 dark:hover:bg-indigo-500 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditQuizModal;
