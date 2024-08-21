
export interface Task {
    id: number;
    title: string;
    points: string;
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