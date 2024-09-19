import { Challenge, Notif, Quiz, Reward, Task } from "../types/interface";

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  }
  
  interface ApiResponse {
    status: string; 
    message?: string; 
  }
    
  export const sendContactForm = async (data: ContactFormData): Promise<ApiResponse> => {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
  
    if (!response.ok) {
      throw new Error("Failed to send message");
    }
  
    return response.json();
  };
  
  export const apiUpdateParent = async (parentId: Number | null, updateData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/main/parent/update-parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, updateData }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update parent');
      }
  
      const responseData: ApiResponse = await response.json();
      
      return responseData;
  
    } catch (error) {
      console.error('Update failed:', error);
      
      return { status: 'error', message: 'An error occurred' };
    }
  };

  export const apiGetParentById = async (parentId: Number): Promise<any> => {
    try {
      const response = await fetch('/api/main/parent/get-parent-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch parent');
      }
  
      const responseData = await response.json();
      
      return responseData;
  
    } catch (error) {
      console.error('Update failed:', error);
      
      return { status: 'error', message: 'An error occurred' };
    }
  };
  
  
  export const apiInsertChild = async (child : any): Promise<any> => {
    try {
      console.log("child in apiInsertChild", child)
      const response = await fetch('/api/main/child/insert-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update parent');
      }
  
      const responseData = await response.json();
      
      return responseData;
  
    } catch (error) {
      console.error('Operation failed:', error);
      
      // Return a default error response
      return { status: 'error', message: 'An error occurred' };
    }
  };
  
  export const apiUpdateChild = async (id: Number | undefined, updateData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/main/child/update-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updateData }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update parent');
      }
  
      const responseData = await response.json();
      
      return responseData;
  
    } catch (error) {
      console.error('Update failed:', error);
      
      // Return a default error response
      return { status: 'error', message: 'An error occurred' };
    }
  };
  

  export const apiAddTask = async (task : Task) => {
    const response = await fetch("/api/main/task/add-task", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    })
    
    return response.json();
  }

  export const apiAssignTask = async (task : Task, childId : number) => {
    const response = await fetch("/api/main/task/assign-task", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, childId }),
    })
    
    return response.json();
  }

  export const apiUnAssignTask = async (taskId : number, childId : number) => {
    const response = await fetch("/api/main/task/unassign-task", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, childId }),
    })
    
    return response.json();
  }

  
  export const apiUpdateTask = async (id : number | undefined, update: any) => {
    const response = await fetch("/api/main/task/update-task", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, update }),
    })
    
    return response;
  }

  export const apiUpdateTaskAssignment = async (id : number | undefined, childId : number, update: any) => {
    const response = await fetch("/api/main/task/update-task-ass", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, childId, update }),
    })
    
    return response;
  }


  export const apiDeleteTask = async (id : number | undefined) => {
    const response = await fetch("/api/main/task/delete-task", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    return response;
  }

  export const apiGetTasksByChildId = async (id : number) => {
    const response = await fetch("/api/main/task/get-task-child-id", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    return response.json();
  }
  
  export const apiGetTasksByParentId = async (id : number) => {
    const response = await fetch("/api/main/task/get-task-parent-id", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    return response.json();
  }
  
  export const apiGetPendingTasks = async () => {
    const response = await fetch("/api/main/task/get-pending-tasks", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ }),
    })
    
    return response.json();
  }

  
  export const apiGetChildData = async (id : number) => {
    const response = await fetch("/api/main/child/child-profile", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    return response.json();
  }
  
  
  export const apiAddReward = async (reward : Reward) => {
    const response = await fetch("/api/main/reward/add-reward", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reward }),
    })
    
    return response.json();
  }


  export const apiUpdateReward = async (id : number | undefined, update: any) => {
    const response = await fetch("/api/main/reward/update-reward", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, update }),
    })
    
    return response;
  }

  export const apiDeleteReward = async (id : number | undefined) => {
    const response = await fetch("/api/main/reward/delete-reward", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    return response.json();
  }

  export const apiGetRewardsByChildId = async (id : number) => {
    const response = await fetch("/api/main/reward/get-reward-child-id", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    return response.json();
  }

  export const apiClaimReward = async (rewardId : number, childId : number) => {
    const response = await fetch("/api/main/reward/claim-reward", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId, childId }),
    })
    
    return response.json();
  }
  
  export const apiUnClaimReward = async (rewardId : number, childId : number) => {
    const response = await fetch("/api/main/reward/unclaim-reward", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId, childId }),
    })
    
    return response.json();
  }
  
  export const apiUpdateRewardClaim = async (id : number | undefined, update: any) => {
    const response = await fetch("/api/main/reward/update-reward-claim", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, update }),
    })
    
    return response;
  }

  export const apiGetRewardData = async (id : number) => {
    const response = await fetch("/api/main/reward/get-reward-data", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    return response.json();
  }

export const apiSendNotification = async (senderId : number, receiverId : number | undefined, receiverType : string,  notif : Notif) => {
  const response = await fetch("/api/main/notif/send-notif", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId,  receiverId, receiverType, notif}),
  })
  
  return response.json();
}

