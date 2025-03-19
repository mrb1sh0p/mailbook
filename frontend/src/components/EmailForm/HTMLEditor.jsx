import { useState, useRef, useEffect } from 'react';
import { convertTextToHTML, convertHTMLToText } from '../../utils/convertTextToHTML.js';

const HTMLEditor = ({ value, onChange }) => {
  const [text, setText] = useState(convertHTMLToText(value));
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setText(convertHTMLToText(value));
  }, [value]);

  const handleTextChange = (newText) => {
    setText(newText);
    onChange(convertTextToHTML(newText));
  };

  const insertFormatting = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.slice(start, end);
    
    const newText = 
      text.slice(0, start) +
      before +
      selectedText +
      after +
      text.slice(end);
    
    handleTextChange(newText);
    
    // Posiciona o cursor
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => insertFormatting('*', '*')}
          className="px-3 py-1 hover:bg-gray-200 rounded"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('_', '_')}
          className="px-3 py-1 hover:bg-gray-200 rounded"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('• ')}
          className="px-3 py-1 hover:bg-gray-200 rounded"
        >
          <span>•</span>
        </button>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="px-3 py-1 hover:bg-gray-200 rounded ml-auto"
        >
          {preview ? '</> Editar' : '👁️ Visualizar'}
        </button>
      </div>

      {preview ? (
        <div
          className="min-h-[300px] p-4 prose"
          dangerouslySetInnerHTML={{ __html: convertTextToHTML(text) }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full min-h-[300px] p-4 font-mono text-sm bg-white resize-none focus:outline-none"
          placeholder="Digite seu texto aqui...
Use *negrito*, _itálico_ e • para listas"
        />
      )}
    </div>
  );
};

export default HTMLEditor;