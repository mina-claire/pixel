import React, { createContext, useState, useEffect } from 'react';
import { getTasks, getChannels, getUsers } from './data/api';

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
    const [users, setUsers] = useState(false)
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [channels, setChannels] = useState(false);
    const [tasks, setTasks] = useState(false);

    useEffect(() => {
        if (channels && tasks && loading && users) {
          setLoading(false);
        }
    }, [channels, tasks, loading, users]);

    useEffect(() => {
      const fetchTasks = async () => {
        const response = await getTasks(user.id);
        setTasks(response);

      };
  
      const fetchChannels = async () => {
        const response = await getChannels(user.id);
        setChannels(response);
      };

      const fetchUsers = async () => {
        const response = await getUsers();
        setUsers(response);
      };
  
      if (user) {
        if (Number(user?.isAdmin)) {
          fetchUsers();
        } else {
          setUsers(true);
        }
        fetchChannels();
        fetchTasks();
      }
    }, [user]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, channels, setChannels, loading, setLoading, user, setUser, users, setUsers }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskProvider, TaskContext };