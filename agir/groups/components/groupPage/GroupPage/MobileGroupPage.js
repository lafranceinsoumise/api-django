import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Switch, Route } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import { useTabs } from "./hooks";

import { Column, Container, Row } from "@agir/front/genericComponents/grid";
import Skeleton from "@agir/front/genericComponents/Skeleton";
import ShareCard from "@agir/front/genericComponents/ShareCard";

import GroupBanner from "../GroupBanner";

import GroupLocation from "../GroupLocation";
import GroupUserActions from "../GroupUserActions";
import GroupContactCard from "../GroupContactCard";
import GroupDescription from "../GroupDescription";
import GroupLinks from "../GroupLinks";
import GroupFacts from "../GroupFacts";
import GroupDonation from "../GroupDonation";
import GroupSuggestions from "../GroupSuggestions";
import GroupEventList from "../GroupEventList";
import GroupMessages from "../GroupMessages";
import GroupMessage from "../GroupMessage";
import GroupPageMenu from "../GroupPageMenu";
import {
  MemberEmptyEvents,
  ManagerEmptyEvents,
  EmptyReports,
} from "../EmptyContent";

export const MobileGroupPageSkeleton = () => (
  <Container style={{ margin: "2rem auto", padding: "0 1rem" }}>
    <Row>
      <Column stack>
        <Skeleton />
      </Column>
    </Row>
  </Container>
);

const StyledTab = styled(animated.div)`
  max-width: 100%;
  margin: 0;
  padding: 0;
  scroll-margin-top: 160px;

  @media (max-width: ${style.collapse}px) {
    scroll-margin-top: 120px;
    min-height: 100vh;
  }
`;

const Agenda = styled.div`
  margin: 0;
  padding: 1.5rem 1rem;
  height: 316px;
  background: ${style.black25};

  & > h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
`;

const Tab = (props) => {
  const { onNextTab, onPrevTab, children } = props;
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));
  const bind = useDrag(
    ({ args: [limit], down, movement: [x] }) => {
      if (down) {
        const newX =
          x > 0 ? Math.min(Math.abs(limit), x) : Math.max(-Math.abs(limit), x);
        set({ xy: [newX, 0] });
        return;
      }
      set({ xy: [0, 0] });
      if (Math.abs(x) > Math.abs(limit)) {
        x <= 0 ? onNextTab && onNextTab() : onPrevTab && onPrevTab();
      }
    },
    { axis: "x", lockDirection: true }
  );
  const tabRef = useRef();

  useEffect(() => {
    tabRef.current & tabRef.current.scrollIntoView();
  }, []);

  return (
    <StyledTab
      {...bind(50)}
      style={{
        transform:
          xy && xy.interpolate((x) => (x ? `translate3d(${x}px, 0px, 0)` : "")),
      }}
      ref={tabRef}
    >
      {children}
    </StyledTab>
  );
};
Tab.propTypes = {
  onNextTab: PropTypes.func,
  onPrevTab: PropTypes.func,
  children: PropTypes.node,
};

const MessagesRoute = ({
  user,
  allEvents,
  message,
  messages,
  basePath,
  isLoadingMessages,
  loadMoreMessages,
  loadMorePastEvents,
  createMessage,
  updateMessage,
  createComment,
  reportMessage,
  deleteMessage,
  onClickMessage,
  getMessageURL,
}) => (
  <Switch>
    <Route path={basePath} exact>
      <GroupMessages
        user={user}
        events={allEvents}
        messages={messages}
        isLoading={isLoadingMessages}
        onClick={onClickMessage}
        loadMoreMessages={loadMoreMessages}
        loadMoreEvents={loadMorePastEvents}
        getMessageURL={getMessageURL}
        createMessage={createMessage}
        updateMessage={updateMessage}
        createComment={createComment}
        reportMessage={reportMessage}
        deleteMessage={deleteMessage}
      />
    </Route>
    <Route path={basePath + ":messagePk"} exact>
      <GroupMessage
        user={user}
        events={allEvents}
        message={message}
        isLoading={isLoadingMessages}
        getMessageURL={getMessageURL}
        loadMoreEvents={loadMorePastEvents}
        updateMessage={updateMessage}
        createComment={createComment}
        reportMessage={reportMessage}
        deleteMessage={deleteMessage}
      />
    </Route>
  </Switch>
);
MessagesRoute.propTypes = {
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
  basePath: PropTypes.string,
  getMessageURL: PropTypes.func,
};

