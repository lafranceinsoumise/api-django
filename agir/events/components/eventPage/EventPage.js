import React from "react";
import PropTypes from "prop-types";
import EventHeader from "./EventHeader";
import EventLocationCard from "./EventLocationCard";
import EventFacebookLinkCard from "./EventFacebookLinkCard";
import EventDescription from "./EventDescription";
import { DateTime } from "luxon";
import {
  Column,
  Container,
  GrayBackground,
  ResponsiveLayout,
  Row,
} from "@agir/front/genericComponents/grid";
import ContactCard from "@agir/front/genericComponents/ContactCard";
import EventInfoCard from "@agir/events/eventPage/EventInfoCard";
import ShareCard from "@agir/front/genericComponents/ShareCard";
import Card from "@agir/front/genericComponents/Card";
import EventGroupCard from "@agir/events/eventPage/EventGroupCard";

const MobileLayout = (props) => {
  return (
    <Container>
      <Row>
        <Column>
          {props.illustration && (
            <div
              style={{
                margin: "0 -16px",
              }}
            >
              <img
                src={props.illustration}
                alt="Image d'illustration de l'événement postée par l'utilisateur"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          )}
          <Card>
            <EventHeader {...props} />
          </Card>
          <EventLocationCard {...props} />
          <EventInfoCard {...props} />
          <Card>
            <EventDescription {...props} />
          </Card>
          <ContactCard {...props} />
          <EventFacebookLinkCard {...props} />
          <ShareCard />
          {props.groups.length > 0 &&
            props.groups.map((group, key) => (
              <EventGroupCard key={key} {...group} />
            ))}
        </Column>
      </Row>
    </Container>
  );
};

const DesktopLayout = (props) => {
  return (
    <GrayBackground>
      <Container>
        <Row>
          <Column fill>
            <div style={{ margin: "0 -1000px" }}>
              <div
                style={{
                  padding: "60px 1000px",
                  backgroundColor: "#fff",
                  boxShadow: "0px 1px 0px rgba(0, 0, 0, 0.05)",
                }}
              >
                <EventHeader {...props} />
              </div>
            </div>
            <EventDescription {...props} />
            {props.groups.length > 0 &&
              props.groups.map((group, key) => (
                <EventGroupCard key={key} {...group} />
              ))}
          </Column>
          <Column width="380px" style={{ paddingTop: "24px" }}>
            <EventLocationCard {...props} />
            <ContactCard {...props} />
            <EventInfoCard {...props} />
            <EventFacebookLinkCard {...props} />
            <ShareCard />
          </Column>
        </Row>
      </Container>
    </GrayBackground>
  );
};

const EventPage = (props) => {
  props = {
    ...props,
    startTime: DateTime.fromISO(props.startTime).setLocale("fr"),
    endTime: DateTime.fromISO(props.endTime).setLocale("fr"),
  };

  return (
    <ResponsiveLayout
      desktop={<DesktopLayout {...props} />}
      mobile={<MobileLayout {...props} />}
    />
  );
};

EventPage.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  compteRendu: PropTypes.string,
  compteRenduPhotos: PropTypes.arrayOf(PropTypes.string),
  illustration: PropTypes.string,
  description: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  location: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
  }),
  contact: PropTypes.objectOf(PropTypes.string),
  groups: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  routes: PropTypes.shape({
    page: PropTypes.string,
    map: PropTypes.string,
    join: PropTypes.string,
    cancel: PropTypes.string,
    manage: PropTypes.string,
    calendarExport: PropTypes.string,
    googleExport: PropTypes.string,
    outlookExport: PropTypes.string,
    facebook: PropTypes.string,
  }),
};

MobileLayout.propTypes = EventPage.propTypes;
DesktopLayout.propTypes = EventPage.propTypes;

export default EventPage;
