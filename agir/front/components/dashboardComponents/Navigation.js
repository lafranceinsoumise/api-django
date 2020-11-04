import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import FeatherIcon, {
  RawFeatherIcon,
} from "@agir/front/genericComponents/FeatherIcon";
import style from "@agir/front/genericComponents/_variables.scss";
import { useGlobalContext } from "@agir/front/genericComponents/GobalContext";

const BottomBar = styled.nav`
  @media only screen and (max-width: ${style.collapse}px) {
    background-color: ${style.white};
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    box-shadow: inset 0px 1px 0px #eeeeee;
    height: 72px;
    padding: 0 7%;
  }
`;

const Menu = styled.ul`
  @media only screen and (max-width: ${style.collapse}px) {
    padding: 0;
    max-width: 600px;
    margin: auto;
    display: flex;
    justify-content: space-between;
  }
`;

const MenuItem = styled.li`
  @media only screen and (max-width: ${style.collapse}px) {
    width: 70px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 11px;

    & ${RawFeatherIcon} {
      display: block;
    }
    ${(props) =>
      props.active &&
      `
    border-top: 2px solid ${style.primary500};
    `}
  }

  @media only screen and (min-width: ${style.collapse}px) {
    margin-bottom: 1.5rem;
    & ${RawFeatherIcon} {
      color: ${(props) => (props.active ? style.primary500 : style.black500)};
      margin-right: 1rem;
    }
  }

  font-size: 16px;
  font-weight: 600;

  display: block;
  position: relative;

  & a {
    color: inherit;
    text-decoration: none;
  }

  ${(props) =>
    props.active &&
    `
    color: ${style.primary500};
    `}
`;

const Counter = styled.span`
  text-align: center;
  position: absolute;
  background-color: ${style.secondary500};
  color: #fff;
  font-size: 9px;
  height: 16px;
  width: 16px;
  border-radius: 8px;
  z-index: 1000;
  line-height: 14px;

  @media only screen and (max-width: ${style.collapse}px) {
    top: 11px;
    right: 16px;
  }

  @media only screen and (min-width: ${style.collapse}px) {
    top: 0px;
    left: 14px;
  }
`;

const MenuLink = ({ href, icon, title, active, counter }) => (
  <MenuItem active={active}>
    <a href={href}>
      {counter > 0 && <Counter>{counter}</Counter>}
      <FeatherIcon name={icon} inline />
      <span>{title}</span>
    </a>
  </MenuItem>
);

const Navigation = ({ active, routes }) => {
  const { requiredActionActivities = [] } = useGlobalContext();
  return (
    <BottomBar>
      <Menu>
        <MenuLink
          active={active === "events"}
          icon="calendar"
          title="Évènements"
          href={routes.events}
        />
        <MenuLink
          active={active === "groups"}
          icon="users"
          title="Groupes"
          href={routes.groups}
        />
        <MenuLink
          active={active === "activity"}
          icon="bell"
          title="Notifications"
          href={routes.activity}
          counter={requiredActionActivities.length}
        />
        <MenuLink
          active={active === "menu"}
          icon="menu"
          title="Plus"
          href={routes.menu}
        />
      </Menu>
    </BottomBar>
  );
};

export default Navigation;

Navigation.propTypes = {
  active: PropTypes.oneOf(["events", "groups", "activity", "menu"]),
  routes: PropTypes.shape({
    events: PropTypes.string.isRequired,
    groups: PropTypes.string.isRequired,
    activity: PropTypes.string.isRequired,
    menu: PropTypes.string.isRequired,
  }),
};
