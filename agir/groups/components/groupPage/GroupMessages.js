import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import MessageCard from "@agir/front/genericComponents/MessageCard";
import PageFadeIn from "@agir/front/genericComponents/PageFadeIn";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import Skeleton from "@agir/front/genericComponents/Skeleton";

import MessageModalTrigger from "@agir/front/formComponents/MessageModal/Trigger";
import MessageModal from "@agir/front/formComponents/MessageModal/Modal";

const StyledButton = styled.div`
  text-align: center;

  @media (max-width: ${style.collapse}px) {
    box-shadow: ${style.elaborateShadow} inset;
  }

  ${Button} {
    width: auto;
    margin: 0 auto;
    justify-content: center;

    &,
    &:hover,
    &:focus,
    &:active {
      background-color: white;
    }

    @media (max-width: ${style.collapse}px) {
      width: 100%;
      margin-top: 1rem;
      font-size: 0.875rem;
      box-shadow: ${style.elaborateShadow};
    }
  }
`;
const StyledMessages = styled(PageFadeIn)`
  margin-top: 1rem;
`;
const StyledWrapper = styled.div`
  @media (max-width: ${style.collapse}px) {
    background-color: ${style.black50};
  }
`;

const GroupMessages = (props) => {
  const {
    user,
    messages,
    events,
    isLoading,
    messageURLBase,
    onClick,
    createMessage,
    updateMessage,
    createComment,
    reportMessage,
    deleteMessage,
    loadMoreEvents,
    loadMoreMessages,
  } = props;

  const [editedMessage, setEditedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const editMessage = useCallback((message) => {
    setEditedMessage(message);
    setIsModalOpen(true);
  }, []);

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditedMessage(null);
  }, []);

  useEffect(() => {
    handleModalClose();
  }, [handleModalClose, messages]);

  const saveMessage = useCallback(
    (message) => {
      if (message.id) {
        updateMessage && updateMessage(message);
      } else {
        createMessage && createMessage(message);
      }
    },
    [createMessage, updateMessage]
  );

  return (
    <StyledWrapper>
      <MessageModalTrigger user={user} onClick={handleModalOpen} />
      <MessageModal
        shouldShow={isModalOpen}
        onClose={handleModalClose}
        user={user}
        events={events}
        loadMoreEvents={loadMoreEvents}
        isLoading={isLoading}
        message={editedMessage}
        onSend={saveMessage}
      />
      <StyledMessages
        ready={Array.isArray(messages)}
        wait={<Skeleton style={{ margin: "1rem 0" }} />}
      >
        {Array.isArray(messages) &&
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              user={user}
              comments={message.comments}
              onClick={onClick}
              onEdit={updateMessage ? editMessage : undefined}
              onComment={createComment}
              onReport={reportMessage}
              onDelete={deleteMessage}
              messageURL={
                messageURLBase ? messageURLBase.replace(":id", message.id) : ""
              }
            />
          ))}
        {typeof loadMoreMessages === "function" ? (
          <StyledButton>
            <Button
              color="white"
              onClick={loadMoreMessages}
              disabled={isLoading}
            >
              Charger plus d'actualités&ensp;
              <RawFeatherIcon name="chevron-down" width="1em" strokeWidth={3} />
            </Button>
          </StyledButton>
        ) : null}
      </StyledMessages>
    </StyledWrapper>
  );
};
GroupMessages.propTypes = {
  user: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.object),
  messages: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  messageURLBase: PropTypes.string,
  onClick: PropTypes.func,
  createMessage: PropTypes.func,
  updateMessage: PropTypes.func,
  createComment: PropTypes.func,
  reportMessage: PropTypes.func,
  deleteMessage: PropTypes.func,
  loadMoreEvents: PropTypes.func,
  loadMoreMessages: PropTypes.func,
};
export default GroupMessages;
