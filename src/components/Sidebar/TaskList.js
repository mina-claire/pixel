// Import dependencies, declarations and components

import { useContext } from 'react';
import { TaskContext } from '../../TaskContext';
import TaskPreview from '../TaskPreview/TaskPreview';
import AddTask from '../TaskPreview/AddTask';
import logo from '../images/logo.svg'
import dayjs from 'dayjs';

/**
 * Component to render preview of active tasks in app sidebar.
 * @returns {JSX.Element} - The rendered sidebar component.
 */
function TaskList () {
    // Import global context
    const { tasks, channels } = useContext(TaskContext);

    return (
        <div className="flex-col w-sidebar h-auto bg-bg">
            <div className="flex justify-center items-center">
                {/* render logo in sidebar */}
                <img
                    className="m-md mb-md w-logo"
                    src={logo}
                    alt="Logo"
                />
            </div>

            <div className="m-base p-xs mt-0">
                {/* Render `add task` button in sidebar */}
                <AddTask date={dayjs().format('YYYY-MM-DD')} />

                {/* Render master list task previews in sidebar */}
                <div className='h-[80vh] overflow-y-auto overflow-x-none [&::-webkit-scrollbar]:hidden
                    [-ms-overflow-style:none] [scrollbar-width:none]'>
                {tasks.map((task) => (
                    !(Number(task.archived) || 0) ? (
                    <TaskPreview
                        key={task.taskID}
                        task={task}
                        subtasks={[]}
                        channel={channels.find((channel) => (
                            task.channelID === channel.channelID
                        ))} 
                    />
                    ) : null ))}    
                </div>
            </div>
        </div>
    );
};
export default TaskList;