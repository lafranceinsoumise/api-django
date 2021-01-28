const routeConfig = {
  info: {
    id: "info",
    pathname: "/groupes/:groupPk/presentation/",
    label: "Présentation",
    hasRoute: (_, isMobile) => !!isMobile,
  },
  messages: {
    id: "messages",
    pathname: "/groupes/:groupPk/discussion/:messagePk?/",
    label: "Discussion",
    hasRoute: ({ group, messages }) => {
      if (group.isManager) {
        return true;
      }
      return group.isMember && Array.isArray(messages) && messages.length > 0;
    },
  },
  agenda: {
    id: "agenda",
    pathname: "/groupes/:groupPk/agenda/",
    label: "Agenda",
    hasRoute: ({ group, pastEvents, upcomingEvents }, isMobile) => {
      if (group.isMember || !isMobile) {
        return true;
      }
      pastEvents = Array.isArray(pastEvents) ? pastEvents : [];
      upcomingEvents = Array.isArray(upcomingEvents) ? upcomingEvents : [];
      return pastEvents.length + upcomingEvents.length > 0;
    },
  },
  reports: {
    id: "reports",
    pathname: "/groupes/:groupPk/comptes-rendus/",
    label: "Comptes-rendus",
    hasRoute: ({ group, pastEventReports }) => {
      if (group.isManager) {
        return true;
      }
      return (
        group.isMember &&
        Array.isArray(pastEventReports) &&
        pastEventReports.length > 0
      );
    },
  },
};

const routes = Object.values(routeConfig);

export default routes;