export const apiMarkNotifRead = async (notifIds: any) => {
  console.log("notifIds in apiMarkNotifRead", notifIds)
  const response = await fetch("/api/main/notif/mark-read", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notifIds }),
  })
  
  return response.json();
}


export const apiUpdateSettings = async (parentId: Number | undefined, settings: any): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/main/setting/update-setting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentId, settings }),
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Update failed:', error);
    
    // Return a default error response
    return { status: 'error', message: 'An error occurred' };
  }
};


export const apiGetSettingsByParentId = async (parentId: Number | undefined): Promise<any> => {
  try {
    const response = await fetch('/api/main/setting/get-setting-parent-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to get settings');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('get settings failed:', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
};

export const apiSendEmail = async (email: string, subject: string, content: string): Promise<any> => {
  try {
    const response = await fetch('/api/main/email/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, content }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Failed to send email:', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
};

export const apiCreateChallenge = async (challenge : Challenge) : Promise<any> => {
  try {
    const response = await fetch('/api/main/challenge/create-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challenge }),
    });

    if (!response.ok) {
      throw new Error('Failed to create challenge');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Failed to create challenge:', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
}


export const apiDeleteChallenge = async (challengeId : number) : Promise<any> => {
  try {
    const response = await fetch('/api/main/challenge/delete-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create challenge');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Failed to create challenge:', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
}

export const apiUpdateChallenge = async (challengeId : number, challenge : Challenge) : Promise<any> => {
  try {
    const response = await fetch('/api/main/challenge/update-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, challenge }),
    });

    if (!response.ok) {
      throw new Error('Failed to update challenge');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Failed to update challenge:', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
}

export const apiPromptGemini = async (prompt : string) : Promise<any> => {
  try {
    const response = await fetch('/api/main/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({prompt}),
    });

    if (!response.ok) {
      throw new Error('Failed to prompt Gemini');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Failed to prompt Gemini:', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
}

export const apiInsertQuizzes = async (quizzes : Quiz[]) : Promise<any> => {
  try {
    const response = await fetch('/api/main/quiz/insert-quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizzes }),
    });

    if (!response.ok) {
      throw new Error('Failed to insert quizzes');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Failed to insert quizzes in api', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
}


export const apiUpdateQuiz = async (quiz : Quiz) : Promise<any> => {
  try {
    const response = await fetch('/api/main/quiz/update-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz }),
    });

    if (!response.ok) {
      throw new Error('Failed to insert quizzes');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Failed to insert quizzes in api', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
}


export const apiGetChildQuizzes = async (childId : number) : Promise<any> => {
  try {
    const response = await fetch('/api/main/quiz/get-quizzes-child-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childId }),
    });

    if (!response.ok) {
      throw new Error('Failed to insert quizzes');
    }

    const responseData = await response.json();
    
    return responseData;

  } catch (error) {
    console.error('Failed to insert quizzes in api', error);
    
    return { status: 'error', message: 'An error occurred' };
  }
}