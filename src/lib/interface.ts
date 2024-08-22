
export interface TaskCardIf {
  title: string;
  points: string | number;
  creation_date: string;
  due_date: string;
  approval_date?: string;
  icon: React.ElementType;
  bgColor: string;
}

export interface Task {
    id: number;
    title: string;
    points: string;
}

export interface Reward {
  title: string;
  points: string | number;
  icon: React.ElementType;
  bgColor: string;
  creation_date?: string; 
  claimed_at?: string; 
  approved_by?: string; 
  approved_at?: string; 
}

export interface RewardCardProps extends Reward {
  type: "reward_page" | "reward_claimed",
  onCreate?: () => void;
  onModify: () => void;
  onRemove?: () => void;
  onAction: () => void;
  onShowDetails?: () => void;
  onAddRemark?: () => void;
}

export interface Child {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  achievedTasks: Task[];
  pendingTasks: Task[];
  icon: string;
}