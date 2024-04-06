export interface Task {
  id: string;
  title: string;
  description: string;
  status: status;
}

export interface TaskReq {
  title: string;
  description: string;
  status: status;
}

export enum status {
  toDo = "TODO",
  inProgress = "INPROGRESS",
  finished = "FINISHED",
}