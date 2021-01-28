import { useCallback, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useSWR, { useSWRInfinite } from "swr";

import { RouteConfig } from "@agir/front/app/routes.config";
import logger from "@agir/lib/utils/logger";

import GROUP_PAGE_ROUTES from "./routes.config.js";

import MESSAGES from "./messages.json";

const log = logger(__filename);

export const useGroupDetail = (groupPk, messagePk) => {
  const { data: group } = useSWR(`/api/groupes/${groupPk}`);
  log.debug("Group data", group);

  const { data: groupSuggestions } = useSWR(
    `/api/groupes/${groupPk}/suggestions`
  );
  log.debug("Group suggestions", groupSuggestions);

  const { data: upcomingEvents } = useSWR(
    `/api/groupes/${groupPk}/evenements/a-venir`
  );
  log.debug("Group upcoming events", upcomingEvents);

  const { data: pastEventData, size, setSize, isValidating } = useSWRInfinite(
    (pageIndex) =>
      `/api/groupes/${groupPk}/evenements/passes?page=${
        pageIndex + 1
      }&page_size=3`
  );
  const pastEvents = useMemo(() => {
    let events = [];
    if (!Array.isArray(pastEventData)) {
      return events;
    }
    pastEventData.forEach(({ results }) => {
      if (Array.isArray(results)) {
        events = events.concat(results);
      }
    });
    return events;
  }, [pastEventData]);
  log.debug("Group past events", pastEvents);
  const pastEventCount = useMemo(() => {
    if (!Array.isArray(pastEventData) || !pastEventData[0]) {
      return 0;
    }
    return pastEventData[0].count;
  }, [pastEventData]);
  const loadMorePastEvents = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);
  const isLoadingPastEvents = !pastEventData || isValidating;

  const { data: pastEventReports } = useSWR(
    `/api/groupes/${groupPk}/evenements/compte-rendus`
  );
  log.debug("Group past event reports", pastEventReports);

  const messages = MESSAGES;
  const message = messagePk ? MESSAGES.find((m) => m.id === messagePk) : null;

  const loadMoreMessages = console.log;
  const createMessage = console.log;
  const updateMessage = console.log;
  const createComment = console.log;
  const reportMessage = console.log;
  const deleteMessage = console.log;
  const isLoadingMessages = false;

  return {
    group: group,
    groupSuggestions,
    upcomingEvents,
    pastEvents,
    pastEventCount,
    loadMorePastEvents:
      pastEventCount > pastEvents.length ? loadMorePastEvents : undefined,
    isLoadingPastEvents,
    pastEventReports,
    messages: [],
    message,
    loadMoreMessages,
    createMessage,
    updateMessage,
    createComment,
    reportMessage,
    deleteMessage,
    isLoadingMessages,
  };
};

export const useTabs = (props, isMobile = true) => {
  const history = useHistory();
  const location = useLocation();
  const routes = useMemo(
    () =>
      GROUP_PAGE_ROUTES.filter((route) =>
        typeof route.hasRoute === "function"
          ? route.hasRoute(props, isMobile)
          : route.hasRoute
      ).map(
        (route) =>
          new RouteConfig({
            ...route,
            params: { groupPk: props.group.id },
          })
      ),
    [props, isMobile]
  );

  const { activeTab, activeTabIndex, shouldRedirect } = useMemo(() => {
    const result = {
      activeTab: routes[0],
      activeTabIndex: 0,
      shouldRedirect: true,
    };
    routes.forEach((route, i) => {
      if (route.match(location.pathname)) {
        result.activeTab = route;
        result.activeTabIndex = i;
        result.shouldRedirect = false;
      }
    });
    return result;
  }, [routes, location.pathname]);

  const handleTabChange = useCallback(
    (route, params) => {
      route && route.getLink && history.push(route.getLink(params));
    },
    [history]
  );

  const handleNextTab = useCallback(() => {
    const nextIndex = Math.min(activeTabIndex + 1, routes.length - 1);
    handleTabChange(routes[nextIndex]);
  }, [handleTabChange, activeTabIndex, routes]);

  const handlePrevTab = useCallback(() => {
    const prevIndex = Math.max(0, activeTabIndex - 1);
    handleTabChange(routes[prevIndex]);
  }, [handleTabChange, activeTabIndex, routes]);

  useEffect(() => {
    shouldRedirect && handleTabChange(activeTab);
  }, [shouldRedirect, handleTabChange, activeTab]);

  useMemo(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [location.pathname]);

  return {
    tabs: routes,
    activeTabIndex,
    hasTabs: routes.length > 1,
    onTabChange: handleTabChange,
    onNextTab: handleNextTab,
    onPrevTab: handlePrevTab,
  };
};
