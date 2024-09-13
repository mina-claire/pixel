// Import dependencies, declarations and components

import Badges from "./Badges";
import TaskTitle from "./TaskTitle";
import Subtasks from "./Subtasks";

/**
 * Render task preview including task name, subtasks, due date and
 * channel code.
 * @param {Object} task - the task to be displayed
 * @param {Object} channel - the tasks channel
 * @param {JSON} subtasks - the tasks corresponding subtasks
 * @returns {JSX.Element} - The rendered task preview
 */
function TaskPreview ({ task, channel, subtasks }) {
    return (
        <div className={`bg-fg shadow-base rounded-gentle p-md mb-md mx-base mt-sm
            transform transition-transform duration-300
            hover:scale-[1.03]
            opacity-${parseInt(task.completed) ? "35" : "100"}`}>
            <TaskTitle task={task} channel={channel} />
            <Subtasks subtasks={subtasks} taskID={task.taskID} />
            <Badges code={channel.channelCode} colour={channel.colour} dueDate={task.dueDate} />
        </div>
    );
};
export default TaskPreview;