/* eslint-disable react-hooks/exhaustive-deps */
import { Input, ColorPicker } from "antd";
import { useContext, useEffect } from "react";
import { TrashFill, Floppy2Fill} from "react-bootstrap-icons";
import { TaskContext } from "../../../TaskContext";
import { useState } from "react";
import { deleteChannel, saveChannel } from "../../../data/api";
import { Button, message } from "antd";

const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

function EditChannel ({ channelID }) {
    const { setChannels, channels } = useContext(TaskContext);
    const [channel, setChannel] = useState(false);

    const handleSaveChannel = async () => {
        setChannels((prev) => {
            const index = prev.findIndex((c) => (
                c.channelID === channel.channelID
            ));
            let updated = [...channels];
            updated[index] = channel;
            return updated;
        })
        await saveChannel(channel);
        message.success("saved!", 2.5);
    }

    const handleChannelDelete = async () => {
        setChannels((prev) => {
            let updated = [...prev]
            const index = prev.findIndex((c) => (
                c.channelID === channel.channelID
            ));
            updated.splice(index, 1);
            return updated;
        });
        await deleteChannel(channel.channelID);
        message.success("deleted!", 2.5);
    }

    useEffect(() => {
        const data = channels.find((_channel) => (
            _channel.channelID === channelID
        ))
        setChannel(data)
    }, []);

    const handleColourChange = (colour) => {
        setChannel((ch) => ({
            ...ch,
            "colour": rgbToHex(colour.metaColor.r, colour.metaColor.g, colour.metaColor.b),
        }));
    }

    useEffect(() => {
        const saveChannelData = () => {
            setChannels((prevChannels) => {
                const updatedChannels = [...prevChannels];
                const index = updatedChannels.findIndex((c) => (
                    c.channelID === channel.channelID
                ));
                if (index !== -1) {
                    updatedChannels[index] = channel;
                } else {
                    updatedChannels.push(channel);
                }
                return updatedChannels;
            });
        };
        if (channel) {
            saveChannelData();
        }
    }, [channel]);

    return (
        <>
        { channel ? (
        <div>
            <div className="flex flex-row align-center my-base border-accent">
            <Input
                placeholder="Channel Code"
                size="small"
                value={channel.channelCode}
                className="border-accent"
                onChange={(e) => {
                    setChannel((el) => ({
                        ...el,
                        "channelCode": e.target.value,
                    }));
                } }
                count={{
                    show: true,
                    max: 8,
                    strategy: (txt) => txt.length,
                    exceedFormatter: (txt, { max }) => txt.slice(0, max)
                }} />
            <ColorPicker
                defaultValue="#ffa8fe"
                value={channel.colour}
                className="ml-base border-accent z-3000"
                size="small"
                onChange={handleColourChange}
                getPopupContainer={(triggerNode) => triggerNode.parentNode} />
        </div>
        <Input
            placeholder="Channel Name"
            onChange={(e) => {
                setChannel((el) => ({
                    ...el,
                    "name": e.target.value,
                }));
            } }
            value={channel.name}
            size="small"
            className="mb-base border-accent"
            count={{
                show: true,
                max: 100,
                strategy: (txt) => txt.length,
                exceedFormatter: (txt, { max }) => txt.slice(0, max)
            }} />

            <Button 
                onClick={handleChannelDelete}
                size="small"
                type="text"
                title="Delete forever 😱"
                aria-label="Delete"
                className="text-accent hover:scale-110 hover:text-primary mr-lg"
            >
                <TrashFill />
            </Button>

            <Button 
                onClick={handleSaveChannel}
                type="text"
                size="small"
                title="Save Changes"
                aria-label="Archive"
                className="text-accent hover:scale-110 hover:text-primary mr-lg"
            >
                <Floppy2Fill />
            </Button>
            </div>
            
        ) : (
            null
        )}
        </>
    );
}

export default EditChannel;