import { useState, useContext } from 'react';
import { DatePicker, Select } from 'antd';
import { TaskContext } from '../../../TaskContext';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const DATE_FORMAT = "YYYY-MM-DD";

function TaskDataInput ({ task, setTask }) {

    const { channels } = useContext(TaskContext)

    const [channel, setChannel] = useState(() => {
        if (task?.channelID) {
            return channels.find((_channel) => (
                _channel.channelID === task.channelID
            )).channelCode;
        } 
        return null
    });

    const options = channels.map((channel) => ({
        label: channel.channelCode,
        value: channel.channelID
    }));

    const handleSelect = (label, value) => {
        setChannel(label);
        setTask({
            ...task,
            channelID: value.value
        })
    };

    const filterOption = (input, option) => (
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    );

    const handleDateChange = (dates, dateStrings) => {
        setTask({
            ...task,
            startDate: dayjs(dateStrings[0], "DD-MM-YYYY").format(DATE_FORMAT),
            dueDate: dayjs(dateStrings[1], "DD-MM-YYYY").format(DATE_FORMAT),
        })
    };

    return (
            <div tabIndex="-1">
                <Select
                    value={channel}
                    variant="borderless"
                    size="small"
                    showSearch
                    placeholder="#channel"
                    filterOption={filterOption}
                    onChange={(label, value) => handleSelect(label, value)}
                    options={options}
                    className="mr-md  w-[7.5rem]"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode} />  
                <RangePicker
                    value={[
                        dayjs(task.startDate, DATE_FORMAT),
                        dayjs(task.dueDate, DATE_FORMAT),
                    ]}
                    format={"DD-MM-YYYY"} 
                    onChange={handleDateChange}
                    allowClear={false}
                    variant="borderless"
                    size="small"
                    className={"w-[15rem]"} />
            </div>       
    );
}
export default TaskDataInput;