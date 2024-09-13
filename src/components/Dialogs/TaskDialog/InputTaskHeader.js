import React from 'react';
import { Checkbox, Button } from 'antd';
import { Cross1Icon } from '@radix-ui/react-icons';
import * as Dialog from "@radix-ui/react-dialog";
import TextArea from 'antd/es/input/TextArea'; // Assuming you're using Ant Design's TextArea

const InputTaskHeader = React.forwardRef(({ title, setTask, task }, ref) => {
    const inputRef = ref;

    const handleFocus = () => {
        const input = inputRef.current;
        input.focus({ cursor: 'end' });
    };

    const toggleStatus = () => {
        setTask((_task) => ({
            ..._task,
            completed: _task.completed ? 0 : 1,
        }));
    };

    return (
        <div className="flex flex-row items-center">
            <Checkbox
                tabIndex="-1"
                checked={task.completed}
                onChange={toggleStatus}
                className="pb-sm border-accent"
            />
            <TextArea
                ref={inputRef}
                onFocus={handleFocus}
                size="large"
                onChange={(e) => {
                    setTask((_task) => ({
                        ..._task,
                        title: e.target.value,
                    }));
                }}
                value={title}
                placeholder={"Task name..."}
                spellcheck="false"
                className={`border-none focus:shadow-none bg-transparent text-lg font-heavy
                    p-none mr-lg ml-md text-${task.completed ? "sub" : "h1"}`}
                autoSize 
            />
            <Dialog.Close asChild tabIndex="-1">
                <Button
                    tabIndex="-1"
                    type="text"
                    aria-label="Close"
                    className="text-accent hover:scale-110 hover:text-primary">
                        <Cross1Icon />
                </Button>
            </Dialog.Close>
        </div>
    );
});

export default InputTaskHeader;
