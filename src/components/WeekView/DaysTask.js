/* eslint-disable react-hooks/exhaustive-deps */
// Import dependencies, declarations and components

import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../../TaskContext';
import TaskPreview from '../TaskPreview/TaskPreview';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

// Define constants

const DATE_FORMAT = 'YYYY-MM-DD'; // The format of date retrieved from pixel API.

/**
 * Renders task previews for tasks scheduled for execution on and within `date`.
 * @param {String} date - The date of the week view
 * @returns {JSX.Element} - Representing the dates' tasks
 */
const DaysTasks = ({ date }) => {

    // Define & import global and local state variables.
    const { tasks, channels } = useContext(TaskContext);
    const [today, setToday] = useState([]);
    
    /**
     * Determine the tasks where `date` is between startDate and dueDate
     * (inclusive of both range beginnng and end). Or, if date is today, determine
     * if task overdue. If overdue, add to todays' tasks.
     * Update state of `today` with returned array.
     */
    useEffect(() => {
        const filteredTasks = tasks.filter((_task) => {
                const inRange = dayjs(date).isBetween(
                    dayjs(_task.startDate, DATE_FORMAT),
                    dayjs(_task.dueDate, DATE_FORMAT),
                    null,
                    '[]'
                );
                if (inRange && !Number(_task.archived ?? 0)) {
                    return _task
                }
                return false;
            });
        setToday(filteredTasks);
    }, [date, tasks]); 

    return (
        <div className="h-[77vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden
                [-ms-overflow-style:none] [scrollbar-width:none] z-0">
            {/** Verify today is not empty before proceeding */}
            {today.length ? (
                today.map((task) => {
                    const channel = channels.find((channel) => (
                        task.channelID === channel.channelID
                    ))

                    /**
                     * For each task within the specified date range, identify the subtasks that are
                     * also scheduled for execution on `date`.
                     */
                    const subtasks = task.subtasks.filter((sub) => (
                        dayjs(date).isBetween(
                            dayjs(sub.startDate, DATE_FORMAT),
                            dayjs(sub.endDate, DATE_FORMAT),
                            null,
                            '[]'
                        ) && (sub.subtask !== "")
                    ));

                    /**
                     * If subtasks or, no subtasks where task is to be started and
                     * completed on `date`, render task preview with `date` subtasks display.
                     */                    
                    if (Number(channel.archived ?? 0) 
                            || ((subtasks.length === 1) 
                            && (!subtasks[0].subtask.length))) {
                        return null
                    } else if ((!subtasks.length && (task.startDate === task.dueDate))
                        || subtasks.length) {
                        return (
                            <TaskPreview 
                                key={task.taskID}
                                task={task}
                                subtasks={subtasks}
                                channel={channels.find((channel) => (
                                    task.channelID === channel.channelID
                                ))} 
                            />
                        );
                    };
                    return null;
                })
            ) : null}
        </div>
    );
};
export default DaysTasks;