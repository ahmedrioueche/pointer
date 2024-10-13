  import React, { useState } from 'react';
  import { FaClock, FaUsers, FaGift, FaTrophy, FaArrowCircleDown, FaArrowCircleUp, FaComment, FaFileAlt, FaEdit, FaTrash } from 'react-icons/fa';
  import ChildCardHori from '../child/ChildCardHori'; // Assuming you have this component
  import { Challenge, Child } from '@/types/interface';
  import { capitalizeFirstLetter, formatDateTime } from '@/lib/formater';
  import ConfirmModal from '../modals/ConfirmModal';
  import { apiDeleteChallenge } from '@/lib/apiHelper';
  import Alert from '../../Alert';

  interface ChallengeCardProps {
    user: any;
    challenge: Challenge;
    childrenData: Child[];
    onEdit: (challenge : Challenge) => void;
  }

  const confirmModalText = {
    title: "Delete Challenge",
    body: "Are you sure you want to delete this challenge?"
  }

  const ChallengeCard: React.FC<ChallengeCardProps> = ({ user, challenge, childrenData, onEdit }) => {

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [status, setStatus] = useState<{ success: string; message: string; bg? : string}>();

    const assignedChildrenIds = challenge.assignedTo ? challenge.assignedTo.split(',') : [];
    const rewardsList = challenge.rewards ? challenge.rewards.split(',') : [];

    const assignedChildren = childrenData.filter(child =>  assignedChildrenIds.includes(String(child.id)));
    const handleCollapse = () => {
      setIsCollapsed(prev => !prev)
    }

    const handleDeleteChallenge = async () => {
      const response = await apiDeleteChallenge(challenge.id);
      console.log("response", response);
      if(response){
        const ch = response.challenge;
        console.log("ch.id", ch.id);
        setIsAlertOpen(true);
        if(ch.id){
          setStatus({success : "Success!", message: "Challenge has been deleted succesfully", bg: "bg-blue-500"})
        }
        else {
          setStatus({success : "Error!", message: "Challenge has not been deleted, please try again"})
        }
    
        setTimeout(() => {
          setIsAlertOpen(false);
        }, 3000)
      }
    
    }

    return (
      <div className="w-full max-w-4xl bg-gradient-to-r from-blue-800 via-blue-900 to-blue-600 p-8 rounded-lg shadow-lg mb-6 mx-auto relative overflow-hidden animate-fade-in transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl font-stix">
        
          {/* Header with Challenge Name and Points */}
          <div onClick={handleCollapse} className="flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer">
          <h3 className="text-2xl font-extrabold text-dark-text font-satisfy mb-4">
            <FaTrophy className="inline-block mr-2" /> {capitalizeFirstLetter(challenge.name)}
          </h3>
          <div className="flex items-center text-base  font-semibold text-light-text bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg shadow-md">
            <FaGift className="mr-2" /> <span className="mt-1">{challenge.points} Points</span>
          </div>
        </div>
      
        {!isCollapsed && (
          <>
          {/* Challenge Description */}
          {challenge.description && (
            <p className="text-xl text-dark-text mb-4 mt-4 flex flex-row">
              <FaFileAlt className='mr-2 mt-1'/>
              {capitalizeFirstLetter(challenge.description)}
            </p>
          )}
    
          {/* Time Limit */}
          <div className="flex items-center text-dark-text mb-8">
            <FaClock className="mr-2" /> 
            <span className="font-semibold mr-2">Time Limit:</span> {challenge.time ? capitalizeFirstLetter(formatDateTime(new Date(challenge.time))) : 'No Time specified'}
          </div>

          {/* Assigned Children */}
          <div className="mb-4">
            <h4 className="text-xl font-bold text-dark-text mb-4">
              <FaUsers className="inline-block mr-2" /> Assigned Children
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignedChildren.length > 0 ? (
                assignedChildren.map((child) => (
                  <ChildCardHori 
                    key={child.id}
                    name={child.name}
                    age={child.age}
                    gender={child.gender}
                    avatar={child.avatar}
                    type="challenge_card"  
                    callback={() => console.log(`Child selected: ${child.name}`)}
                  />
                ))
              ) : (
                <p className="text-dark-text">No children assigned to this challenge yet.</p>
              )}
            </div>
          </div>

          {/* Rewards */}
          <div>
            <h4 className="text-xl font-bold text-dark-text mb-4">
              <FaGift className="inline-block mr-2" /> Rewards
            </h4>
            <div className="flex flex-wrap gap-2">
              {rewardsList.length > 0 ? (
                rewardsList.map((reward, index) => (
                  <span
                    key={index}
                    className="inline-block bg-yellow-400 hover:bg-yellow-500 text-light-text px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                  >
                    {reward}
                  </span>
                ))
              ) : (
                <p className="text-dark-text">No rewards added yet.</p>
              )}
            </div>
          </div>
          {user.type==="parent" && (
          <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => onEdit(challenge)} 
                className="bg-yellow-400 text-gray-800 font-bold text-sm py-3 px-4 rounded-lg hover:bg-yellow-500 transition-all duration-300"
                >
                  <span className='flex flex-row '>  
                    <FaEdit className='mr-2'/>
                    Edit 
                  </span>
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(true)} 
                className="bg-yellow-400 text-gray-800 font-bold text-sm py-3 px-4 rounded-lg hover:bg-yellow-500 transition-all duration-300"
                >
                  <span className='flex flex-row '>  
                    <FaTrash className='mr-2'/>
                    Delete
                  </span>
              </button>
          </div>
          )}
          </>
        )}
        <ConfirmModal
          title={confirmModalText.title}
          body={confirmModalText.body}
          onConfirm={() => handleDeleteChallenge()}
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}  
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
    );
  };

  export default ChallengeCard;
