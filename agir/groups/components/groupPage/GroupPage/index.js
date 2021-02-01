import PropTypes from "prop-types";
import React, { useEffect } from "react";

import GroupPageComponent from "./GroupPage";

import {
  useDispatch,
  useSelector,
} from "@agir/front/globalContext/GlobalContext";
import {
  setIs2022,
  setTopBarRightLink,
} from "@agir/front/globalContext/actions";
import {
  getIsSessionLoaded,
  getIsConnected,
  getBackLink,
  getUser,
} from "@agir/front/globalContext/reducers";

import { useGroupDetail } from "./hooks";

const GroupPage = (props) => {
  const { groupPk, messagePk } = props;

  const isSessionLoaded = useSelector(getIsSessionLoaded);
  const isConnected = useSelector(getIsConnected);
  const backLink = useSelector(getBackLink);
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const {
    group,
    groupSuggestions,
    upcomingEvents,
    pastEvents,
    loadMorePastEvents,
    isLoadingPastEvents,
    pastEventReports,
    message,
    messages,
    loadMoreMessages,
    isLoadingMessages,
    createMessage,
    updateMessage,
    createComment,
    reportMessage,
    deleteMessage,
  } = useGroupDetail(groupPk, messagePk);

  const { is2022, isManager, routes } = group || {};

  useEffect(() => {
    is2022 === true && dispatch(setIs2022());
  }, [is2022, dispatch]);

  useEffect(() => {
    if (isManager && routes.settings) {
      dispatch(
        setTopBarRightLink({
          href: routes.settings,
          label: "Gestion du groupe",
        })
      );
    } else {
      dispatch(setTopBarRightLink(null));
    }
  }, [isManager, routes, dispatch]);

  return (
    <GroupPageComponent
      backLink={backLink}
      isConnected={isSessionLoaded && isConnected}
      isLoading={!isSessionLoaded || !group}
      group={group}
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      isLoadingPastEvents={isLoadingPastEvents}
      loadMorePastEvents={loadMorePastEvents}
      pastEventReports={pastEventReports}
      message={message}
      messages={messages}
      isLoadingMessages={isLoadingMessages}
      loadMoreMessages={loadMoreMessages}
      createMessage={createMessage}
      updateMessage={updateMessage}
      createComment={createComment}
      reportMessage={reportMessage}
      deleteMessage={deleteMessage}
      groupSuggestions={Array.isArray(groupSuggestions) ? groupSuggestions : []}
      user={user}
    />
  );
};
GroupPage.propTypes = {
  groupPk: PropTypes.string,
  messagePk: PropTypes.string,
};
export default GroupPage;
