/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useContext, useRef, lazy, Suspense } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import { TaskContext } from '../../TaskContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';

// Lazy load the AddTask and DaysTasks components
const AddTask = lazy(() => import('../TaskPreview/AddTask'));
const DaysTasks = lazy(() => import('./DaysTask'));

/**
 * A function to retrieve a greeting determined by the time of day.
 * @returns {String} - a greeting determined by the time of day.
 */
function getGreeting() {
    const hour = dayjs().hour();
    let greeting;
    switch (true) {
        case (hour < 12):
            greeting = "Good morning";
            break;
        case (hour < 18):
            greeting = "Good afternoon";
            break;
        case (hour < 22):
            greeting = "Good evening";
            break;
        default:
            greeting = "Good night";
            break;
    }
    return greeting;
}

/**
 * Render weekly view
 * Displays weekly view. Each day shows the tasks and subtasks to
 * be completed per day. Each day has a corresponding date and title,
 * with a button that allows users to add a new task. A preview of
 * tasks due on each day is provided under each heading. Each preview
 * gives opportunity for user to edit completion state of subtasks and,
 * edit the task via trigger to CRUD dialog. The view is scrollable
 * and more days are loaded upon horizontal scroll.
 * @returns {JSX.Element} - The weekly view
 */
const Week = () => {
    const { user } = useContext(TaskContext);
    const [view, setView] = useState([]);
    const [dayIndex, setDayIndex] = useState(0);
    const [pastDayIndex, setPastDayIndex] = useState(0);
    const loadedDays = useRef(new Set()); // Track loaded days to avoid duplicates

    const containerRef = useRef(null);
    const dayRefs = useRef([]); // Ref for each day element
    const { events } = useDraggable(containerRef);

    const greeting = getGreeting();

    // Fetch future days
    const fetchFutureDays = useCallback(() => {
        const startDay = dayjs().add(dayIndex * 14, 'day').startOf('day');
        const newDays = Array.from({ length: 14 }, (_, index) => ({
            id: dayIndex * 14 + index + 1,
            date: startDay.add(index, 'day').clone(),
        }));

        // Add unique days to avoid duplicates
        const uniqueDays = newDays.filter(day => !loadedDays.current.has(day.date.format('YYYY-MM-DD')));
        uniqueDays.forEach(day => loadedDays.current.add(day.date.format('YYYY-MM-DD'))); // Track loaded days

        setView((prevView) => [...prevView, ...uniqueDays]);
        setDayIndex((prevIndex) => prevIndex + 1);
    }, [dayIndex]);

    // Fetch past days
    const fetchPastDays = useCallback(() => {
        const startDay = dayjs().subtract((pastDayIndex + 1) * 14, 'day').startOf('day');
        const newDays = Array.from({ length: 14 }, (_, index) => ({
            id: -(pastDayIndex * 14 + index + 1),
            date: startDay.add(index, 'day').clone(),
        }));

        // Add unique days to avoid duplicates
        const uniqueDays = newDays.filter(day => !loadedDays.current.has(day.date.format('YYYY-MM-DD')));
        uniqueDays.forEach(day => loadedDays.current.add(day.date.format('YYYY-MM-DD'))); // Track loaded days

        const scrollPositionBefore = containerRef.current?.scrollLeft ?? 0;
        const totalWidthBefore = containerRef.current?.scrollWidth ?? 0;

        setView((prevView) => [...uniqueDays, ...prevView]); // Prepend unique past days
        setPastDayIndex((prevIndex) => prevIndex + 1);

        // Adjust the scroll position to maintain the current view after prepending past days
        setTimeout(() => {
            const totalWidthAfter = containerRef.current?.scrollWidth ?? 0;
            const addedWidth = totalWidthAfter - totalWidthBefore;
            if (containerRef.current) {
                containerRef.current.scrollLeft = scrollPositionBefore + addedWidth;
            }
        }, 0);
    }, [pastDayIndex]);

    // Preload more days as the user approaches the edge
    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        // Trigger past days loading when near the left edge (within 300px)
        if (container.scrollLeft < 300) {
            fetchPastDays();
        }

        // Trigger future days loading when near the right edge (within 300px of max scroll width)
        const scrollRight = container.scrollWidth - container.clientWidth - container.scrollLeft;
        if (scrollRight < 300) {
            fetchFutureDays();
        }
    }, [fetchPastDays, fetchFutureDays]);

    // Scroll to today's date and make it the first visible day
    const goToToday = () => {
        const todayIndex = view.findIndex(day => day.date.isSame(dayjs(), 'day'));
        if (todayIndex !== -1) {
            setDayIndex(todayIndex);
            const todayElement = dayRefs.current[todayIndex];
            if (todayElement && containerRef.current) {
                containerRef.current.scrollLeft = todayElement.offsetLeft;
            }
        }
    };

    useEffect(() => {
        if (view.length) {
            goToToday();  // Scroll to today's date after view is updated
        }
    }, [view]);

    // Fetch initial days on mount
    useEffect(() => {
        fetchFutureDays();
    }, []);

    return (
        <div className="h-full w-full m-xlg cursor-default overflow-auto scroll-smooth relative z-0">
            <div className="flex flex-row align-center">
                <div className="text-xlg text-h1 font-heavy mb-lg">
                    {greeting}, {user.firstName}...
                </div>
                <div>
                    <button 
                        className="border-2 border-accent hover:border-text border-md rounded-full
                         text-text py-xxs px-base ml-lg hover:text-h1 hover:scale-[1.03]"
                        onClick={goToToday}  // Scroll to today's date when clicked
                    >
                        today
                    </button>
                </div>
            </div>

            {/* Infinite Scroll with bi-directional loading */}
            <InfiniteScroll
                dataLength={view.length}
                next={fetchFutureDays}  // Load more future days when scrolling right
                hasMore={true}
                horizontal={true}
                scrollableTarget="scrollableDiv"
                inverse={false}
                onScroll={handleScroll}
            >
                <div id="scrollableDiv" 
                    ref={containerRef} {...events} 
                    className="flex flex-row w-full z-2 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden
                    [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {view.length ? (
                        view.map((object, index) => (
                            <div 
                                key={index} 
                                ref={(el) => (dayRefs.current[index] = el)}  // Set ref for each day
                                className="flex-shrink-0 w-[20rem] mx-sm px-sm"
                            >
                                <h1 className="text-lg mb-sm font-bold ml-base">
                                    {object.date.format('dddd')}
                                </h1>
                                <h2 className="text-sm font-medium mb-md ml-base">
                                    {object.date.format('MMMM D, YYYY')}
                                </h2>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <AddTask date={object.date.format("YYYY-MM-DD")} />
                                    <DaysTasks date={object.date} />
                                </Suspense>
                            </div>
                        ))
                    ) : null}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default Week;
