import PropTypes from "prop-types";
import React from "react";
import { useTransition, animated } from "react-spring";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import closeButton from "./images/close-btn.svg";

const fadeInTransition = {
  from: { opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0 },
  delay: 200,
};

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  width: 24px;
  height: 24px;
  background-color: transparent;
  border: none;
  background-image: url(${closeButton});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  cursor: pointer;
`;

const BaseTooltip = styled(animated.p)`
  position: absolute;
  width: 224px;
  background-color: ${style.black1000};
  color: white;
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  font-size: 13px;
  line-height: 1.3;
  text-align: left;

  strong {
    font-size: 14px;
  }

  :after {
    content: "";
    position: absolute;
    border-style: solid;
  }
`;

const Tooltips = {
  "top-center": styled(BaseTooltip)`
    top: -10px;
    left: 50%;
    transform: translate(-50%, -100%);

    :after {
      top: 100%;
      right: 50%;
      transform: translateX(3px);
      border-width: 8px 6px 0 6px;
      border-color: black transparent transparent transparent;
    }
  `,
  "top-left": styled(BaseTooltip)`
    top: -10px;
    right: 0;
    transform: translate(-26px, -100%);

    :after {
      top: 100%;
      right: 0;
      margin-left: -4px;
      border-width: 4px;
      border-color: black black transparent transparent;
    }
  `,
  "top-right": styled(BaseTooltip)`
    top: -10px;
    left: 0;
    transform: translate(26px, -100%);

    :after {
      top: 100%;
      left: 0;
      border-width: 4px;
      border-color: black transparent transparent black;
    }
  `,
};

export const TooltipContainer = (props) => {
  const { shouldShow, onClose, position = "top-center", children } = props;
  const tooltipTransition = useTransition(shouldShow, null, fadeInTransition);
  const Tooltip = React.useMemo(() => Tooltips[position], [position]);
  return tooltipTransition.map(({ item, key, props }) =>
    item ? (
      <Tooltip key={key} style={props} position={position}>
        {children}
        {onClose ? <CloseButton aria-label="Cacher" onClick={onClose} /> : null}
      </Tooltip>
    ) : null
  );
};
TooltipContainer.propTypes = {
  position: PropTypes.oneOf(Object.keys(Tooltips)),
  shouldShow: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

export default TooltipContainer;
