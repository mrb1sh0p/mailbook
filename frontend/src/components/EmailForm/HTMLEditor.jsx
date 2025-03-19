import React from 'react';
import PropTypes from 'prop-types';

const HTMLEditor = ({ content, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Conteúdo HTML</label>
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-96 p-4 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 resize-none"
      spellCheck="false"
      placeholder="Digite seu conteúdo HTML aqui..."
    />
  </div>
);

HTMLEditor.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default HTMLEditor;