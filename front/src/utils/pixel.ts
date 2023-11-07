import { Position } from "../../types";

function absoluteValueToRelativeValue(
  absoluteValue: number,
  containerSize: number
) {
  return parseFloat(((absoluteValue / containerSize) * 100).toFixed(6));
}

function relativeValueToAbsoluteValue(
  relativeValue: number,
  containerSize: number
) {
  return (relativeValue / 100) * containerSize;
}

export function getRelativePositionFromAbsolutePosition(
  position: Position,
  container: {
    width: number;
    height: number;
  }
): Position {
  return {
    x: absoluteValueToRelativeValue(position.x, container.width),
    y: absoluteValueToRelativeValue(position.y, container.height),
  };
}

export function getAbsolutePositionFromRelativePosition(
  position: Position,
  container: {
    width: number;
    height: number;
  }
): Position {
  return {
    x: relativeValueToAbsoluteValue(position.x, container.width),
    y: relativeValueToAbsoluteValue(position.y, container.height),
  };
}
