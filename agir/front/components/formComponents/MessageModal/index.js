import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";

import Trigger from "./Trigger";
import Modal from "./Modal";

const MessageModal = (props) => {
  const { user, message, onSend, events, loadMoreEvents, isLoading } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useMemo(() => {
    message ? setIsOpen(true) : setIsOpen(false);
  }, [message]);

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
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string,
    linkedEvent: PropTypes.object,
  }),
  onSend: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};
export default MessageModal;
