import React from 'react';
import PropTypes from 'prop-types';
import RecipientInput from './RecipientInput';
import HTMLEditor from './HTMLEditor';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

const EmailComposer = ({
  emailData,
  onRecipientChange,
  onFileUpload,
  onAddRecipient,
  onRemoveRecipient,
  onContentChange,
  onSend,
  loading,
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSend();
    }}
    className="bg-white p-6 rounded-xl shadow-sm"
  >
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Enviar E-mails</h2>

    {emailData.recipients.map((recipient, index) => (
      <RecipientInput
        key={index}
        index={index}
        recipient={recipient}
        onFieldChange={onRecipientChange}
        onFileUpload={onFileUpload}
        onRemove={() => onRemoveRecipient(index)}
        isLast={emailData.recipients.length === 1}
      />
    ))}

    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Button variant="secondary" onClick={onAddRecipient} className="mb-4">
        + Adicionar Destinatário
      </Button>
    </div>

    <HTMLEditor content={emailData.html} onChange={onContentChange} />

    <Button
      type="submit"
      variant="success"
      disabled={loading}
      className="w-full mt-6"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <LoadingSpinner className="mr-3" />
          Enviando...
        </span>
      ) : (
        `Enviar ${emailData.recipients.length} E-mail(s)`
      )}
    </Button>
  </form>
);

EmailComposer.propTypes = {
  emailData: PropTypes.object.isRequired,
  onRecipientChange: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onAddRecipient: PropTypes.func.isRequired,
  onRemoveRecipient: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default EmailComposer;
