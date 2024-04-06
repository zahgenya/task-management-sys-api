import { db } from './database';
import { status } from './models/task';
const tableName = process.env.NODE_ENV === 'test' ? 'testTasks' : 'Tasks';

const createTask = async (
  title: string,
  description: string,
  status: string
) => {
  try {
    const { id } = await db.one(`INSERT INTO ${tableName} (title, description, status) VALUES ($1, $2, $3) RETURNING id`,
      [title, description, status]
    );

    return { id, title, description, status }
  } catch (err) {
    throw err;
  }
};

const getAllTasks = async () => {
  try {
    const tasks = await db.any(`SELECT * FROM ${tableName};`);
    console.log('Table name: ', tableName);
    return tasks;
  } catch (err) {
    throw err;
  }
};

const getTaskById = async (taskId: string) => {
  try {
    const task = await db.one(
      `SELECT * FROM ${tableName} WHERE id = $1`,
      taskId
    );
    return task;
  } catch (err) {
    throw err;
  }
};

const deleteTaskById = async (taskId: string) => {
  try {
    const taskToDelete = await db.result(
      `DELETE FROM ${tableName} WHERE id = $1`,
      taskId
    );

    if (taskToDelete.rowCount === 0) {
      throw new Error('Task not found');
    }

    return { message: "Succesfully deleted!" }
  } catch (err) {
    throw err;
  }
};

const updateTaskById = async (taskId: string, method: status) => {
  try {
    await db.none(`UPDATE ${tableName} SET status = $1 WHERE id = $2`, [
      method,
      taskId,
    ]);

    const updatedTask = await db.one(
      `SELECT * FROM ${tableName} WHERE id = $1`,
      taskId
    );

    console.log(updatedTask)
    return updatedTask;
  } catch (err) {
    throw err;
  }
};

const createDefaultTable = async () => {
  try {
    await db.none(
      `CREATE TABLE IF NOT EXISTS Tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(20) NOT NULL
    );`
    );
  } catch (err) {
    throw err;
  }
};

export {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTaskById,
  updateTaskById,
  createDefaultTable,
};
