import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import { useTabs } from "./hooks";

import { Column, Container, Row } from "@agir/front/genericComponents/grid";
import Skeleton from "@agir/front/genericComponents/Skeleton";
import Tabs from "@agir/front/genericComponents/Tabs";
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

export const MobileGroupPageSkeleton = () => (
  <Container style={{ margin: "2rem auto", padding: "0 1rem" }}>
    <Row>
      <Column stack>
        <Skeleton />
      </Column>
    </Row>
  </Container>
);

const Tab = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 0;
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

const MobileGroupPage = (props) => {
  const {
    group,
    groupSuggestions,
    upcomingEvents,
    pastEvents,
    isLoadingPastEvents,
    loadMorePastEvents,
    pastEventReports,
    messages,
    loadMoreMessages,
    createMessage,
    updateMessage,
    createComment,
    reportMessage,
    deleteMessage,
    isLoadingMessages,
    user,
  } = props;

  const tabProps = useTabs(props, true);

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
      <Tabs {...tabProps} stickyOffset={72}>
        {tabProps &&
          tabProps.tabs.map((tab) => {
            switch (tab.id) {
              case "messages":
                return (
                  <Tab key={tab.id}>
                    <GroupMessages
                      user={user}
                      events={[
                        ...(upcomingEvents || []),
                        ...(pastEvents || []),
                      ]}
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
                  </Tab>
                );
              case "agenda":
                return (
                  <Tab key={tab.id}>
                    <GroupEventList
                      title="Événements à venir"
                      events={upcomingEvents}
                    />
                    <GroupEventList
                      title="Événements passés"
                      events={pastEvents}
                      loadMore={loadMorePastEvents}
                      isLoading={isLoadingPastEvents}
                    />
                  </Tab>
                );
              case "reports":
                return (
                  <Tab key={tab.id}>
                    <GroupEventList
                      title="Comptes-rendus"
                      events={pastEventReports}
                    />
                  </Tab>
                );
              case "info":
                return (
                  <Tab key={tab.id}>
                    {Array.isArray(upcomingEvents) &&
                    upcomingEvents.length > 0 ? (
                      <Agenda>
                        <h3>Agenda</h3>
                        <GroupEventList
                          events={[upcomingEvents[0]]}
                          loadMore={tabProps.onNextTab}
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

                    {Array.isArray(groupSuggestions) &&
                    groupSuggestions.length > 0 ? (
                      <div style={{ marginTop: 71, marginBottom: 71 }}>
                        <GroupSuggestions groups={groupSuggestions} />
                      </div>
                    ) : null}
                  </Tab>
                );
            }
          })}
      </Tabs>
    </Container>
  );
};
MobileGroupPage.propTypes = {
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
  isLoadingPastEvents: PropTypes.bool,
  loadMorePastEvents: PropTypes.func,
  pastEventReports: PropTypes.arrayOf(PropTypes.object),
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
export default MobileGroupPage;
