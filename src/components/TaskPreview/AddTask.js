// Import dependencies, declarations and components

import * as Dialog from "@radix-ui/react-dialog";
import TaskDialog from '../Dialogs/TaskDialog/TaskDialog';
import { useState } from "react";

/**
 * Renders an add task button which allows user to create new tasks.
 * @param {dajs} date - a dayjs object representing the initial start and due dates for task data.
 * @returns {JSX.Element} - A button that triggers the opening of a new tasks CRUD dialog.
 */
function AddTask ({ date }) {

     // Import global context
     const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <div className="px-base mb-base py-sm">
            <Dialog.Trigger
                title="add new task 🎉" 
                className="w-full text-center rounded-gentle transform transition-transform duration-300 
                    cursor-pointer shadow-base bg-fg hover:scale-[1.03]">
                <p className="text-text text-md font-normal">+</p>
            </Dialog.Trigger>
            </div>
            {open && <TaskDialog _task={null} date={date} />} {/* Render TaskDialog when open */}
        </Dialog.Root>
    );
};
export default AddTask;