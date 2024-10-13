import React, { useEffect, useState } from 'react';
import { Quiz } from '@/types/interface';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { apiUpdateChild, apiUpdateQuiz } from '@/lib/apiHelper';
import Confetti from 'react-confetti';

interface QuizCardProps {
  type?: "parent" | "child";
  quiz: Quiz;
  onRemove?: (quiz: Quiz) => void;
  onEdit?: (quiz: Quiz) => void;
  childId?: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onRemove, onEdit, type, childId }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  const optionsArray = quiz.options ? quiz.options.split(', ') : [];
  const correctAnswer = quiz.correctAnswer;

  useEffect(() => {
    if (quiz.childAnswer) {
      setSelectedOption(quiz.childAnswer);
      setIsCardFrozen(true);
    }
  }, [quiz]);

  const handleOptionClick = async (option: string) => {
    if (type === "child" && !isCardFrozen) {
      const isCorrect = option === correctAnswer;
      setSelectedOption(option);
      setIsCardFrozen(true);
      
      // Update the quiz and UI after option is clicked
      handleUpdateUI(isCorrect);
      await updateQuiz(option, isCorrect);
    }
  };
  
  const updateQuiz = async (answer: string, isCorrect: boolean) => {
    if (!updated) {
      const updatedQuiz: Quiz = {
        ...quiz,
        childAnswer: answer,
        isAnsweredCorrectly: isCorrect,
      };

      const response = await apiUpdateQuiz(updatedQuiz);
      console.log("response", response);

      if (response.id) {
        setUpdated(true);
      }

    }
  };

  const handleUpdateUI = (isCorrect : boolean) => {
    if(isCorrect){
      if(!confettiTriggered){
    
        const audio = new Audio('/sounds/yay.mp3');
        audio.play();

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
        setConfettiTriggered(true);
      }
    }
    else{
      const audio = new Audio('/sounds/nop.mp3');
      audio.play();
    }
  
  };

  return (
    <div
      className={`bg-gradient-to-r from-blue-800 via-blue-900 to-blue-600 rounded-xl shadow-lg p-6 flex flex-col transform transition-transform duration-300 hover:scale-105 font-stix ${
        isCardFrozen ? 'pointer-events-none' : ''
      }`}
    >
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white font-stix">
          {quiz.question}
        </h3>
        <h4 className="inline-block ml-3 bg-yellow-400 hover:bg-yellow-500 text-light-text px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
          {quiz.points}
        </h4>
      </div>
      <ul className="mb-4">
        {optionsArray && Array.isArray(optionsArray) && optionsArray.length > 0 && optionsArray.map((option, index) => {
          const isSelected = option === selectedOption;
          const isCorrect = option === correctAnswer;
          const optionClass = type === "child" ? (
            isSelected ? (
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            ) : 'bg-indigo-600'
          ) : 'bg-indigo-600';

          return (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`mb-3 rounded-lg px-3 py-2 cursor-pointer ${optionClass} text-white ${
                isCardFrozen ? 'pointer-events-none' : 'hover:bg-indigo-400'
              }`}
            >
              {option}
            </li>
          );
        })}
      </ul>
      {type === "child" && isCardFrozen && (
        <div className="mt-2 text-white font-bold">
          <p>Correct Answer: {correctAnswer}</p>
        </div>
      )}
      {type === "parent" && (
        <div className='flex flex-row justify-between'>
          <button
            onClick={() => onRemove ? onRemove(quiz) : null}
            className="mt-auto bg-indigo-600 text-dark-text px-4 py-2 rounded-full flex items-center justify-center space-x-2 hover:bg-indigo-500 dark:hover:bg-indigo-500 transition"
          >
            <FaTrash className="inline" />
            <span>Remove</span>
          </button>
          <button
            onClick={() => onEdit ? onEdit(quiz) : null}
            className="mt-auto bg-indigo-600 text-dark-text px-4 py-2 rounded-full flex items-center justify-center space-x-2 hover:bg-indigo-500 dark:hover:bg-indigo-500 transition"
          >
            <FaEdit className="inline" />
            <span>Edit</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
