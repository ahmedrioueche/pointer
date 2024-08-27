

export interface Task {
  id? : number;
  name: string;
  description?: string,
  points?: string | number;
  creationDate?: Date;
  creatorId?: number;
  creatorName?: string;
  assignedTo?: number;
  assignedBy?:number;
  assginedByName?: string;
  dueDate?: Date;
  completionDate?: Date;
  approvalDate?: Date;
  isCompleted?: boolean;
  isApproved?: boolean;
  approvedBy?: number;
  approvedByName? : string;
  creatorComment?: string;
  creatorCommentDate?: string;
  createdForComment?: string;
  attachedFiles?: string;
  icon?: React.ElementType;
  bgColor?: string;
}

export interface Reward {
  id? : number;
  name: string;
  points: string | number;
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
  type: "reward_page" | "reward_claimed",
  onCreate?: () => void;
  onModify?: () => void;
  onRemove?: () => void;
  onApprove?: () => void;
  onUndo?: () => void;
  onShowDetails?: () => void;
  onAddRemark?: (remark: { text: string, maker: string, date: string } | null) => void;
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
  created_at?: Date;
  level?: string,
  competence?: string,
  totalPoints?: number,
  current_points?: number,
  rewardsEarned?: number,
  username?:string;
  email?: string;
  password?:string;
  icon?: string;
}
