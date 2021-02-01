import { useCallback, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useSWR, { useSWRInfinite } from "swr";

import { RouteConfig } from "@agir/front/app/routes.config";
import logger from "@agir/lib/utils/logger";

import GROUP_PAGE_ROUTES from "./routes.config.js";

import MESSAGES from "./messages.json";

const log = logger(__filename);

export const useUpcomingEvents = (group) => {
  const hasUpcomingEvents = group && group.hasUpcomingEvents;
  const { data } = useSWR(
    hasUpcomingEvents ? `/api/groupes/${group.id}/evenements/a-venir` : null
  );
  log.debug("Group upcoming events", data);
  return group && group.hasUpcomingEvents ? data : [];
};

export const usePastEvents = (group) => {
  const hasPastEvents = group && group.hasPastEvents;
  const {
    data,
    size: pastEventsSize,
    setSize: setPastEventsSize,
    isValidating: isValidatingPastEvents,
  } = useSWRInfinite((pageIndex) =>
    hasPastEvents
      ? `/api/groupes/${group.id}/evenements/passes?page=${
          pageIndex + 1
        }&page_size=3`
      : null
  );
  const pastEvents = useMemo(() => {
    let events = [];
    if (!hasPastEvents) {
      return events;
    }
    if (!Array.isArray(data)) {
      return events;
    }
    data.forEach(({ results }) => {
      if (Array.isArray(results)) {
        events = events.concat(results);
      }
    });
    return events;
  }, [hasPastEvents, data]);
  log.debug("Group past events", pastEvents);

  const pastEventCount = useMemo(() => {
    if (!hasPastEvents || !Array.isArray(data) || !data[0]) {
      return 0;
    }
    return data[0].count;
  }, [hasPastEvents, data]);

  const loadMorePastEvents = useCallback(() => {
    setPastEventsSize(pastEventsSize + 1);
  }, [setPastEventsSize, pastEventsSize]);

  const isLoadingPastEvents =
    hasPastEvents && (!data || isValidatingPastEvents);

  return {
    pastEvents,
    pastEventCount,
    loadMorePastEvents:
      hasPastEvents && pastEvents && pastEventCount > pastEvents.length
        ? loadMorePastEvents
        : undefined,
    isLoadingPastEvents,
  };
};

const usePastEventReports = (group) => {
  const hasPastEventReports =
    group && group.isMember && group.hasPastEventReports;
  const { data } = useSWR(
    hasPastEventReports
      ? `/api/groupes/${group.id}/evenements/compte-rendus`
      : null
  );
  log.debug("Group past event reports", data);

  return hasPastEventReports ? data : [];
};

const useMessages = (group) => {
  const hasMessages = group && group.isMember && group.hasMessages;
  const {
    data: messagesData,
    size: messagesSize,
    setSize: setMessagesSize,
    isValidating: isValidatingMessages,
  } = useSWRInfinite(
    (pageIndex) =>
      hasMessages
        ? `/api/groupes/${group.id}/messages?page=${pageIndex + 1}&page_size=3`
        : null,
    // TEMP: custom fetcher to return fake data
    async (url) =>
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            url ? { count: MESSAGES.length * 2, results: MESSAGES } : undefined
          );
        }, 3000);
      })
  );

  const messages = useMemo(() => {
    let messages = [];
    if (!hasMessages) {
      return messages;
    }
    if (!Array.isArray(messagesData)) {
      return messagesData;
    }
    messagesData.forEach(({ results }) => {
      if (Array.isArray(results)) {
        messages = messages.concat(results);
      }
    });
    return messages;
  }, [hasMessages, messagesData]);
  log.debug("Group messages", messages);

  const messagesCount = useMemo(() => {
    if (!hasMessages || !Array.isArray(messagesData) || !messagesData[0]) {
      return 0;
    }
    return messagesData[0].count;
  }, [hasMessages, messagesData]);
  const loadMoreMessages = useCallback(() => {
    setMessagesSize(messagesSize + 1);
  }, [setMessagesSize, messagesSize]);
  const isLoadingMessages =
    hasMessages && (!messagesData || isValidatingMessages);

  return {
    messages,
    loadMoreMessages:
      hasMessages && messages && messagesCount > messages.length
        ? loadMoreMessages
        : undefined,
    isLoadingMessages,
  };
};

