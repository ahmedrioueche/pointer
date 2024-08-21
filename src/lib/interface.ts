
export interface TaskCardIf {
  title: string;
  points: string | number;
  creation_date: string;
  due_date: string;
  icon: React.ElementType;
  bgColor: string;
}

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