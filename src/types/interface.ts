

export interface Task {
  id? : number;
  name: string;
  type?: string;
  description?: string,
  points?: string | number;
  creationDate?: Date;
  creatorId?: number;
  creatorName?: string;
  assignedTo?: number;
  assignmentDate? :Date;
  assignedBy?:number;
  assignedByName?: string;
  dueDate?: Date;
  routineTime?: string;
  completionDate?: Date;
  approvalDate?: Date;
  isCompleted?: boolean;
  isApproved?: boolean;
  approvedBy?: number;
  approvedByName? : string;
  creatorComment?: string;
  creatorCommentDate?: Date;
  createdForComment?: string;
  createdForCommentDate?: Date;
  attachedFiles?: string;
  icon?: React.ElementType;
  bgColor?: string;
}

export interface Reward {
  id? : number;
  name: string;
  points: number;
  icon?: React.ElementType;
  bgColor?: string;
  creationDate?: string; 
  creatorId?: number;
  creatorName?: string;
  isClaimed?: boolean;
  isApproved?: boolean;
  claimedBy?: number;
  claimedByName?: string;
  claimedAt?: string; 
  approvedBy?: string; 
  approvedByName?: string; 
  approvedAt?: string; 
  description?: string;
  claimComment?: string;
  approveComment?: string;
  approveCommentDate?: Date;
  attachedFiles?: string;
}

export interface RewardCardProps extends Reward {
  type: "reward_page" | "reward_claimed" | "reward_to_claim",
  user? : any;
  childData? :any;
  onCreate?: () => void;
  onModify?: () => void;
  onRemove?: () => void;
  onApprove?: () => void;
  onUndo?: () => void;
  onShowDetails?: () => void;
  onAddRemark?: (remark: { text: string, maker: string, date: string } | null) => void;
  onClaim?: () => void;
  onUnClaim?: () => void;
  onCustomize?: () => void;
}

export interface Child {
  id?: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  parent_id?: number;
  has_device?: boolean,
  uses_shared_device?: boolean,
  achievedTasks?: Task[];
  pendingTasks?: Task[];
  tasksAssigned?: number;
  tasksCompleted?: number;
  createdAt?: Date;
  level?: string,
  competence?: string,
  totalPoints?: number,
  currentPoints?: number,
  rewardsEarned?: number,
  quizzesCorrectAnswersCount?: number;
  quizzesTotalPoints?: number;
  budget?: number;
  username?:string;
  email?: string;
  password?:string;
  icon?: string;
}

export interface Notif {
  id?: number;
  title: string;
  content?: string;
  type?: "task_approved" | "task_completed" | "task_assigned" | "task_commented_by_parent" | "task_commented_by_child"
         |  "reward_added" | "reward_claimed" | "reward_approved" | "reward_commented_by_parent" | "reward_commented_by_child";
  description?: string;
  senderId?: number;
  receiverId?: number;
  parentId?: number;
  createdAt?: Date;
  isRead?: boolean;
  icon?: string;
}

export interface Challenge {
  id: number;
  parentId: number;
  name: string;
  description?: string;
  points: number;
  assignedTo?: string;  
  image?: string;
  time?: Date;  
  rewards?: string; 
}

export interface Quiz {
  id: number;
  topic?: string;
  childId?: number; 
  parentId?: number;
  question?: string;
  options?: string;
  correctAnswer?: string;
  points?:number;
  isAnsweredCorrectly?: boolean,
  childAnswer?: string;
  creationDate?: Date;
}