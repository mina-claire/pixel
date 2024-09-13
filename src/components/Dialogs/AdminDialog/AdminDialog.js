import * as Dialog from "@radix-ui/react-dialog";
import EditUser from './EditUser';
import { TrashFill, PencilSquare, SearchHeart } from "react-bootstrap-icons";
import { Input, Popover } from "antd";
import { TaskContext } from "../../../TaskContext";
import { useContext } from "react";
const { Search } = Input;

function AdminDialog () {
    const { users } = useContext(TaskContext);
    const onSearch = (value, _e, info) => console.log(info?.source, value);

    // disable for now so I do not accidentally delete when testing
    // Check cascading in SQL

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/4 left-1/2 -translate-x-1/2 w-admin-dialog rounded-gentle bg-fg shadow-dialog p-xlg">

                <h1 className="text-h1 font-heavy text-lg mb-lg">User Management</h1>
                <div className="flex flex-row justify-between font-base">
                    <Search
                        className="w-full mr-xlg"
                        placeholder="Search..."
                        allowClear
                        enterButton={<SearchHeart />}
                        size="middle"
                        onSearch={onSearch}
                    />
                </div>

                <div className="flex justify-center rounded-steep w-full mt-xlg">
                    <table className="table table-auto w-full cursor-default">
                        <thead className="text-text font-heavy text-sm text-left bg-bg bg-bg uppercase">
                            <tr>
                                <th className="py-sm pl-md">USER ID</th>
                                <th className="py-sm">NAME</th>
                                <th className="py-sm">EMAIL</th>
                                <th className="py-sm">PERMISSIONS</th>
                                <th className="py-sm">ACTIONS</th>
                            </tr>
                        </thead>

                        {users.map((_user) => (
                            <tbody className="bg-white divide-y divide-gray-200 text-text text-sm overflow-auto">
                            <tr className="hover:bg-primary hover:bg-opacity-10">
                                <td className="py-sm pl-md">{_user.id}</td>
                                <td className="py-base">{_user.firstName}</td>
                                <td className="py-base">{_user.email}</td>
                                <td className="py-base">{Number(_user.isAdmin ?? 0) ? "Admin" : "Client"}</td>
                                <td className="py-base">
                                    <div className="flex flex-row justify-center text-base">
                                        <Popover
                                            content={<EditUser userID={_user.id} />}
                                            placement="bottomLeft"
                                            title="Manage User"
                                            trigger="click"
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        >
                                            <PencilSquare  className="mr-xlg cursor-pointer transform transition-transform duration-200 ease-out hover:scale-110"/>
                                        </Popover>
                                        <TrashFill 
                                            className=" cursor-pointer transform transition-transform duration-200 ease-out hover:scale-110"
                                             />
                                    </div>
                                </td>
                            </tr>
                             </tbody>
                        ))}
                        </table>
                    </div>
                    
            </Dialog.Content>
        </Dialog.Portal>
    );
}
export default AdminDialog;