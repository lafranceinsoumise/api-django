import React from "react";

import ChatMessageModal from "./index";

export default {
  component: ChatMessageModal,
  title: "Form/ChatMessageModal",
};

const user = {
  fullName: "Bill Murray",
  avatar: "https://www.fillmurray.com/200/200",
};
const events = [
  {
    id: "a",
    name: "Événement A",
    startTime: "2021-01-09 10:04:19",
    type: "G",
  },
  {
    id: "b",
    name: "Événement B",
    startTime: "2021-01-09 10:04:19",
    type: "M",
  },
  {
    id: "c",
    name: "Événement C",
    startTime: "2021-01-09 10:04:19",
    type: "A",
  },
  {
    id: "d",
    name: "Événement D",
    startTime: "2021-01-09 10:04:19",
    type: "O",
  },
  {
    id: "e",
    name: "Événement E",
    startTime: "2021-01-09 10:04:19",
    type: "A",
  },
];

export const Default = () => {
  const [messages, setMessages] = React.useState([]);
  const [visibleEvents, setVisibleEvents] = React.useState(events.slice(0, 3));
  const [isLoading, setIsLoading] = React.useState(false);
  const loadMoreEvents = React.useCallback(() => {
    setVisibleEvents(events);
  }, []);
  const handleSend = React.useCallback(async (message) => {
    await new Promise((resolve) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMessages((state) => [...state, message]);
        setVisibleEvents(events.slice(0, 3));
        resolve();
      }, 2000);
    });
  }, []);

  return (
    <div
      style={{
        background: "lightgrey",
        minHeight: "100vh",
        padding: "16px",
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          padding: "0",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <ChatMessageModal
          key={messages.length}
          isLoading={isLoading}
          onSend={handleSend}
          user={user}
          events={visibleEvents}
          loadMoreEvents={
            visibleEvents.length === events.length ? undefined : loadMoreEvents
          }
        />
      </div>
      {messages.map((message) => (
        <p
          style={{
            background: "white",
            borderRadius: "8px",
            maxWidth: "480px",
            padding: "0.875rem",
            margin: "8px auto",
            fontSize: "14px",
          }}
          key={message}
        >
          <strong>{user.fullName}</strong>
          <br />
          {message.message}
          <br />
          <small>{message.event.name}</small>
        </p>
      ))}
    </div>
  );
};
