/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useContext } from 'react';
import { saveTask, deleteTask } from '../../../data/api';
import { TaskContext } from '../../../TaskContext';
import InputTaskHeader from './InputTaskHeader';
import SubtaskDialog from './SubtaskDialog';
import TaskDescription from './TaskDescription';
import TaskDataInput from './TaskDataInput';
import * as Dialog from "@radix-ui/react-dialog";
import { Button, message, Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { TrashFill, Floppy2Fill } from 'react-bootstrap-icons';

// Define constants
const DATE_FORMAT = "YYYY-MM-DD";
dayjs.extend(isBetween);

function TaskDialog({ _task, date }) {
    const { channels, user, setTasks } = useContext(TaskContext);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [focusIndex, setFocusIndex] = useState(0);
    const [deleted, setDeleted] = useState(false);
    const [open, setOpen] = useState(false);
    const itemRefs = useRef([]);
    const inputRef = useRef(null);

    // Initialize task on mount
    useEffect(() => {
        const emptySubtaskState = [{
            "subtaskID": uuidv4(),
            "subtask": "",
            "startDate": date ?? dayjs().format(DATE_FORMAT),
            "endDate": date ?? dayjs().format(DATE_FORMAT),
            "completed": 0,
            "archived": 0,
        }];

        const initialState = {
            "taskID": _task?.taskID ?? uuidv4(),
            "userID": _task?.userID ?? user.id,
            "title": _task?.title ?? "",
            "channelID": _task?.channelID ?? channels[0].channelID,
            "description": _task?.description ?? "",
            "startDate": _task?.startDate ? dayjs(_task.startDate).format(DATE_FORMAT) : date,
            "dueDate": _task?.dueDate ? dayjs(_task.dueDate).format(DATE_FORMAT) : date,
            "completed": _task?.completed || 0,
            "subtasks": (_task?.subtasks?.length > 0) ? _task.subtasks : emptySubtaskState,
            "archived": Number(_task?.archived) || 0,
        };

        setTask(initialState);
        setLoading(false);
    }, [_task]);

    // Function to update tasks in the global context
    const updateGlobalTasks = async (savedTask) => {
        setTasks((prevTasks) => {
            const index = prevTasks.findIndex((t) => t.taskID === savedTask.taskID);
            if (index !== -1) {
                // Update existing task
                const updatedTasks = [...prevTasks];
                updatedTasks[index] = savedTask;
                return updatedTasks;
            } else {
                // Add new task
                return [...prevTasks, savedTask];
            }
        });
    };

    // Function to save the task and update the global context
    const _saveTasks = async () => {
        if (task?.title) {
            try {
                const savedTask = await saveTask(task);
                setTask(savedTask); // Update local state with the saved task
                await updateGlobalTasks(savedTask); // Update global tasks
                message.success('Saved! 💪', 2.5);
            } catch (error) {
                message.error('Saving failed 🫠', 2.5);
            }
        }
    };

    const handleClose = async () => {
        if (!deleted && open) {
            setOpen(false);
            _saveTasks();
        } else {
            setOpen(true);
        }
    }

    // Function to delete task
    const _deleteTask = async () => {
        try {
            await deleteTask(task.taskID);
            setDeleted(true);
            setTasks((prevTasks) => prevTasks.filter(t => t.taskID !== task.taskID));
            message.success('Deleted! 💪', 2.5);
        } catch (error) {
            setDeleted(false);
            message.error('Deletion failed 🫠', 2.5);
        }
    };

    // Manage focus between components (kept as requested)
    useEffect(() => {
        if (!loading && itemRefs.current[focusIndex]) {
            const input = itemRefs.current[focusIndex];
            const length = itemRefs.current[focusIndex]?.resizableTextArea?.textArea.value.length;
            input.focus();
            input.resizableTextArea.textArea.setSelectionRange(length, length);
        }
    }, [itemRefs, focusIndex, loading]);

    useEffect(() => {
        if (inputRef.current && !loading) {
            inputRef.current.focus();
        }
    }, [loading]);

    return (
        <Dialog.Portal>
            {loading ? (
                <Dialog.Content aria-describedby="task-dialog-description">
                    <Dialog.Title className="sr-only">Task Dialog</Dialog.Title>
                    <Spin />
                </Dialog.Content>
            ) : (
                <>
                    <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur-sm" />
                    <Dialog.Content
                        className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-dialog max-h-[85vh] rounded-gentle bg-fg 
                            shadow-dialog p-xlg z-900 transition-[height] ease-in-out duration-600 z-50 animate-fadeIn"
                        onInteractOutside={handleClose}
                        aria-describedby="task-dialog-description"
                        title="task-dialog"
                    >
                        <Dialog.Title className="sr-only">Task Dialog</Dialog.Title>
                        <div className={`opacity-${Number(task.completed) ? "20" : "100"}`}>
                            <InputTaskHeader ref={inputRef} title={task.title} setTask={setTask} task={task} />
                            <TaskDescription description={task.description} setTask={setTask} />
                            <div className="max-h-[60vh] min-h-[2rem] overflow-y-auto">
                                {task.subtasks.map((subtask, index) => (
                                    <div key={subtask.subtaskID}>
                                        <SubtaskDialog
                                            subtask={subtask}
                                            task={task}
                                            setTask={setTask}
                                            taskID={task.taskID}
                                            setFocusIndex={setFocusIndex}
                                            ref={(element) => {
                                                itemRefs.current[index] = element;
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row justify-between items-end mt-md">
                                <TaskDataInput task={task} setTask={setTask} />
                                <div>
                                    <Dialog.Close asChild>
                                        <Button onClick={_deleteTask} type="text" size="small" aria-label="Delete" title="delete forever 😱" className="text-accent hover:scale-110 hover:text-primary mr-sm">
                                            <TrashFill />
                                        </Button>
                                    </Dialog.Close>
                                    <Button onClick={_saveTasks} type="text" size="small" aria-label="Save" title="save 🛟" className="text-accent hover:scale-110 hover:text-primary mr-sm">
                                        <Floppy2Fill />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Dialog.Content>
                </>
            )}
        </Dialog.Portal>
    );
}

export default TaskDialog;
