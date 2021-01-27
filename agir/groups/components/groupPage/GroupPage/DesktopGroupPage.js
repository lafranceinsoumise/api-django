import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import { useTabs } from "./hooks";

import Link from "@agir/front/app/Link";
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
import GroupPageMenu from "../GroupPageMenu";

const IndexLinkAnchor = styled(Link)`
  font-weight: 600;
  font-size: 12px;
  line-height: 1.4;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  margin: 20px 0;

  &,
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
    color: #585858;
  }

  span {
    transform: rotate(180deg) translateY(-1.5px);
    transform-origin: center center;
  }

  @media (max-width: ${style.collapse}px) {
    padding: 0.5rem 1.375rem 0;
    margin-bottom: -1rem;
  }
`;

export const DesktopGroupPageSkeleton = () => (
  <Container
    style={{
      margin: "4rem auto",
      padding: "0 4rem",
      background: "white",
    }}
  >
    <Row gutter={32} style={{ marginBottom: "3.5rem" }}>
      <Column grow>
        <Skeleton boxes={1} />
      </Column>
    </Row>
    <Row gutter={32}>
      <Column grow>
        <Skeleton />
      </Column>
      <Column width="460px">
        <Skeleton />
      </Column>
    </Row>
    <Row gutter={32}>
      <Column grow>
        <Skeleton boxes={1} />
      </Column>
    </Row>
  </Container>
);

const MessagesRoute = ({
  user,
  allEvents,
  messages,
  isLoadingMessages,
  loadMoreMessages,
  loadMorePastEvents,
  createMessage,
  updateMessage,
  createComment,
  reportMessage,
  deleteMessage,
}) =>
  Array.isArray(messages) && messages.length > 0 ? (
    <GroupMessages
      user={user}
      events={allEvents}
      messages={messages}
      isLoading={isLoadingMessages}
      loadMoreMessages={loadMoreMessages}
      loadMoreEvents={loadMorePastEvents}
      createMessage={createMessage}
      updateMessage={updateMessage}
      createComment={createComment}
      reportMessage={reportMessage}
      deleteMessage={deleteMessage}
    />
  ) : (
    "Pas de messages!"
  );
MessagesRoute.propTypes = {
  allEvents: PropTypes.arrayOf(PropTypes.object),
  loadMorePastEvents: PropTypes.func,
  messages: PropTypes.arrayOf(PropTypes.object),
  isLoadingMessages: PropTypes.bool,
  loadMoreMessages: PropTypes.func,
  createMessage: PropTypes.func,
  updateMessage: PropTypes.func,
  createComment: PropTypes.func,
  reportMessage: PropTypes.func,
  deleteMessage: PropTypes.func,
  user: PropTypes.object,
};
const AgendaRoute = ({
  group,
  allEvents,
  upcomingEvents,
  pastEvents,
  loadMorePastEvents,
  isLoadingPastEvents,
  hasTabs,
}) =>
  allEvents.length > 0 ? (
    <>
      <GroupEventList title="Événements à venir" events={upcomingEvents} />
      <GroupEventList
        title="Événements passés"
        events={pastEvents}
        loadMore={loadMorePastEvents}
        isLoading={isLoadingPastEvents}
      />
      <GroupLocation {...group} />
      <ShareCard title="Partager le lien du groupe" />
    </>
  ) : (
    <>
      {hasTabs ? "Pas d'événements" : null}
      <GroupDescription {...group} maxHeight="auto" />
      <ShareCard title="Inviter vos ami·es à rejoindre le groupe" />
      <GroupLocation {...group} />
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
const ReportsRoute = ({ pastEventReports }) =>
  Array.isArray(pastEventReports) && pastEventReports.length > 0 ? (
    <GroupEventList title="Comptes-rendus" events={pastEventReports} />
  ) : (
    "Pas de comptes-rendus"
  );
ReportsRoute.propTypes = {
  pastEventReports: PropTypes.arrayOf(PropTypes.object),
};

const Routes = {
  messages: React.memo(MessagesRoute),
  agenda: React.memo(AgendaRoute),
  reports: React.memo(ReportsRoute),
};

const DesktopGroupPage = (props) => {
  const {
    backLink,
    group,
    groupSuggestions,
    upcomingEvents,
    pastEvents,
  } = props;

  const { hasTabs, tabs, activeTabIndex } = useTabs(props, false);

  const allEvents = useMemo(
    () => [...(upcomingEvents || []), ...(pastEvents || [])],
    [upcomingEvents, pastEvents]
  );

  if (!group) {
    return null;
  }

  return (
    <Container
      style={{
        margin: "4rem auto",
        padding: "0 4rem",
        background: "white",
      }}
    >
      {!!backLink && (
        <Row gutter={32}>
          <Column grow>
            <IndexLinkAnchor
              to={backLink.to}
              href={backLink.href}
              route={backLink.route}
            >
              <span>&#10140;</span>
              &ensp; {backLink.label || "Retour à l'accueil"}
            </IndexLinkAnchor>
          </Column>
        </Row>
      )}
      <Row gutter={32}>
        <Column grow>
          <GroupBanner {...group} />
        </Column>
      </Row>

      <GroupPageMenu tabs={tabs} hasTabs={hasTabs} stickyOffset={72} />

      <Row
        gutter={32}
        style={{
          marginTop: "3.5rem",
          flexDirection: activeTabIndex === 0 ? "row" : "row-reverse",
        }}
      >
        <Switch>
          {tabs.map((tab) => {
            const R = Routes[tab.id];
            return (
              <Route key={tab.id} path={tab.pathname}>
                <Column grow>
                  <R
                    {...props}
                    allEvents={allEvents}
                    hasTabs={hasTabs}
                    messageURLBase={messageURLBase}
                  />
                </Column>
              </Route>
            );
          })}
        </Switch>

        <Column width="460px">
          <GroupUserActions {...group} />
          <GroupContactCard {...group} />
          {allEvents.length > 0 ? <GroupDescription {...group} /> : null}
          <GroupLinks {...group} />
          <GroupFacts {...group} />
          {group.routes && group.routes.donations && (
            <GroupDonation url={group.routes.donations} />
          )}
        </Column>
      </Row>

      <Row gutter={32}>
        <Column grow>
          {Array.isArray(groupSuggestions) && groupSuggestions.length > 0 ? (
            <GroupSuggestions groups={groupSuggestions} />
          ) : null}
        </Column>
      </Row>
    </Container>
  );
};
DesktopGroupPage.propTypes = {
  backLink: PropTypes.object,
  group: PropTypes.shape({
    isMember: PropTypes.bool,
    isManager: PropTypes.bool,
    routes: PropTypes.shape({
      donations: PropTypes.string,
    }),
  }),
  groupSuggestions: PropTypes.arrayOf(PropTypes.object),
  upcomingEvents: PropTypes.arrayOf(PropTypes.object),
  pastEvents: PropTypes.arrayOf(PropTypes.object),
};

export default DesktopGroupPage;