const useMessage = (group, messagePk) => {
  const hasMessage = group && group.isMember && messagePk;
  const { data } = useSWR(
    hasMessage ? `/api/groupes/${group.id}/messages/${messagePk}` : null,
    // TEMP: custom fetcher to return fake data
    async (url) =>
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(url ? MESSAGES.find((m) => m.id === messagePk) : undefined);
        }, 3000);
      })
  );
  log.debug("Group message #" + messagePk, data);

  return hasMessage ? data : null;
};

export const useGroupDetail = (groupPk, messagePk) => {
  // GROUP DATA
  const { data: group } = useSWR(`/api/groupes/${groupPk}`);
  log.debug("Group data", group);

  // GROUP SUGGESTIONS
  const { data: groupSuggestions } = useSWR(
    `/api/groupes/${groupPk}/suggestions`
  );
  log.debug("Group suggestions", groupSuggestions);

  const upcomingEvents = useUpcomingEvents(group);
  const {
    pastEvents,
    pastEventCount,
    isLoadingPastEvents,
    loadMorePastEvents,
  } = usePastEvents(group);
  const pastEventReports = usePastEventReports(group);
  const { messages, isLoadingMessages, loadMoreMessages } = useMessages(group);
  const message = useMessage(group, messagePk);

  const createMessage = console.log;
  const updateMessage = console.log;
  const createComment = console.log;
  const reportMessage = console.log;
  const deleteMessage = console.log;

  return {
    group: group,
    groupSuggestions,
    upcomingEvents,
    pastEvents,
    pastEventCount,
    loadMorePastEvents,
    isLoadingPastEvents,
    pastEventReports,
    messages,
    message,
    loadMoreMessages,
    isLoadingMessages,
    createMessage,
    updateMessage,
    createComment,
    reportMessage,
    deleteMessage,
  };
};

export const useTabs = (props, isMobile = true) => {
  const history = useHistory();
  const location = useLocation();

  const { group } = props;

  const routes = useMemo(
    () =>
      GROUP_PAGE_ROUTES.filter((route) =>
        typeof route.hasRoute === "function"
          ? route.hasRoute(group, isMobile)
          : route.hasRoute
      ).map(
        (route) =>
          new RouteConfig({
            ...route,
            params: { groupPk: group.id },
          })
      ),
    [group, isMobile]
  );

  const tabs = useMemo(() => routes.filter((route) => route.hasTab), [routes]);

  const { activeRoute, shouldRedirect } = useMemo(() => {
    const result = {
      activeRoute: tabs[0],
      shouldRedirect: true,
    };
    routes.forEach((route) => {
      if (route.match(location.pathname)) {
        result.activeRoute = route;
        result.shouldRedirect = false;
      }
    });
    return result;
  }, [tabs, routes, location.pathname]);

  const activeTabIndex = useMemo(() => {
    for (let i = 0; tabs[i]; i++) {
      if (activeRoute === tabs[i]) {
        return i;
      }
    }
  }, [tabs, activeRoute]);

  const handleTabChange = useCallback(
    (route, params) => {
      route && route.getLink && history.push(route.getLink(params));
    },
    [history]
  );

  const handleNextTab = useCallback(() => {
    const nextIndex = Math.min(activeTabIndex + 1, tabs.length - 1);
    handleTabChange(tabs[nextIndex]);
  }, [handleTabChange, activeTabIndex, tabs]);

  const handlePrevTab = useCallback(() => {
    const prevIndex = Math.max(0, activeTabIndex - 1);
    handleTabChange(tabs[prevIndex]);
  }, [handleTabChange, activeTabIndex, tabs]);

  useEffect(() => {
    shouldRedirect && handleTabChange(activeRoute);
  }, [shouldRedirect, handleTabChange, activeRoute]);

  useMemo(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [location.pathname]);

  return {
    tabs: routes,
    activeTabIndex,
    hasTabs: tabs.length > 1,
    onTabChange: handleTabChange,
    onNextTab: handleNextTab,
    onPrevTab: handlePrevTab,
  };
};
