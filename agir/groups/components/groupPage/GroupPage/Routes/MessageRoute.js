import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";

import { routeConfig } from "@agir/front/app/routes.config";

import GroupMessage from "@agir/groups/groupPage/GroupMessage";

const MessageRoute = ({
  group,
  user,
  allEvents,
  message,
  getMessageURL,
  isLoadingMessages,
  loadMorePastEvents,
  updateMessage,
  createComment,
  reportMessage,
  deleteMessage,
}) => {
  if (!group.isMember) {
    const redirectTo =
      group.id && routeConfig.unavailableGroupMessage
        ? routeConfig.unavailableGroupMessage.getLink({ groupPk: group.id })
        : routeConfig.groups.getLink();

    return <Redirect to={redirectTo} />;
  }
  if (message === null) {
    const redirectTo =
      group.id && routeConfig.groupDetails
        ? routeConfig.groupDetails.getLink({ groupPk: group.id })
        : routeConfig.groups.getLink();

    return <Redirect to={redirectTo} />;
  }
  return (
    <GroupMessage
      group={group}
      user={user}
      events={allEvents}
      message={message}
      getMessageURL={getMessageURL}
      isLoading={isLoadingMessages}
      loadMoreEvents={loadMorePastEvents}
      updateMessage={updateMessage}
      createComment={createComment}
      reportMessage={reportMessage}
      deleteMessage={deleteMessage}
    />
  );
};
MessageRoute.propTypes = {
  group: PropTypes.object,
  allEvents: PropTypes.arrayOf(PropTypes.object),
  loadMorePastEvents: PropTypes.func,
  message: PropTypes.object,
  messages: PropTypes.arrayOf(PropTypes.object),
  isLoadingMessages: PropTypes.bool,
  loadMoreMessages: PropTypes.func,
  createMessage: PropTypes.func,
  updateMessage: PropTypes.func,
  createComment: PropTypes.func,
  reportMessage: PropTypes.func,
  deleteMessage: PropTypes.func,
  onClickMessage: PropTypes.func,
  user: PropTypes.object,
  getMessageURL: PropTypes.func,
};

export default MessageRoute;
