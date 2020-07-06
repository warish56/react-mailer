import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const getSizeClass = size => {
  switch (size) {
    case 'medium':
      return 'activity-indicator-m';
    case 'large':
      return 'activity-indicator-l';
    case 'small':
    default:
      return 'activity-indicator-s';
  }
};

const getBorderWidth = size => {
  switch (size) {
    case 'medium':
      return '6px';
    case 'large':
      return '8px';
    case 'small':
    default:
      return '3px';
  }
};

const ActivityIndicator = ({ color, size }) => {
  const sizeClass = getSizeClass(size);
  const borderWidth = getBorderWidth(size);

  return (
    <div className={`activity-indicator ${sizeClass}`}>
      <div
        style={{
          borderWidth
        }}
        className="activity-indicator-bar-1"
      />
      <div
        style={{
          borderColor: color,
          borderWidth
        }}
        className="activity-indicator-bar-2"
      />
    </div>
  );
};

ActivityIndicator.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

ActivityIndicator.defaultProps = {
  color: 'black',
  size: 'small'
};

export default ActivityIndicator;
