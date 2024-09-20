"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { apiGetChildQuizzes, apiInsertQuizzes, apiPromptGemini, apiSendNotification, apiUpdateChild, apiUpdateQuiz } from '@/lib/apiHelper';
import QuizCard from './QuizCard';
import QuizForm from './QuizForm';
import { Child, Notif, Quiz } from '@/types/interface';
import { useData } from '@/app/context/dataContext';
import AddQuizzesCard from './AddQuizzes';
import { assertInt } from '@/utils/helper';
import EditQuizModal from '../modals/EditQuizModal';
import Alert from '../../Alert';
import { FaCheck, FaStar } from 'react-icons/fa';
import { capitalizeFirstLetter } from '@/utils/formater';

const Quizzes: React.FC<{user : any}> = ({user}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<string>("");
  const [selectedChild, setSelectedChild] = useState<Child>()
  const [childrenData, setChildren] = useState<any>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<any>(false);
  const [quizToEdit, setQuizToEdit] = useState<any>(false);
  const [status, setStatus] = useState<{ success: string; message: string; bg? : string}>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [childQuizzes, setChildQuizzes] = useState<Quiz[]>();
  const [filteredChildQuizzes, setFilteredChildQuizzes] = useState<Quiz[]>();
  const [topicFilter, setTopicFilter] = useState('All');
  const [filter, setFilter] = useState<{type?: "new" | "answered", topic?: string}>({type: "new"});
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [topics, setTopics] = useState<string[]>(["No Topics"]);

  let userId: number | undefined = undefined;
  let userType: string | undefined = undefined;

  if(user){
    userId = user.id;
    userType = user.type;
  }

  const data = useData();

  useEffect(() => {
    setChildren(data.children);
  }, [data])

  const handleSetTopic = (topic: string) => {
    console.log("Topic received:", topic);
    setTopic(topic);
    setIsLoading("generate");
  };

  const formatAndSetQuizzes = useCallback((rawData: string) => {
    const questionSections = rawData.split(/\d+-/).filter(Boolean);
  
    const formattedQuizzes: Quiz[] = questionSections.map((section, index) => {
      const lines = section.trim().split('\n');
  
      const questionLine = lines[0].trim();
      let options: string = '';
      let correctAnswer = '';
      let points = 0;
  
      // Parse the options, correct answer, and points
      lines.slice(1).forEach((line) => {
        line = line.trim();
  
        // Match lettered options (e.g., A) Canada)
        if (line.match(/^[A-C]\)/)) {
          options += (options ? ', ' : '') + line;
        } else if (line.startsWith('-correct answer:')) {
          // Extract the correct answer (e.g., C) Russia)
          const answerMatch = line.match(/-correct answer:\s*([A-C]\)\s*.+)/);
          if (answerMatch) {
            correctAnswer = answerMatch[1];
          }
        } else if (line.startsWith('-points:')) {
          // Extract the points (e.g., -points: 10)
          const pointsMatch = line.match(/-points:\s*(\d+)/);
          if (pointsMatch) {
            points = parseInt(pointsMatch[1], 10);
          }
        }
      });
  
      // Construct the quiz object
      return {
        id: index,
        topic: topic,
        childId: selectedChild?.id,
        parentId: user.id,
        question: questionLine,
        options,
        correctAnswer,
        points, 
      };
    });
  
    // Add each quiz to the state one by one with a delay
    formattedQuizzes.forEach((quiz, index) => {
      setTimeout(() => {
        setQuizzes(prev => [...prev, quiz]);
      }, index * 300); 
    });
  
    setIsLoading("");
  }, [topic, selectedChild?.id, user.id, setQuizzes, setIsLoading]);
  
  
  const fetchQuizzes = useCallback(async () => {
    if (topic && selectedChild) {
      try {
        const prompt = `Give quizzes for a child of age ${selectedChild.age}, it should be about ${topic}, and should have 3 options each, 
        followed with the right answer, you overall answer should be in this format: 
          1-What is the largest country in the world?
            A) Canada
            B) Algeria
            C) Russia
            -correct answer: C) Russia
            -points: 10
          2-.........
            do not give anything else, no yapping, no introduction, no conclusion, just quizzes with the given format,
            do not give two identical answers withing the same setting,
            increase the difficulty and assign points to the quiz according to its difficulty level, 
            but make sure the quizzes difficulty matches the child's age, don't make the points random, 
            they should be from 1 to 10 depending on the quiz difficulty`;
        const result = await apiPromptGemini(prompt);
        if (result) {
          formatAndSetQuizzes(result);
        } else {
          console.error('Empty response from API');
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    }
  }, [topic, selectedChild, formatAndSetQuizzes]);
  
  useEffect(() => {
    if(userType === "parent")
      fetchQuizzes();
  }, [selectedChild, topic])

  const removeQuiz = (quizToRemove : Quiz) => {
    const updatedQuizzes =  quizzes.filter((quiz : Quiz) => (quiz.id !== quizToRemove.id))
    setQuizzes(updatedQuizzes);
  }

  const editQuiz = (quizToEdit : Quiz) => {
    console.log("quizToEdit", quizToEdit);
    setQuizToEdit(quizToEdit);
    setIsEditModalOpen(true);
  }

  const setChildSelect = (id : number) => {
    const selectedChild = childrenData.filter((child : Child) => assertInt(child.id) === assertInt(id))
    setSelectedChild((selectedChild && selectedChild.length > 0)? selectedChild[0] : null);
  }

  const generateMore = () =>{
    setIsLoading("generate");
    fetchQuizzes();
  }

  const handleClear = () => {
    setIsLoading("clear");
    setQuizzes([]);
  }

  const handleInsertingQuizzes = async () => {
    setIsLoading("save");
    const response = await apiInsertQuizzes(quizzes);
    setIsAlertOpen(true);
    if(response === "ok"){
      setStatus({success : "Success!", message: "Quizzes has been saved succesfully", bg: "bg-blue-500"})
    }
    else {
      setStatus({success : "Error!", message: "Quizzes has not been saved, please try again"})
    }
    setTimeout(() => {
      setIsAlertOpen(false);
    }, 3000)

    handleClear();

    //send notification
    const notification : Notif = {
      title: 'Parent just assigned quizzes to you!',
      content: `${quizzes.length} quizzes`,
      description: `${quizzes[0].topic}`,
      type: "challenge_added",
    }      

    const notifResponse = await apiSendNotification(user.id, quizzes[0].childId, "child", notification);

  }

  const saveUpdatedQuiz = async (quizToUpdate: Quiz) => {
    const updatedQuizzes = quizzes.map((quiz: Quiz) =>
      quiz.id === quizToUpdate.id ? quizToUpdate : quiz
    );  
    setQuizzes(updatedQuizzes);
  };

  //-------------------------userType === child-------------------------------//
  useEffect(() => {
    const fetchChildQuizzes = async () => {
      const response = userId? await apiGetChildQuizzes(userId) : null;
      console.log("response", response);

      if(response && response.quizzes && response.quizzes.length > 0){
        const quizzes = response.quizzes.sort(
          (a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );  
        setChildQuizzes(quizzes);
      
        //get topics
        let topics = quizzes
          .map((quiz: Quiz) => quiz.topic)
          .filter((topic: string, index: number, self:any) => topic && self.indexOf(topic) === index);
          topics = ["All Topics", ...topics];
        setTopics(topics);
      }
    }
   
    if(userType === "child")
      fetchChildQuizzes()
  }, [userId, userType])

  useEffect(() => {
    if (filter.type === "new") {
      const filteredQuizzes = childQuizzes?.filter((quiz : Quiz) => !quiz.childAnswer);
      setFilteredChildQuizzes(filteredQuizzes);
    }
  }, [filter, childQuizzes])

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTopicFilter(event.target.value);
    setFilter(prev => ({ ...prev, topic: event.target.value }));
  };

  const updateChildData = useCallback(async (correctAnswersCount: number, totalPoints: number) => {
    try {
      const response = await apiUpdateChild(user.id, {
        quizzesCorrectAnswersCount: correctAnswersCount,
        quizzesTotalPoints: totalPoints
      });
      console.log("response", response);
    } catch (error) {
      console.error('Error updating child data:', error);
    }
  }, [user.id]);
  
 // useEffect(() => {
 //   if(user.type === "child"){
 //     let correctAnswersCount : string | number | null= localStorage.getItem("correctAnswersCount");
 //     let totalPoints : string | number | null = localStorage.getItem("totalPoints");
 //     
 //     // Ensure the values are parsed only if they exist (not null), otherwise default to 0
 //     correctAnswersCount = correctAnswersCount ? assertInt(JSON.parse(correctAnswersCount)) : 0;
 //     totalPoints = totalPoints ? assertInt(JSON.parse(totalPoints)) : 0;
//
//
 //     correctAnswersCount? setCorrectAnswersCount(correctAnswersCount) : null;
 //     totalPoints? setTotalPoints(totalPoints) : null;
 //     correctAnswersCount && totalPoints? updateChildData(correctAnswersCount, totalPoints) : null;      
 //   }
 //   
 // }, [setCorrectAnswersCount, setTotalPoints, updateChildData, user.type])

  useEffect(() => {
    let filteredQuizzes = childQuizzes;
  
    // Apply type-based filtering
    if (filter.type === "new") {
      filteredQuizzes = filteredQuizzes?.filter((quiz: Quiz) => !quiz.childAnswer);
    } else if (filter.type === "answered") {
      filteredQuizzes = filteredQuizzes?.filter((quiz: Quiz) => quiz.childAnswer);
    }
  
    // Apply topic-based filtering
    if (filter.topic && filter.topic.toLowerCase() !== "all topics") {
      filteredQuizzes = filteredQuizzes?.filter((quiz: Quiz) => quiz.topic === filter.topic);
    }
  
    // Update filtered quizzes state
    setFilteredChildQuizzes(filteredQuizzes);
  
    // Calculate correct answers and total points
    const answeredCorrectly = filteredQuizzes?.filter((quiz: Quiz) => quiz.isAnsweredCorrectly);
    const correctAnswersCount = answeredCorrectly?.length? answeredCorrectly?.length : null;
    correctAnswersCount? setCorrectAnswersCount(correctAnswersCount) : null;
  
    const totalPoints = answeredCorrectly?.reduce((accumulator, quiz) => accumulator + (quiz.points || 0), 0);
    totalPoints? setTotalPoints(totalPoints) : null;
  
    localStorage.setItem("correctAnswersCount", JSON.stringify(correctAnswersCount));
    localStorage.setItem("totalPoints", JSON.stringify(totalPoints));

  }, [filter, childQuizzes]);
  
  return (
    <>
      {user.type === "parent" ? (
        <div className="p-1 px-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-1">
              <QuizForm
                childrenData={childrenData}
                isLoading={isLoading}
                setTopic={(topic) => handleSetTopic(topic)}
                onSelect={(id) => setChildSelect(id)}
                onClear={() => handleClear()}
                onSave={() => handleInsertingQuizzes()}
              />
            </div>
  
            {/* QuizCards: On large screens, they will take up 2 columns and stack vertically on small/medium screens */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <QuizCard
                    type='parent'
                    key={quiz.id}
                    quiz={quiz}
                    onRemove={(quiz) => removeQuiz(quiz)}
                    onEdit={(quiz) => editQuiz(quiz)}
                  />
                ))
              ) : (
                <></>
              )}
              {quizzes.length > 0 && (
                <AddQuizzesCard isLoading={isLoading} onClick={generateMore} />
              )}
            </div>
          </div>
          <EditQuizModal
            isOpen={isEditModalOpen}
            quizToEdit={quizToEdit}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedQuiz) => saveUpdatedQuiz(updatedQuiz)}
          />
          {isAlertOpen && (
            <Alert
              title={status?.success}
              message={status?.message}
              bg={status?.bg}
              onClose={() => setIsAlertOpen(false)}
            />
          )}
        </div>
      ) : (
        <div className="p-2 px-0 font-stix">
        {/* Floating horizontal selector */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-600 rounded-xl shadow-lg p-4 flex justify-between items-center mb-4 ">
          <div className="flex justify-center space-x-4">
            <button onClick={() => setFilter(prev => ({...prev, type: "new" }))} className={`${filter.type === "new"? 'bg-indigo-400' : 'bg-indigo-600'} hover:bg-indigo-400 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105 md:text-lg text-base`}>
              New Quizzes
            </button>
            <button onClick={() => setFilter(prev => ({...prev, type: "answered" }))} className={`${filter.type === "answered"? 'bg-indigo-400' : 'bg-indigo-600'} hover:bg-indigo-400 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105 md:text-lg text-base`}>
              Already Answered
            </button>
            <select
              className="bg-indigo-600 hover:bg-indigo-400 outline-none text-white cursor-pointer py-2 px-4 rounded-full shadow- md:text-lg text-base"
              value={topicFilter}
              onChange={(e) => handleFilterChange(e)}
            >
              {topics && topics.length > 0 && topics.map((topic, index) => (
                <option
                  key={index}
                  className="cursor-pointer outline-none h-12 hover:bg-indigo-500"
                  value={topic}
                >
                  {capitalizeFirstLetter(topic)}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Floating horizontal div for Correct Answers and Score */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-600 rounded-xl shadow-lg p-4 flex justify-between items-center mb-4 transform transition-transform duration-300 hover:scale-105">
          <div className="flex flex-row md:text-lg text-base font-satisfy font-semibold text-white">
            <FaCheck className="mr-2 mt-1" />
            <span>Correct Answers: {correctAnswersCount}</span>
          </div>
          <div className="flex flex-rowmd:text-lg text-base mr-5 font-satisfy font-semibold text-white">
            <FaStar className="mr-2 mt-1" />
            <span>Score: {totalPoints} pts</span>
          </div>
        </div>
  
        {/* Grid of quizzes */}
        {filteredChildQuizzes && filteredChildQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChildQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} type="child" quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No quizzes available</div>
        )}
      </div>
      )}
    </>
  );  
};

export default Quizzes;
