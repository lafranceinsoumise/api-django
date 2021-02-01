const routeConfig = {
  info: {
    id: "info",
    pathname: "/groupes/:groupPk/presentation/",
    label: "Présentation",
    hasTab: true,
    hasRoute: (_, isMobile) => !!isMobile,
  },
  messages: {
    id: "messages",
    pathname: "/groupes/:groupPk/discussion/",
    label: "Discussion",
    hasTab: true,
    hasRoute: (group) =>
      group.isManager || (group.isMember && group.hasMessages),
  },
  message: {
    id: "message",
    pathname: "/groupes/:groupPk/discussion/:messagePk/",
    label: "Message",
    hasTab: false,
    hasRoute: true,
  },
  agenda: {
    id: "agenda",
    pathname: "/groupes/:groupPk/agenda/",
    label: "Agenda",
    hasTab: true,
    hasRoute: (group, isMobile) =>
      !isMobile ||
      group.isMember ||
      group.hasUpcomingEvents ||
      group.hasPastEvents,
  },
  reports: {
    id: "reports",
    pathname: "/groupes/:groupPk/comptes-rendus/",
    label: "Comptes-rendus",
    hasTab: true,
    hasRoute: (group) =>
      group.isManager || (group.isMember && group.hasPastEventReports),
  },
};

const routes = Object.values(routeConfig);

export default routes;
