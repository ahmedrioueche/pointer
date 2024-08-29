import { Reward, Task } from "./interface";

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
  
      const responseData: ApiResponse = await response.json();
      
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

  export const apiUpdateTaskAssignment = async (id : number | undefined, update: any) => {
    const response = await fetch("/api/main/task/update-task-ass", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, update }),
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

  export const apiUpdateRewardClaim = async (id : number | undefined, update: any) => {
    const response = await fetch("/api/main/reward/update-reward-claim", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, update }),
    })
    
    return response;
  }



  