import React from 'react';
import PropTypes from 'prop-types';

const AttachmentUpload = ({ onUpload, attachment }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Anexo PDF</label>
    <input
      type="file"
      accept=".pdf"
      onChange={(e) => onUpload(e.target.files[0])}
      className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    {attachment && (
      <div className="mt-2 text-sm text-gray-500 flex items-center">
        <span className="mr-2">📎 {attachment.originalname}</span>
        <span className="text-xs">({Math.round(attachment.size / 1024)} KB)</span>
      </div>
    )}
  </div>
);

AttachmentUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
  attachment: PropTypes.object
};

export default AttachmentUpload;