import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import MessageCard from "@agir/front/genericComponents/MessageCard";
import PageFadeIn from "@agir/front/genericComponents/PageFadeIn";
import Skeleton from "@agir/front/genericComponents/Skeleton";

import MessageModal from "@agir/front/formComponents/MessageModal/Modal";

const StyledMessage = styled.div`
  margin-top: 1rem;

  @media (max-width: ${style.collapse}px) {
    min-height: 100vh;
  }
`;
const StyledWrapper = styled.div`
  @media (max-width: ${style.collapse}px) {
    padding-bottom: 2.5rem;
  }
`;

const GroupMessages = (props) => {
  const {
    user,
    message,
    events,
    isLoading,
    getMessageURL,
    onClick,
    updateMessage,
    createComment,
    reportMessage,
    deleteMessage,
    loadMoreEvents,
  } = props;

  const messageURL = useMemo(
    () => getMessageURL && message && message.id && getMessageURL(message.id),
    [getMessageURL, message]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const editMessage = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    setIsModalOpen(false);
  }, [message]);

  return (
    <StyledWrapper>
      {message && updateMessage ? (
        <MessageModal
          shouldShow={isModalOpen}
          onClose={handleModalClose}
          user={user}
          events={events}
          loadMoreEvents={loadMoreEvents}
          isLoading={isLoading}
          message={isModalOpen ? message : null}
          onSend={updateMessage}
        />
      ) : null}
      <PageFadeIn
        ready={message !== undefined}
        wait={<Skeleton style={{ margin: "1rem 0" }} />}
      >
        <StyledMessage>
          {message && (
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
              messageURL={messageURL}
              withMobileCommentField
              scrollIn
            />
          )}
        </StyledMessage>
      </PageFadeIn>
    </StyledWrapper>
  );
};
GroupMessages.propTypes = {
  user: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.object),
  message: PropTypes.object,
  isLoading: PropTypes.bool,
  getMessageURL: PropTypes.func,
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
