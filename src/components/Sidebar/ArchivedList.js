// Import dependencies, declarations and components

import TaskPreview from '../TaskPreview/TaskPreview';
import { useContext } from 'react';
import { TaskContext } from '../../TaskContext';
import logo from '../images/logo.svg'

/**
 * Component to render preview of archived tasks in app sidebar.
 * @returns {JSX.Element} - The rendered sidebar component.
 */
function ArchivedList () {
    // Import global context
    const { tasks, channels } = useContext(TaskContext);

    return (
        <div className="flex-col w-sidebar h-full bg-bg">
            {/* render logo in sidebar */}
            <div className="flex justify-center items-center">
                <img
                    className="m-md mb-md w-logo"
                    src={logo}
                    alt="Logo"
                />
            </div>

            {/** Render preview of archived tasks in sidebar */}
            <div className="m-md p-xs mt-0 overflow-y-auto" style={{scrollbarWidth: 'none'}}>
                    {tasks.map((task) => (
                        Number(task.archived ?? 0) ? (
                            <TaskPreview
                                task={task}
                                subtasks={[]}
                                channel={channels.find((channel) => (
                                    task.channelID === channel.channelID
                                ))} 
                            />
                        ) : null
                    ))}
            </div>
        </div>
    );
};
export default ArchivedList;