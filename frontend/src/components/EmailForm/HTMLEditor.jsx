import { useState, useRef, useEffect } from 'react';
import { convertTextToHTML, convertHTMLToText } from '../../utils/convertTextToHTML.js';
import useModels from '../../hooks/useModel.js';
import ModelSelector from '../modelForm/ModelSelector.jsx';

const HTMLEditor = ({ value, onChange }) => {
  const [text, setText] = useState(convertHTMLToText(value));
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState('');
  const { modelList, selectedModel, selectModel, updateModel, saveModel  } = useModels();

  const textareaRef = useRef(null);

  useEffect(() => {
    if (selectedModel) {
      setTitle(selectedModel.title);
      onChange(selectedModel.content);
    }
  }, [onChange, selectedModel]);


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
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  const handlerSaveNewModel = (model) => {
    if (model.id) {
      updateModel(model)
    setTitle('');
    handleTextChange('');
    }
    else {
      
    setTitle('');
    handleTextChange('');
      saveModel(model)
    }

  }

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
      <div className="flex gap-1 p-2 border-b bg-gray-50">
      <div className="flex gap-1 items-center">
      <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título do modelo"
          className="px-2 py-1 border rounded-md text-sm flex-grow bg-white focus:outline-none"
        />

        <ModelSelector 
          models={modelList}
          selectedId={selectedModel?.id}
          onSelect={selectModel}
        />

        <button
          type="button"
          onClick={() => handlerSaveNewModel({ id: selectedModel?.id, title, content: text })}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {selectedModel?.id  ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
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
          {preview ? '</> Editar' : 'Visualizar'}
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
          onChange={(e) => {handleTextChange(e.target.value)}}
          className="w-full min-h-[300px] p-4 font-mono text-sm bg-white resize-none focus:outline-none"
          placeholder="Digite seu texto aqui...
Use *negrito*, _itálico_ e • para listas"
        />
      )}
    </div>
  );
};

export default HTMLEditor;