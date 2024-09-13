// Import dependencies and declarations

import * as Dialog from "@radix-ui/react-dialog";
import { Checkbox, Input } from "antd";
import ChannelPreview from "./ChannelPreview";
import { useContext, useState } from "react";
import { TaskContext } from "../../../TaskContext";
import { PlusSquareFill } from "react-bootstrap-icons";
import { v4 as uuidv4 } from 'uuid';
import { saveChannel, saveUser } from "../../../data/api";

function SettingsDialog () {
    const { channels, setChannels, user, setUser } = useContext(TaskContext);

    const archivedChannels = channels.filter(channel => Number(channel.archived));
    const [display, setDisplay] = useState(archivedChannels.length ? false : true);

    const addChannel = async () => {
        const newChannel = {
            "channelID": uuidv4(),
            "userID": user.id,
            "channelCode": "NEW",
            "name": "",
            "colour": "#ff69b4",
            "archived": 0,
        };
        const response = await saveChannel(newChannel);
        setChannels([
            ...channels,
            response
        ]);
    };

    const updateFirstName = (event) => {
        setUser((_user) => ({
            ..._user,
            "firstName": event.target.value,
        }));
    };

    const handleChange = (event) => {
        const isChecked = event.target.checked;
        setDisplay(Number(isChecked));
        const updatedChannels = channels.map((channel) => ({
            ...channel,
            "archived": Number(!isChecked)
        }));
        setChannels(updatedChannels);
    };

    const signOut = async () => {
        setUser({
            ...user,
            "isLoggedIn": 0,
        });
        await saveUser(user);
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4
                    w-[19rem] justify-center rounded-gentle bg-fg shadow-dialog p-xlg">

                <div>
                    <div className="flex flex-row items-center mb-base">
                        <PlusSquareFill
                            title="add channel"
                            onClick={addChannel}
                            className="mr-base text-text hover:text-h1 hover:cursor-pointer"
                        />
                        <h1 className="text-h1 font-heavy text-md">
                            Channel Settings
                        </h1>
                    </div>
                    <div className="w-[15rem]">
                        <div className="flex flex-row rounded hover:bg-text-bg px-xs
                                    justify-between items-center ">
                            <h2 className="text-sm font-base transition-colors animate-rainbow
                                    hover:cursor-defaul ">
                                # ALL CHANNELS
                            </h2>
                            <Checkbox
                                checked={display}
                                className="px-base"
                                onChange={handleChange} />
                        </div>
                        {channels.map((channel) => (
                          <ChannelPreview key={channel.channelID} channel={channel} />
                        ))}
                    </div>
                </div>
                

                <div>
                    <h1 className="text-h1 font-heavy text-md mb-base mt-lg">Profile Settings</h1>
                    <Input 
                        type="text"
                        value={user.firstName}
                        placeholder="my name is..."
                        onChange={updateFirstName}
                        className="my-sm border-accent text-text"
                    />
                    <Input 
                        type="text"
                        value={user.email}
                        placeholder="my email is..."
                        className="my-sm border-accent text-text"
                        disabled={true}
                    />
                    <div 
                        onClick={signOut}
                        className="text-sm font-base mt-md mb-none text-text underline
                            hover:cursor-pointer text-center">
                        Sign Out
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    );
}
export default SettingsDialog;