const AgendaRoute = ({
  group,
  allEvents,
  upcomingEvents,
  pastEvents,
  loadMorePastEvents,
  isLoadingPastEvents,
  hasTabs,
}) => (
  <>
    {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
      <GroupEventList title="Événements à venir" events={upcomingEvents} />
    ) : null}
    {Array.isArray(pastEvents) && pastEvents.length > 0 ? (
      <GroupEventList
        title="Événements passés"
        events={pastEvents}
        loadMore={loadMorePastEvents}
        isLoading={isLoadingPastEvents}
      />
    ) : null}
    {allEvents.length === 0 && hasTabs && group.isManager ? (
      <ManagerEmptyEvents />
    ) : null}
    {allEvents.length === 0 && hasTabs && !group.isManager && group.isMember ? (
      <MemberEmptyEvents />
    ) : null}
  </>
);
AgendaRoute.propTypes = {
  group: PropTypes.object,
  allEvents: PropTypes.arrayOf(PropTypes.object),
  upcomingEvents: PropTypes.arrayOf(PropTypes.object),
  pastEvents: PropTypes.arrayOf(PropTypes.object),
  isLoadingPastEvents: PropTypes.bool,
  loadMorePastEvents: PropTypes.func,
  hasTabs: PropTypes.bool,
};
const ReportsRoute = ({ pastEventReports }) => (
  <>
    {Array.isArray(pastEventReports) && pastEventReports.length > 0 ? (
      <GroupEventList title="Comptes-rendus" events={pastEventReports} />
    ) : (
      <EmptyReports />
    )}
  </>
);
ReportsRoute.propTypes = {
  pastEventReports: PropTypes.arrayOf(PropTypes.object),
};
const InfoRoute = ({
  upcomingEvents,
  goToAgendaTab,
  group,
  groupSuggestions,
}) => (
  <>
    {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
      <Agenda>
        <h3>Agenda</h3>
        <GroupEventList
          events={[upcomingEvents[0]]}
          loadMore={goToAgendaTab}
          loadMoreLabel="Voir tout l'agenda"
        />
      </Agenda>
    ) : null}

    <GroupContactCard {...group} />
    <GroupDescription {...group} />
    <GroupLinks {...group} />
    <GroupFacts {...group} />
    <GroupLocation {...group} />
    {group.routes && group.routes.donations && (
      <GroupDonation url={group.routes.donations} />
    )}
    <ShareCard title="Partager le lien du groupe" />

    {Array.isArray(groupSuggestions) && groupSuggestions.length > 0 ? (
      <div style={{ marginTop: 71, marginBottom: 71 }}>
        <GroupSuggestions groups={groupSuggestions} />
      </div>
    ) : null}
  </>
);
InfoRoute.propTypes = {
  group: PropTypes.shape({
    isMember: PropTypes.bool,
    isManager: PropTypes.bool,
    routes: PropTypes.shape({
      donations: PropTypes.string,
    }),
  }),
  upcomingEvents: PropTypes.arrayOf(PropTypes.object),
  groupSuggestions: PropTypes.arrayOf(PropTypes.object),
  goToAgendaTab: PropTypes.func,
};

const Routes = {
  messages: React.memo(MessagesRoute),
  agenda: React.memo(AgendaRoute),
  reports: React.memo(ReportsRoute),
  info: React.memo(InfoRoute),
};

const MobileGroupPage = (props) => {
  const { group, upcomingEvents, pastEvents } = props;
  const { hasTabs, tabs, onTabChange, onNextTab, onPrevTab } = useTabs(
    props,
    true
  );

  const goToAgendaTab = useMemo(() => {
    const agendaTab = tabs.find((tab) => tab.id === "agenda");
    if (agendaTab && onTabChange) {
      return () => onTabChange(agendaTab);
    }
  }, [tabs, onTabChange]);

  const allEvents = useMemo(
    () => [...(upcomingEvents || []), ...(pastEvents || [])],
    [upcomingEvents, pastEvents]
  );

  const handleClickMessage = useCallback(
    (message) => {
      const messagesTab = tabs.find((tab) => tab.id === "messages");
      if (messagesTab) {
        return (
          onTabChange && onTabChange(messagesTab, { messagePk: message.id })
        );
      }
    },
    [tabs, onTabChange]
  );

  const getMessageURL = useCallback(
    (messagePk) => {
      const messagesTab = tabs.find((tab) => tab.id === "messages");
      if (messagesTab) {
        return messagesTab.getLink({ messagePk });
      }
    },
    [tabs]
  );

  if (!group) {
    return null;
  }

  return (
    <Container
      style={{
        margin: 0,
        padding: "0 0 3.5rem",
      }}
    >
      <GroupBanner {...group} />
      <GroupUserActions {...group} />
      <GroupPageMenu tabs={tabs} hasTabs={hasTabs} stickyOffset={72} />
      <Switch>
        {tabs.map((tab) => {
          const R = Routes[tab.id];
          return (
            <Route key={tab.id} path={tab.pathname}>
              <Tab onNextTab={onNextTab} onPrevTab={onPrevTab}>
                <R
                  {...props}
                  allEvents={allEvents}
                  hasTabs={hasTabs}
                  goToAgendaTab={goToAgendaTab}
                  getMessageURL={getMessageURL}
                  onClickMessage={handleClickMessage}
                  basePath={tab.getLink()}
                />
              </Tab>
            </Route>
          );
        })}
      </Switch>
    </Container>
  );
};
MobileGroupPage.propTypes = {
  group: PropTypes.object,
  upcomingEvents: PropTypes.arrayOf(PropTypes.object),
  pastEvents: PropTypes.arrayOf(PropTypes.object),
};
export default MobileGroupPage;
