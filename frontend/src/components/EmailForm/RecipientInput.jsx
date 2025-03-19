import React from 'react';
import PropTypes from 'prop-types';
import AttachmentUpload from './AttachmentUpload';
import Button from '../UI/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

const RecipientInput = ({ 
  index,
  recipient,
  onFieldChange,
  onFileUpload,
  onRemove,
  isLast
}) => (
  <div className="mb-6 border-b pb-6 last:border-b-0 relative group">
    {!isLast && (
      <Button
        variant="danger"
        className="absolute top-2 right-2 p-1"
        onClick={onRemove}
        icon={<XMarkIcon className="h-5 w-5" />}
      />
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Destinatário</label>
        <input
          type="email"
          value={recipient.to}
          onChange={(e) => onFieldChange(index, 'to', e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="destinatario@exemplo.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Assunto</label>
        <input
          value={recipient.subject}
          onChange={(e) => onFieldChange(index, 'subject', e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Assunto do e-mail"
          required
        />
      </div>
    </div>

    <AttachmentUpload
      onUpload={(file) => onFileUpload(index, file)}
      attachment={recipient.attachment}
    />
  </div>
);

RecipientInput.propTypes = {
  index: PropTypes.number.isRequired,
  recipient: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isLast: PropTypes.bool
};

export default RecipientInput;