/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Checkbox } from "antd";
import { useContext, useEffect } from "react";
import { Floppy2Fill} from "react-bootstrap-icons";
import { TaskContext } from "../../../TaskContext";
import { useState } from "react";
import { saveUser } from "../../../data/api";
import { Button, message } from "antd";

function EditUser ({ userID }) {
    const { setUsers, users } = useContext(TaskContext);
    const [user, setUser] = useState(false);

    const handleUserSave = async () => {
        setUsers((prev) => {
            const index = prev.findIndex((el) => (
                userID === el.id
            ));
            let updated = [...prev];
            updated[index] = user;
            return updated;
        })
        await saveUser(user)
        message.success("updated!", 2.5);
    }

    useEffect(() => {
        const data = users.find((el) => (
            el.id === userID
        ))
        setUser(data)
    }, []);

    useEffect(() => {
        const saveUserData = () => {
            setUsers((prev) => {
                const updated = [...prev];
                const index = updated.findIndex((el) => (
                    el.id === userID
                ));
                if (index !== -1) {
                    updated[index] = user;
                } else {
                    updated.push(prev);
                }
                return updated;
            });
        };
        if (user) {
            saveUserData();
        }
    }, [user]);

    return (
        <>
        { user ? (
        <div className="w-[20rem]">
        <Input
            placeholder="First Name..."
            onChange={(e) => {
                setUser((el) => ({
                    ...el,
                    "firstName": e.target.value,
                }));
            } }
            value={user.firstName}
            size="small"
            className="mb-base border-accent"
            count={{
                show: true,
                max: 100,
                strategy: (txt) => txt.length,
                exceedFormatter: (txt, { max }) => txt.slice(0, max)
            }}
        />

        <Input
            placeholder="Email..."
            onChange={(e) => {
                setUser((el) => ({
                    ...el,
                    "email": e.target.value,
                }));
            } }
            value={user.email}
            size="small"
            className="mb-base border-accent"
            count={{
                show: true,
                max: 100,
                strategy: (txt) => txt.length,
                exceedFormatter: (txt, { max }) => txt.slice(0, max)
            }}
        />

        <div className="flex flex-row content-center justify-between ">
         <div className="flex justify-between hover:bg-primary hover:bg-opacity-10
                pointer-default py-sm">
            <p>Administration permissions</p>
            <Checkbox
                checked={user.isAdmin} 
                className="ml-md"
                onChange={(e) => setUser({
                    ...user,
                    "isAdmin": e.target.checked,
                })
            }
            />
            </div>
            <Button
                onClick={handleUserSave}
                type="text"
                size="small"
                title="Save Changes"
                aria-label="Save"
                className="text-accent hover:scale-110 hover:text-primary mt-sm"
            >
                <Floppy2Fill />
            </Button>
        </div>   
        </div>   
        ) : (
            null
        )}
        </>
    );
}

export default EditUser;