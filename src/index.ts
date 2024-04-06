import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import Pino from 'pino-http';
import favicon from 'express-favicon';
import { status, TaskReq } from './models/task';
import {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTaskById,
  updateTaskById,
  createDefaultTable,
} from './queries';

const app = express();
const logger = Pino({
  level: 'info',
});

app.use(favicon(__dirname + '/public/favicon.png'));
app.use(cors());
app.use(logger);
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5174;

createDefaultTable();

app.get('/', (_req, res) => {
  res.send('Hello World');
});

app.get('/ping', (_req, res) => {
  console.log('pinged here');
  res.send('pong');
});

app.post('/', async (req, res, next) => {
  const { title, description } = req.body as TaskReq;
  try {
    const result = await createTask(title, description, status.toDo);
    return res.status(201).json({ result });
  } catch (err) {
    return next(err);
  }
});

app.get('/tasks', async (_req, res, next) => {
  try {
    const result = await getAllTasks();
    return res.status(200).json({ result });
  } catch (err) {
    return next(err);
  }
});

app.get('/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const result = await getTaskById(taskId);
    return res.status(200).json({ result });
  } catch (err) {
    return next(err);
  }
});

app.delete('/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    await deleteTaskById(taskId);

    return res.status(200).json({ message: 'Succesfully deleted!' });
  } catch (err) {
    return next(err);
  }
});

app.put('/:id/:method', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const method = req.params.method;
    let result;

    if (!taskId || !method) {
      return res.status(500).json({ message: 'ERROR: Invalid paramethers' });
    }

    switch (method) {
      case 'TODO':
        result = await updateTaskById(taskId, status.toDo);
        break;

      case 'INPROGRESS':
        result = await updateTaskById(taskId, status.inProgress);
        break;

      case 'FINISHED':
        result = await updateTaskById(taskId, status.finished);
        break;

      default:
        return res.status(500).json({ message: 'ERROR: invalid method' });
    }

    if (result) {
      return res.status(200).json({ result });
    } else {
      return res.status(500).json({ message: 'ERROR: db error' });
    }
  } catch (err) {
    return next(err);
  }
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  res
    .status(500)
    .json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
