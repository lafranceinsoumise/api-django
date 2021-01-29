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
    hasRoute: (group) => {
      if (group.isManager) {
        return true;
      }
      return group.hasMessages && group.isMember;
    },
  },
  agenda: {
    id: "agenda",
    pathname: "/groupes/:groupPk/agenda/",
    label: "Agenda",
    hasRoute: (group, isMobile) => {
      if (group.isMember || !isMobile) {
        return true;
      }
      return group.hasUpcomingEvents || group.hasPastEvents;
    },
  },
  reports: {
    id: "reports",
    pathname: "/groupes/:groupPk/comptes-rendus/",
    label: "Comptes-rendus",
    hasRoute: (group) => {
      if (group.isManager) {
        return true;
      }
      return group.isMember && group.hasPastEventReports;
    },
  },
};

const routes = Object.values(routeConfig);

export default routes;
