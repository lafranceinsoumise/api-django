import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";

import Trigger from "./Trigger";
import Modal from "./Modal";

const ChatMessageModal = (props) => {
  const {
    user,
    message,
    selectedEvent,
    onSend,
    events,
    loadMoreEvents,
    isLoading,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Trigger user={user} onClick={handleOpen} />
      <Modal
        shouldShow={isOpen}
        onClose={handleClose}
        user={user}
        events={events}
        loadMoreEvents={loadMoreEvents}
        isLoading={isLoading}
        message={message}
        selectedEvent={selectedEvent}
        onSend={onSend}
      />
    </>
  );
};
ChatMessageModal.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  selectedEvent: PropTypes.object,
  loadMoreEvents: PropTypes.func,
  message: PropTypes.string,
  onSend: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};
export default ChatMessageModal;
