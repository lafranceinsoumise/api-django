import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import MessageCard from "@agir/front/genericComponents/MessageCard";
import PageFadeIn from "@agir/front/genericComponents/PageFadeIn";
import Skeleton from "@agir/front/genericComponents/Skeleton";

import MessageModal from "@agir/front/formComponents/MessageModal/Modal";

const StyledMessages = styled(PageFadeIn)`
  margin-top: 1rem;
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
    messageURLBase,
    onClick,
    updateMessage,
    createComment,
    reportMessage,
    deleteMessage,
    loadMoreEvents,
  } = props;

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
      {updateMessage ? (
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
      <StyledMessages
        ready={!!message}
        wait={<Skeleton style={{ margin: "1rem 0" }} />}
      >
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
            messageURL={
              messageURLBase ? messageURLBase.replace(":id", message.id) : ""
            }
            withMobileCommentField
          />
        )}
      </StyledMessages>
    </StyledWrapper>
  );
};
GroupMessages.propTypes = {
  user: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.object),
  message: PropTypes.object,
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
