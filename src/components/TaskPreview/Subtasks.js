/* eslint-disable react-hooks/exhaustive-deps */
// Import dependencies, declarations and components

import { useContext, useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { TaskContext } from '../../TaskContext';
import { saveTask } from '../../data/api';

/**
 * Renders task subtasks for task preview with interactive checkbox
 * indicating and updating the subtasks' completion status.
 * @param {JSON} subtasks - an object representing the subtasks to be displayed
 * @returns {JSX.Element} - The rendered subtasks
 */
function Subtasks ({ subtasks, taskID }) {

    // Import global context & local state

    const { setTasks, tasks } = useContext(TaskContext);
    const [save, setSave] = useState(false);

    /**
     * A function to update a subtasks completion status in the global context
     * and on the Pixel API upon change
     */
    const onChange = async (event, subtask) => {
        // Update subtasks' local state
        let completed = Number(event.target.checked);

        // Update global context
        setTasks((_tasks) => {
            return _tasks.map((task) => {
              if (task.taskID === taskID) {
                const updatedTask = {
                  ...task,
                  subtasks: task.subtasks.map((sub) => 
                    sub.subtaskID === subtask.subtaskID ? { ...sub, completed } : sub
                  ),
                };
                return updatedTask;
              }
              return task;
            });
          });
          setSave(true);
          
    };
    
    // Update subtask completion status on API
    useEffect(() => {
        const update = async () => {
            await saveTask(tasks.find((task) => task.taskID === taskID));
        };
        if (save) {
            update();
            setSave(false);
        }
    }, [save])

    return (
        <div className="mb-md mt-base">
            {subtasks && subtasks.map((sub) => (
                <div
                    key={sub.subtaskID}
                    className={`flex items-start ${tasks
                        .find((task) => task.taskID === taskID)
                        ?.subtasks.find((subtask) => subtask.subtaskID === sub.subtaskID)
                        ?.completed
                            ? "opacity-50" : "opacity-100"}`}
                    >
                    <Checkbox
                        className="mr-base border-accent"
                        checked={tasks
                            .find((task) => task.taskID === taskID)
                            ?.subtasks.find((subtask) => subtask.subtaskID === sub.subtaskID)
                            ?.completed ?? false}
                        onChange={(event) => onChange(event, sub)}
                    />
                    <div className="text-left text-text text-sm font-medium pl-xs">{sub.subtask}</div>
                </div>
            ))}
        </div>
    );
};
export default Subtasks;
