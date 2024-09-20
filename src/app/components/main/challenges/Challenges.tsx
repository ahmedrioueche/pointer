import React, { useEffect, useState } from 'react';
import { FaTrophy, FaUserCircle } from 'react-icons/fa'; 
import CreateChallenge from './CreateChallenge';
import ChallengeCard from './ChallengeCard';
import { Challenge, Child, Notif } from '@/types/interface';
import { useData } from '@/app/context/dataContext';
import { apiCreateChallenge, apiSendNotification, apiUpdateChallenge } from '@/lib/apiHelper';
import Alert from '../../Alert';
import useSWR from 'swr';
import { fetcher } from '@/utils/helper';
import ChallengeFetcher from './ChallengeFetcher';
import EditChallengeModal from '../modals/EditChallengeModal';

interface ChallengesPageProps {
  user: any;
}

const ChallengesPage: React.FC<ChallengesPageProps> = ({ user }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [childrenData, setChildren] = useState<any>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [status, setStatus] = useState<{ success: string; message: string; bg? : string}>();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [challengeToEdit, setChallengeToEdit] = useState<Challenge>();
  const data = useData();
  let userId: number | undefined = undefined;
  let userType: string | undefined = undefined;

  if(user){
    userId = user.id;
    userType = user.type;
  }

  const isParent = userType? userType === "parent" : null;
  const apiEndpoint = isParent
    ? '/api/main/challenge/get-challenge-parent-id'
    : '/api/main/challenge/get-challenge-child-id';

  const { data: challengesDB, error, mutate } = useSWR(
    userId ? apiEndpoint : null,
    (url: string) => fetcher(url, userId),
    { revalidateOnFocus: true }
  );

  useEffect(() => {
    if (challengesDB) {
      // Sort challenges by time, newest first
      const sortedChallenges =  challengesDB.challenges &&  challengesDB.challenges.length > 0? 
      challengesDB.challenges.sort((a : any, b : any) => 
        new Date(b.time).getTime() - new Date(a.time).getTime() 
      ) : null
      setChallenges(sortedChallenges);
    }
  }, [challengesDB, setChallenges]);
  
  useEffect(() => {
    if (data) {
      setChildren(data.children);
    }
  }, [data]);

  const handleCreateChallenge = async (newChallenge: Challenge) => {
    console.log("newChallenge", newChallenge)
    const response = await apiCreateChallenge(newChallenge);
    console.log("response", response);
    setIsAlertOpen(true);
    if(response.id){
      setStatus({success : "Success!", message: "Challenge has been created succesfully", bg: "bg-blue-500"})
    }
    else {
      setStatus({success : "Error!", message: "Challenge has not been created, please try again"})
    }
    setChallenges(prev => [...prev, newChallenge]);

    setTimeout(() => {
      setIsAlertOpen(false);
    }, 3000)

    //send notification
    const notification : Notif = {
      title: 'Parent just challenged you!',
      content: `${newChallenge.name}`,
      description: `${newChallenge.description}, ${newChallenge.points}`,
      type: "challenge_added",
    }

    sendNotif(newChallenge, notification);


  };

  const sendNotif = async (challenge : Challenge, notification : Notif) => {
    const challengeChildrenIds = challenge.assignedTo
    ?.split(',')
    .map(id => parseInt(id, 10))
    .filter(id => !isNaN(id)); // Filter out NaN values if the string contains non-numeric values
    
    // Check if challengeChildrenIds is defined and has elements
    if (challengeChildrenIds && challengeChildrenIds.length > 0) {
      // Use Promise.all to handle asynchronous operations
      Promise.all(
        challengeChildrenIds.map(async (childId: number) => {
          try {
            const notifResponse = await apiSendNotification(user.id, childId, "child", notification);
            console.log("notifResponse", notifResponse);
          } catch (error) {
            console.error(`Error sending notification to child ${childId}:`, error);
          }
        })
      ).then(() => {
        console.log('All notifications sent');
      }).catch(error => {
        console.error('Error sending some notifications:', error);
      });
    } else {
      console.log('No challenge children IDs to process');
    }
    
  }

  const handleChallengeCardEdit = (challenge : Challenge) =>{
    setChallengeToEdit(challenge);
    setIsEditModalOpen(true);
    console.log("setIsEditModalOpen to true ")
  }

  const handleChallengeUpdate = async (challenge : Challenge) => {
    const response = await apiUpdateChallenge(challenge.id, {...challenge});
    console.log("reponse", response);

    if(response){
      const challenge = response.challenge;
      setIsAlertOpen(true);
      if(challenge.id){
        setStatus({success : "Success!", message: "Challenge has been updated succesfully", bg: "bg-blue-500"})
      }
      else {
        setStatus({success : "Error!", message: "Challenge has not been updated, please try again"})
      }
  
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 3000)
    }
  }

  return (
    <>
      <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-2 lg:px-2">
          {user.type === "parent" && <CreateChallenge user={user} onCreate={handleCreateChallenge} childrenData={childrenData}/>}
          <div className="flex flex-col">
            <ChallengeFetcher user={user} setChallenges={setChallenges}/>
            {
            (challenges && challenges.length > 0) ? (
              challenges.map((challenge) => (
                <div key={challenge.id}>
                  <ChallengeCard 
                    user={user} 
                    challenge={challenge} 
                    childrenData={childrenData} 
                    onEdit={(challenge: Challenge) => handleChallengeCardEdit(challenge)} 
                  />
                </div>
              ))
            ) : (
              user.type === "parent" && (
                <div className='font-satisfy text-xl text-light-text dark:text-dark-text'>
                  Challenges will appear here
                </div>
              )
            )
          }

          </div>
        </div>

        <EditChallengeModal
          user={user}
          challenge={challengeToEdit}
          childrenData={childrenData}
          isOpen={isEditModalOpen}
          onUpdate={(challenge)=>{handleChallengeUpdate(challenge)}}
          onClose={() => setIsEditModalOpen(false)}  
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

    </>
   
    
  );
};

export default ChallengesPage;
