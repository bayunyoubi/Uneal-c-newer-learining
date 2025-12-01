export enum Sender {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isLoading?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  promptContext: string; // The specific context to send to AI when asking about this
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Curriculum {
  modules: Module[];
}