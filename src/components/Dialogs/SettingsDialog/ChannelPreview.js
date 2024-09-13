/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, Popover } from "antd";
import EditChannel from "./EditChannel";
import { useContext, useEffect } from "react";
import { TaskContext } from "../../../TaskContext";
import { saveChannel } from "../../../data/api";

function ChannelPreview ({ channel }) {
    const {setChannels, channels } = useContext(TaskContext);
    const index = channels.findIndex((c) => (
        c.channelID === channel.channelID
    ));

    const handleArchive = async (event) => {
        setChannels((prevChannels) => {
            const updatedChannels = [...prevChannels];
            updatedChannels[index] = {
                ...updatedChannels[index],
                "archived": Number(!event.target.checked),
            }
            return updatedChannels;
        });
    }

    useEffect(() => {
        const updateChannel = async () => {
            await saveChannel(channels[index]);
        }
        updateChannel();
    }, [channels])

    return (
        <div className="flex flex-row justify-between items-center rounded hover:bg-bg p-xs">
            <h2 className={`text-sm font-base text-${channel.colour} cursor-default`}># {channel.channelCode}</h2>

            <div className="flex flex-row">
                <Popover
                    content={<EditChannel channelID={channel.channelID} />}
                    placement="bottomLeft"
                    title="Manage Channel"
                    trigger="click"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                    <p className="cursor-pointer pl-lg">✍️</p>
                </Popover>

                <Checkbox
                    className="pl-lg pr-base"
                    onChange={handleArchive}
                    checked={!Number(channels[index].archived)}
                />
            </div>
        </div>
    );
}

export default ChannelPreview;
