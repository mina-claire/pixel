// Import dependencies, declarations and components

import { useState } from 'react';
import TaskList from './TaskList';
import ArchivedList from './ArchivedList';
import { 
  Collection,
  ArrowBarLeft,
  ArrowBarRight,
  } 
  from 'react-bootstrap-icons';

/**
 * Pixel sidebar component that can be opened and closed
 * On open, the sidebar displays archived or current tasks based on the
 * selected option.
 * @returns {JSX.Element} - The rendered sidebar component.
 */
function Sidebar () {

  // Initialise local states
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("list");

  // Open, close and render set sidebar content
  const renderContent = (event) => {
    if (content === event) {
      setOpen(!open);
    } else {
      setContent(event);
      if (!open) {
        setOpen(true);
      }
    };
  }

  // Sidebar content options
  const opt = {
    list:  <TaskList />,
    archive: <ArchivedList />,
  };
    
  return (
    <div className="flex flex-row shadow-sidebar">
      <div className="flex flex-col h-screen border-2 p-base
            text-accent bg-bg z-50">

        {/** Render open/close icon based on open state */}
        {open ? (
          <ArrowBarLeft
            title={"close"}
            className="sidebar-icon"
            onClick={() => setOpen(!open)} 
          />
        ) : (
          <ArrowBarRight
            title={"open"}
            className="sidebar-icon"
            onClick={() => setOpen(!open)} 
          />
        )}

        {/** Render master list button */}
        <Collection
          title={"master task list 🧠"}
          onClick={() => renderContent("list")}
          className="sidebar-icon"
        />
      </div>

      {/** Render sidebar content */}
      <div className={`bg-bg h-screen relative transition-all ease-in-out duration-500
            ${open ? "translate-x-0 w-sidebar" : "-translate-x-[18rem] w-0"}`}>
        {opt[content]}
      </div>
    </div>
  );
};
export default Sidebar;