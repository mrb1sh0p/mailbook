import { useState, useRef } from 'react';

const HTMLEditor = ({ content, onChange }) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  const handleInsertTags = (startTag, endTag = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);
    
    const newContent = 
      content.slice(0, start) +
      startTag +
      selectedText +
      endTag +
      content.slice(end);

    onChange(newContent);

    // Mantém o foco e posiciona o cursor corretamente
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + startTag.length;
      textarea.selectionEnd = start + startTag.length + selectedText.length;
    }, 0);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 mb-6 relative overflow-hidden border border-gray-200"> 
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <div className="flex gap-1">
            {/* Botões de Formatação */}
            <button
              type="button"
              onClick={() => handleInsertTags('<strong>', '</strong>')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => handleInsertTags('<em>', '</em>')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => handleInsertTags('<u>', '</u>')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm underline"
            >
              U
            </button>
            <button
              type="button"
              onClick={() => handleInsertTags('<a href="" target="_blank">', '</a>')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              🔗
            </button>
            <button
              type="button"
              onClick={() => handleInsertTags('<img src="" alt="">', '')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              🖼
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">HTML</span>
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            {isPreview ? 'Editar' : 'Visualizar'}
          </button>
        </div>
      </div>

      <div className="editor h-96 relative">
        {isPreview ? (
          <div
            className="preview-content p-4 bg-gray-900 text-gray-100 h-full overflow-auto prose"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="relative h-full">
            <pre
              ref={preRef}
              className="absolute inset-0 p-4 font-mono text-transparent pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              <code className="language-html block h-full">{content}</code>
            </pre>
            
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-white resize-none focus:outline-none absolute inset-0 text-black"
              spellCheck="false"
              placeholder="Digite seu conteúdo HTML aqui..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HTMLEditor;