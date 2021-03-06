import PropTypes from "prop-types";
import React from "react";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";
import SwiperCore, { A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import style from "@agir/front/genericComponents/_variables.scss";

import { ResponsiveLayout } from "@agir/front/genericComponents/grid";
import GroupSuggestionCard from "./GroupSuggestionCard";

SwiperCore.use([A11y]);

export const Carousel = styled(animated.div)``;
export const Block = styled(animated.div)``;
export const StyledWrapper = styled.div`
  & > * {
    margin-left: 1.5rem;
  }

  h4 {
    margin-bottom: 2rem;
    font-size: 1.25rem;
    line-height: 1.5;
    font-weight: 700;

    @media (max-width: ${style.collapse}px) {
      font-size: 1rem;
      font-weight: 600;
    }
  }

  ${Carousel} {
    .swiper-container {
      .swiper-slide {
        width: auto;
      }
    }
  }

  ${Block} {
    display: flex;
    flex-flow: row nowrap;

    & > * {
      margin-right: 2rem;
      flex: 1 1 auto;
    }
  }
`;

export const GroupSuggestionCarousel = (props) => {
  const { groups } = props;
  const style = useSpring({
    from: {
      opacity: 0,
      paddingLeft: 24,
    },
    to: {
      opacity: 1,
      paddingLeft: 0,
    },
  });

  if (groups.length === 0) {
    return null;
  }

  return (
    <Carousel style={style}>
      <Swiper spaceBetween={16} slidesPerView="auto">
        {groups.map((group) => (
          <SwiperSlide key={group.id}>
            <GroupSuggestionCard {...group} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Carousel>
  );
};

export const GroupSuggestionBlock = (props) => {
  const { groups } = props;
  const style = useSpring({
    from: {
      opacity: 0,
      paddingLeft: 24,
    },
    to: {
      opacity: 1,
      paddingLeft: 0,
    },
  });

  if (groups.length === 0) {
    return null;
  }

  return (
    <Block style={style}>
      {groups.map((group) => (
        <GroupSuggestionCard {...group} key={group.id} />
      ))}
    </Block>
  );
};

export const GroupSuggestions = (props) => {
  const { groups } = props;
  if (groups.length === 0) {
    return null;
  }
  return (
    <StyledWrapper>
      <h4>Autres groupes qui peuvent vous intéresser</h4>
      <ResponsiveLayout
        MobileLayout={GroupSuggestionCarousel}
        DesktopLayout={GroupSuggestionBlock}
        {...props}
      />
    </StyledWrapper>
  );
};

GroupSuggestionCarousel.propTypes = GroupSuggestionBlock.propTypes = GroupSuggestions.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export default GroupSuggestions;
