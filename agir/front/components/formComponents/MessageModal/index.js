import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import Trigger from "./Trigger";
import Modal from "./Modal";

const MessageModal = (props) => {
  const {
    user,
    messageId,
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

  useEffect(() => {
    messageId ? setIsOpen(true) : setIsOpen(false);
  }, [messageId]);

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
        messageId={messageId}
        message={message}
        selectedEvent={selectedEvent}
        onSend={onSend}
      />
    </>
  );
};
MessageModal.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  selectedEvent: PropTypes.object,
  loadMoreEvents: PropTypes.func,
  messageId: PropTypes.string,
  message: PropTypes.string,
  onSend: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};
export default MessageModal;
