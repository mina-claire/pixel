import { Input } from 'antd';
import { useRef } from 'react';
const { TextArea } = Input;

function TaskDescription ({ description, setTask }) {
    const inputRef = useRef(null);

    const handleFocus = () => {
        const input = inputRef.current;
        input.focus({ cursor: 'end' });
    };
    
    return (
            <TextArea
                ref={inputRef}
                onFocus={handleFocus}
                variant="borderless"
                spellcheck="false"
                onChange={(e) => {
                    setTask((_task) => ({
                        ..._task,
                        "description": e.target.value,
                    }));
                }}
                value={description ?? ''}
                placeholder={description ? '' : 'Notes...'}
                className="font-medium text-text text-md mt-sm mb-sm px-xs py-none"
                autoSize
        />
    );
}
export default TaskDescription;