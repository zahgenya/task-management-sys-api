import { Request, Response } from 'express';
import { Task } from '../models/task';

const tasks: Task[] = [];

export const getTasks = (_req: Request, res: Response) => {
  res.status(200).json(tasks);
};

export const createTask = (req: Request, res: Response) => {
  const newTask: Task = req.body;
  res.json(newTask);
};
