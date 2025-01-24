import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import "./App.css";

const App = () => {
  const [events, setEvents] = useState(() => {
    // Load events from localStorage when the app initializes
    const savedEvents = localStorage.getItem("calendarEvents");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const initialEvents = [
    { id: "1", title: "Event 1" },
    { id: "2", title: "Event 2" },
    { id: "3", title: "Event 3" },
    { id: "4", title: "Event 4" },
    { id: "5", title: "Event 5" },
  ];

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  // Initialize draggable functionality for external elements
  useEffect(() => {
    const draggableEl = document.querySelector(".draggable-container");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".draggable-item",
        eventData: (eventEl) => {
          const event = JSON.parse(eventEl.getAttribute("data-event"));
          return { ...event };
        },
      });
    }
  }, []);

  // Handle dropping an event into the calendar
  const handleEventReceive = (info) => {
    const newEvent = {
      id: String(new Date().getTime()), // Generate a unique ID using timestamp
      title: info.event.title,
      start: info.event.start.toISOString(), // Ensure proper date format
    };

    setEvents([...events, newEvent]); // Add to the state
    info.event.remove(); // Remove the placeholder event
  };

  // Handle when an event is dragged and dropped within the calendar
  const handleEventChange = (changeInfo) => {
    const updatedEvents = events.map((event) =>
      event.id === changeInfo.event.id
        ? {
            ...event,
            start: changeInfo.event.start.toISOString(), // Ensure proper date format
          }
        : event
    );

    setEvents(updatedEvents); // Update state with new positions
  };

  return (
    <div className="App">
      {/* Draggable Events */}
      <div className="draggable-container">
        {initialEvents.map((event) => (
          <div
            key={event.id}
            className="draggable-item"
            data-event={JSON.stringify({
              title: event.title,
              id: event.id,
            })}
          >
            {event.title}
          </div>
        ))}
      </div>

      {/* FullCalendar Component */}
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable={true} // Allows editing events
        droppable={true} // Allows dropping external events
        events={events} // Renders the events
        eventReceive={handleEventReceive} // Handles dropped events
        eventChange={handleEventChange} // Handles drag-and-drop within calendar
      />
    </div>
  );
};

export default App;
