/**
 * Helper functions for API requests
 */

const apiURL = 'https://pixel-server-bb389e7b4534.herokuapp.com/'


/**
 * Fetches users from the API.
 * @returns {Promise} - Promise resolving to users objects.
 */
export const getUsers = async () => {
  const response = await fetch(`${apiURL}users/`);
  return response.json();
};

/**
 * Fetches user data from the API.
 * @returns {Promise} - Promise resolving to user objects.
 */
export const getUser = async (id) => {
  const response = await fetch(`${apiURL}users/${id}`);
  return response.json();
};

export const saveUser = async (user) => {
  let response = await fetch(`${apiURL}users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return await response.json();
}

/**
 * Fetches users tasks from the API.
 * @returns {Promise} - Promise resolving to the tasks object.
 */
export const getTasks = async (userID) => {
  try {
    const response = await fetch(`${apiURL}tasks/`);
    const tasks = await response.json();

    // Filter tasks based on userID
    const filtered = tasks.filter((task) => parseInt(task.userID, 10) === parseInt(userID, 10));

    return filtered.map((task) => {
      let parsedSubtasks = [];
      if ((typeof (task.subtasks)) === "string") {
        try {
          parsedSubtasks = JSON.parse(task.subtasks);
        } catch (error) {
          console.error("Error parsing subtasks for task ID:", task.id, error);
        }
      } else {
        parsedSubtasks = task.subtasks;
      }
      return {
        ...task,
        subtasks: parsedSubtasks,
      };
    });
  } catch (error) {
    console.log('Error when fetching user tasks:', error);
  }
};


/**
 * Fetches users task from the API.
 * @returns {Promise} - Promise resolving to the task object.
 */
export const getTask = async (userID, taskID) => {
  try {
    const response = await fetch(`${apiURL}tasks/${taskID}`);
    const task = await response.json();

    const usersTask = task.find((e) => e.userID === userID);

    if (!usersTask) {
      throw new Error(`Task not found for user ID: ${userID}`);
    }

    let parsedSubtasks = [];
    if (typeof usersTask.subtasks === "string") {
      try {
        parsedSubtasks = JSON.parse(usersTask.subtasks);
      } catch (error) {
        console.error("Error parsing subtasks for task ID:", taskID, error);
      }
    } else {
      parsedSubtasks = usersTask.subtasks;
    }
    return {
      ...usersTask,
      subtasks: parsedSubtasks, 
    };

  } catch (error) {
    console.error('Error when fetching user task:', error);
  }
};

export const saveTask = async (task) => {

  try {
    // Try to update the task
    let response = await fetch(`${apiURL}tasks/${task.taskID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    // If the task does not exist, create a new task
    if (response.status === 404) {
      response = await fetch(`${apiURL}tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
    }

    // Return the response data
    return await response.json();
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
};


/**
 * Delete a task from the API.
 * @param {string} taskID - The ID of the task data.
 * @returns {Promise} - Promise resolving to the parsed JSON data.
 */
export const deleteTask = async (taskID) => {
  try {
    const response = await fetch(`${apiURL}tasks/${taskID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 404) {
      console.log("Task does not exist in database")
    }
    return;
  } catch (error) {
    console.log("Task deleted");
  }
}

/**
 * Delete a user from the API.
 * @param {string} userID - The ID of the user data.
 * @returns {Promise} - Promise resolving to the parsed JSON data.
 */
export const deleteUser = async (userID) => {
    return fetch(`${apiURL}users/${userID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
}

// troubleshooting

export const deleteChannel = async (channelID) => {
  try {
    const exists = await existsOnChannelsApi(channelID);
    console.log(`Channel exists: ${exists}`);

    if (exists) {
      const response = await fetch(`${apiURL}channels/${channelID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to delete channel. Status: ${response.status}`);
      } else {
        console.log('Channel deleted successfully');
      }

      return response;
    } else {
      console.log('Channel does not exist');
    }
  } catch (error) {
    console.error('Error deleting channel:', error);
  }
};

export const saveChannel = async (channel) => {
  const exists = await existsOnChannelsApi(channel.channelID);

  // save as new channel on API
  if (!exists) {
    let response = await fetch(`${apiURL}channels/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(channel),
    });
    return await response.json();
  } else {
    // update channel entry on API
    let response = await fetch(`${apiURL}channels/${channel.channelID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(channel),
    });
    return await response.json();
  }
}

/**
 * Fetches users channels from the API.
 * @returns {Promise} - Promise resolving to the tasks object.
 */
export const getChannels = async (userID) => {
  try {
    const response = await fetch(`${apiURL}channels/`);
    const channels = await response.json();
    return channels.filter((channel) => (
      channel.userID === userID
    ));
  } catch (error) {
    console.error('Error when fetching users channels', error);
  }
}

export const existsOnChannelsApi = async (channelID) => {
  try {
    const response = await fetch(`${apiURL}channels/${channelID}`);
    return response.ok ? true : false;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

export const requestLogin = async (response) => {
  const token = response.credential;

  console.log(token);
  
  try {
    const serverResponse = await fetch(`${apiURL}login/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ token }),
    });
    localStorage.setItem('access_token', token);
    return await serverResponse.json();
  } catch (error) {
    console.error('Login failed:', error);
  }
};
