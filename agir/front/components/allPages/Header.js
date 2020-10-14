import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FeatherIcon from "../genericComponents/FeatherIcon";
import Button from "../genericComponents/Button";

import style from "../genericComponents/style.scss";
import LogoFI from "../genericComponents/LogoFI";

const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  z-index: 10;

  width: 100%;
  padding: 0.75rem 2rem;

  background-color: #fff;
  box-shadow: 0px 0px 3px rgba(0, 35, 44, 0.1),
    0px 3px 2px rgba(0, 35, 44, 0.05);
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;

  max-width: 1400px;
  margin: 0 auto;

  .large-only {
    @media only screen and (max-width: 900px) {
      display: none;
    }
  }

  .small-only {
    @media only screen and (min-width: 901px) {
      display: none;
    }
  }

  .grow {
    flex-grow: 1;
  }

  .justify {
    justify-content: center;
  }
`;

const HorizontalFlex = styled.div`
  display: flex;
  align-items: center;

  * + * {
    margin-left: 1.25em;
  }
`;

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  color: ${style.brandBlack};
  font-weight: 500;
  height: 3rem;

  * + * {
    margin-left: 0.5em;
  }

  :hover {
    text-decoration: none;
    color: ${style.brandBlack};
  }

  :hover > * {
    text-decoration: underline;
  }
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 450px;
`;

const SearchBarIndicator = styled.div`
  position: absolute;
  left: 1rem;
  top: 0.75rem;
`;

const SearchBarButton = styled.button.attrs(() => ({ type: "submit" }))`
  border: 0;
  background: none;
  position: absolute;
  right: 1em;
  top: 0.75rem;
  display: none;

  input:focus + & {
    display: block;
  }
`;

const SearchBarInput = styled.input.attrs(() => ({ type: "text", name: "q" }))`
  width: 100%;
  height: 3rem;
  margin: 0;
  padding: 0 3.5rem;

  border-radius: 3px;
  background-color: ${style.grayLighter};
  color: ${style.brandBlack};
  border: 1px solid ${style.grayLighter};

  &::placeholder {
    color: ${style.gray};
  }
  &:focus {
    background: #fff;
    border: 1px solid ${style.gray};
  }
`;

const ConnectionInfo = ({ loggedAs, profileUrl, signInUrl, logInUrl }) =>
  loggedAs === undefined || loggedAs === "" ? (
    <>
      <MenuLink href={logInUrl}>
        <FeatherIcon name="user" />
        <span className="large-only">Connexion</span>
      </MenuLink>
      <Button color="secondary" href={signInUrl} className="large-only">
        Créer mon compte
      </Button>
    </>
  ) : (
    <MenuLink href={profileUrl}>
      <FeatherIcon name="user" />
      <span className="large-only">{loggedAs}</span>
    </MenuLink>
  );

ConnectionInfo.propTypes = {
  loggedAs: PropTypes.string,
  profileUrl: PropTypes.string,
  signInUrl: PropTypes.string,
  logInUrl: PropTypes.string,
};
ConnectionInfo.defaultProps = {
  profileUrl: "#",
  signInUrl: "#",
  logInUrl: "#",
};

const Header = ({
  loggedAs,
  dashboardUrl,
  searchUrl,
  helpUrl,
  profileUrl,
  signInUrl,
  logInUrl,
}) => {
  return (
    <HeaderBar>
      <HeaderContainer>
        <MenuLink href={searchUrl} className="small-only">
          <FeatherIcon name="search" />
        </MenuLink>

        <HorizontalFlex className="grow justify">
          <MenuLink href={dashboardUrl}>
            <LogoFI height="3rem" />
          </MenuLink>
          <form className="large-only grow" method="get" action={searchUrl}>
            <SearchBar>
              <SearchBarIndicator>
                <FeatherIcon
                  name="search"
                  color={style.gray}
                  alignOnText={false}
                />
              </SearchBarIndicator>
              <SearchBarInput placeholder="Rechercher un groupe ou un événement" />
              <SearchBarButton>
                <FeatherIcon
                  name="arrow-right"
                  color={style.gray}
                  alignOnText={false}
                />
              </SearchBarButton>
            </SearchBar>
          </form>
        </HorizontalFlex>
        <HorizontalFlex>
          <MenuLink href={helpUrl} className="large-only">
            <FeatherIcon name="help-circle" />
            <span>Aide</span>
          </MenuLink>
          <ConnectionInfo
            profileUrl={profileUrl}
            signInUrl={signInUrl}
            logInUrl={logInUrl}
            loggedAs={loggedAs}
          />
        </HorizontalFlex>
      </HeaderContainer>
    </HeaderBar>
  );
};
Header.propTypes = {
  loggedAs: PropTypes.string,
  dashboardUrl: PropTypes.string,
  searchUrl: PropTypes.string,
  helpUrl: PropTypes.string,
  profileUrl: PropTypes.string,
  signInUrl: PropTypes.string,
  logInUrl: PropTypes.string,
};
Header.defaultProps = {
  dashboardUrl: "#",
  searchUrl: "#",
  helpUrl: "#",
  profileUrl: "#",
  signInUrl: "#",
  logInUrl: "#",
};

export default Header;
