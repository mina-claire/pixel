/* eslint-disable react-hooks/exhaustive-deps */

import { DatePicker, Input, Checkbox } from 'antd';
import { forwardRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const DATE_FORMAT = "YYYY-MM-DD"

const SubtaskDialog =  forwardRef(({ subtask, task, setTask, setFocusIndex }, ref) => {
    const initialState = {
        "subtaskID": subtask?.subtaskID ?? uuidv4(),
        "subtask": subtask?.subtask ?? "",
        "startDate": dayjs(subtask?.startDate).isValid() ? dayjs(subtask.startDate).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT),
        "endDate": dayjs(subtask?.endDate).isValid() ? dayjs(subtask.endDate).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT),
        "completed": Number(subtask?.completed) ?? 0,
    }
    const [_subtask, _setSubtask] = useState(initialState);

    useEffect(() => {
        saveSubtasks();
    }, [_subtask.startDate, _subtask.endDate, _subtask.completed])

    const saveSubtasks = () => {        
        setTask((pos) => ({
            ...pos,
            subtasks: pos.subtasks.map((item) => 
                (item.subtaskID === _subtask.subtaskID) ? _subtask : item
            )
        }));
    };
    
    const transverseSubtasks = (event) => {
        if ((event.key === 'ArrowDown') 
            || (event.key === 'Tab')) {
            setFocusIndex((prevIndex) => (
                Math.min(prevIndex + 1, task.subtasks.length - 1)
            ));
        } else if ((event.key === 'ArrowUp')
            || (event.key === 'Backspace')) {
            setFocusIndex((prevIndex) => (
                Math.max(prevIndex - 1, 0)
            ));
        } else if (event.key === 'Enter') {
            setFocusIndex((prevIndex) => (
                prevIndex + 1
            ));
        }
    };

    const addSubtask = (subtaskID, newEntry) => {
        const index = task.subtasks.findIndex((item) => (
            item.subtaskID === subtaskID
        ));
        const newSubtask = {
            "subtaskID": uuidv4(),
            "subtask": newEntry,
        };
        const updatedSubtasks = [
            ...task.subtasks.slice(0, index + 1),
            newSubtask,
            ...task.subtasks.slice(index + 1)
        ];
        setTask((task) => ({
            ...task,
            subtasks: updatedSubtasks,
        }));
    };

    const deleteSubtask = (subtaskID, entry) => {
        const index = task.subtasks.findIndex((item) => (
            item.subtaskID === subtaskID
        ));
        const updatedEntry = {
            ...task.subtasks[index - 1],
            subtask: `${task.subtasks[index - 1].subtask}${entry}`
        }
        const updatedSubtasks = [
            ...task.subtasks.slice(0, index - 1),
            updatedEntry,
            ...task.subtasks.slice(index + 1)
        ];
        setTask((task) => ({
            ...task,
            subtasks: updatedSubtasks,
        }));
    };

    const handleChange = (event) => {
        _setSubtask({
            ..._subtask,
            "subtask": event.target.value
        });
    };

    const handleKeyDown = (event) => {
        const entry = event.target.value;
        const cursorPos = event.target.selectionEnd;
        const key = event.key;
        saveSubtasks();

        if ((event.key === "ArrowUp") || (key === "ArrowDown")|| (key === "Tab")) {            
            event.preventDefault();
            transverseSubtasks(event);
         } else if (key === "Enter") {
            event.preventDefault();
            const newEntry = entry.substring(cursorPos, entry.length);
            _subtask.subtask = entry.substring(0, cursorPos);
            addSubtask(subtask.subtaskID, newEntry);
            transverseSubtasks(event)
        } else if (key === "Backspace") {
            if (cursorPos === 0) {
                event.preventDefault();
                if (task.subtasks.length !== 1) {
                    deleteSubtask(_subtask.subtaskID, entry);
                    transverseSubtasks(event);
                }
            }
        }
    };

    const toggleStatus = () => {
        let completed = (_subtask.completed === 1) ? 0 : 1;
        _setSubtask({
            ..._subtask,
            completed: completed,
        });
    }

    const handleDateChange = (dates, dateStrings) => {
        _setSubtask({
            ..._subtask,
            startDate: dayjs(dateStrings[0], "DD-MM-YYYY").format(DATE_FORMAT),
            endDate: dayjs(dateStrings[1], "DD-MM-YYYY").format(DATE_FORMAT),
        })
    };

    const handleFocus = () => {
        const index = task.subtasks.findIndex((item) => (
            item.subtaskID === _subtask.subtaskID
        ));
        setFocusIndex(index);
    }

    return (
        <div className={`flex flex-row`}>
            <Checkbox
                tabIndex="-1"
                checked={_subtask.completed === 1}
                onChange={toggleStatus}
                className={`opacity-${_subtask.completed === 1 ? "50" : "full"} border-accent`}
            />
            <TextArea
                onChange={(event) => {handleChange(event)}}
                onKeyDown={(event) => {handleKeyDown(event)}}
                onBlur={saveSubtasks}
                onFocus={handleFocus}
                value={_subtask.subtask}
                placeholder={"New subtask..."}
                spellcheck="false"
                className={`border-none focus:shadow-none font-medium ml-sm text-${_subtask.completed === 1 ? "accent" : "text"} text-md`}
                ref={ref}
                autoSize
            /> 
            <RangePicker
                value={[
                    dayjs(_subtask.startDate, DATE_FORMAT),
                    dayjs(_subtask.endDate, DATE_FORMAT),
                ]}
                allowClear={false}
                format={"DD-MM-YYYY"}
                onChange={handleDateChange}
                variant="borderless"
                size="small"
                className={`font-medium ml-sm text-${_subtask.completed === 1 ? "accent" : "text"} text-md`}
                minDate={dayjs(task.startDate, DATE_FORMAT)}
                maxDate={dayjs(task.dueDate, DATE_FORMAT)}
            />
        </div>
    );
});
export default SubtaskDialog;

// check tab, backspace and enter are working correctly
