import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import ModalWrapper from "@agir/front/genericComponents/Modal";

import EventStep from "./EventStep";
import MessageStep from "./MessageStep";

const StyledIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  border: none;
  padding: 0;
  margin: 0;
  text-decoration: none;
  background: inherit;
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;
  color: ${style.black1000};

  &:last-child {
    justify-content: flex-end;
  }
  &:first-child {
    justify-content: flex-start;
  }
`;
const StyledModalHeader = styled.header`
  display: ${({ $mobile }) => ($mobile ? "none" : "grid")};
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 0 1.5rem;
  height: 54px;

  h4 {
    grid-column: 1/3;
    grid-row: 1/2;
    text-align: center;
    font-weight: 500;
    font-size: 1rem;
  }

  ${StyledIconButton} {
    grid-column: 2/3;
    grid-row: 1/2;
  }

  @media (max-width: ${style.collapse}px) {
    display: ${({ $mobile }) => ($mobile ? "flex" : "none")};
    justify-content: space-between;
  }
`;
const StyledModalBody = styled.div`
  padding: 0;
  min-height: 200px;
`;
const StyledModalFooter = styled.footer`
  padding: 0 1rem 1rem;

  @media (max-width: ${style.collapse}px) {
    display: none;
  }

  ${Button} {
    width: 100%;
    justify-content: center;
  }
`;
const StyledModalContent = styled.div`
  max-width: 600px;
  margin: 40px auto;
  background-color: white;
  border-radius: 8px;

  @media (max-width: ${style.collapse}px) {
    border-radius: 0;
    max-width: 100%;
    margin: 0;
  }
  ${StyledModalHeader} {
    border-bottom: ${({ $isLoading }) =>
      $isLoading
        ? `8px solid ${style.secondary500}`
        : `1px solid ${style.black100};`};
    transition: border-bottom 250ms ease-in-out;
  }
  ${StyledModalBody},
  ${StyledModalFooter} {
    opacity: ${({ $isLoading }) => ($isLoading ? ".3" : "1")};
    transition: opacity 250ms ease-in-out;
  }
`;

const Modal = (props) => {
  const {
    shouldShow,
    onClose,
    events,
    onSend,
    user,
    isLoading,
    loadMoreEvents,
    message,
  } = props;

  const [content, setContent] = useState((message && message.content) || "");
  const [selectedEvent, setSelectedEvent] = useState(
    (message && message.linkedEvent) || null
  );

  const handleChangeContent = useCallback((content) => {
    setContent(content);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleClearEvent = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleSend = useCallback(() => {
    onSend({
      ...(message || {}),
      content: content.trim(),
      linkedEvent: selectedEvent,
    });
  }, [onSend, message, content, selectedEvent]);

  useEffect(() => {
    if (shouldShow) {
      setContent((message && message.content) || "");
      setSelectedEvent((message && message.linkedEvent) || null);
    }
  }, [shouldShow, message]);

  return (
    <ModalWrapper
      shouldShow={shouldShow}
      onClose={isLoading ? undefined : onClose}
    >
      <StyledModalContent $isLoading={isLoading}>
        <StyledModalHeader>
          <h4>Nouveau message</h4>
          <StyledIconButton onClick={onClose} disabled={isLoading}>
            <RawFeatherIcon name="x" />
          </StyledIconButton>
        </StyledModalHeader>
        <StyledModalHeader $mobile>
          <StyledIconButton onClick={onClose} disabled={isLoading}>
            <RawFeatherIcon name="arrow-left" />
          </StyledIconButton>
          {selectedEvent ? (
            <Button
              color="secondary"
              small
              disabled={
                !selectedEvent || !content || content.trim() > 2000 || isLoading
              }
              onClick={handleSend}
            >
              Publier
            </Button>
          ) : null}
        </StyledModalHeader>
        <StyledModalBody>
          {selectedEvent ? (
            <MessageStep
              content={content}
              event={selectedEvent}
              user={user}
              onChange={handleChangeContent}
              onClearEvent={handleClearEvent}
              disabled={isLoading}
              maxLength={2000}
            />
          ) : (
            <EventStep
              events={events}
              onSelectEvent={handleSelectEvent}
              loadMoreEvents={loadMoreEvents}
            />
          )}
        </StyledModalBody>
        {selectedEvent ? (
          <StyledModalFooter>
            <Button
              color="secondary"
              disabled={
                !selectedEvent || !content || content.trim() > 2000 || isLoading
              }
              onClick={handleSend}
            >
              Publier le message
            </Button>
          </StyledModalFooter>
        ) : null}
      </StyledModalContent>
    </ModalWrapper>
  );
};
Modal.propTypes = {
  shouldShow: PropTypes.bool,
  onClose: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.object),
  selectedEvent: PropTypes.object,
  loadMoreEvents: PropTypes.func,
  message: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    linkedEvent: PropTypes.object,
  }),
  onSend: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};
export default Modal;
