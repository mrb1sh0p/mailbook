import React from 'react';
import PropTypes from 'prop-types';

const FeedbackMessage = ({ type, message }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className={`p-4 rounded-lg ${styles[type]} mb-6`}>
      {message}
    </div>
  );
};

FeedbackMessage.propTypes = {
  type: PropTypes.oneOf(['error', 'success', 'warning']),
  message: PropTypes.string
};

export default FeedbackMessage;