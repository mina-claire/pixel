// Import dependencies, declarations and components

import * as Dialog from "@radix-ui/react-dialog";
import TaskDialog from "../Dialogs/TaskDialog/TaskDialog";
import { useState } from "react";

/**
 * Renders task title for task preview. Acts as trigger for task
 * dialog which holds CRUD functionality.
 * @param {Object} task.
 * @returns {JSX.Element} - The rendered title.
 */
function TaskTitle ({ task }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className={`text-left text-base 
                    font-heavy cursor-pointer hover:text-text ${task.completed ? "text-text" : "text-h1"}`}>
                {task.title} ✍️ 
            </Dialog.Trigger>
            {open &&  <TaskDialog _task={task} date={null} />}
           
        </Dialog.Root>
    );
}

export default TaskTitle;