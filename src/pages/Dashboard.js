import '../App.css';
import { useEffect, useContext } from 'react';
import NavigationButtons from '../components/NavigationButtons';
import Sidebar from '../components/Sidebar/Sidebar';
import Week from '../components/WeekView/Week';
import { TaskContext } from '../TaskContext';
import { useNavigate } from 'react-router-dom';

const apiURL = 'https://pixel-server-bb389e7b4534.herokuapp.com/'

/**
 * User Pixel Dashboard Component
 * Allow users to interact with and overview tasks and projects
 * @route /dashboard
 * @description Renders the users dashboard allowing user to see an overview,
 * as well as create, edit and delete projects, channels and tasks. Users with
 * admin permissions may also manage users via this page.
 */
function Dashboard() {
  const { setUser, loading } = useContext(TaskContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${apiURL}api/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.log('Error:', error);
        console.log('User not authenticated, redirecting to login');
        navigate('/');
      }
    };
  
    checkAuth();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <div></div> // Empty div when loading
      ) : (
        <div
          className="flex flex-row w-screen h-[100vh] font-Avenir overflow-hidden
          cursor-default responsive"
        >
          <NavigationButtons />
          <Sidebar />
          <Week />
        </div>
      )}
    </>
  );
}

export default Dashboard;
