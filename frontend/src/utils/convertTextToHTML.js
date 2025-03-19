export const convertTextToHTML = (text) => {
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  
  return paragraphs.map(paragraph => {
    // Listas
    if (paragraph.startsWith('• ')) {
      const items = paragraph.split('\n')
        .filter(line => line.startsWith('• '))
        .map(line => `<li>${line.slice(2).trim()}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    }
    
    // Formatação inline
    let html = paragraph
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>');

    // Cabeçalhos
    if (paragraph.startsWith('# ')) {
      return `<h1>${paragraph.slice(2)}</h1>`;
    }
    if (paragraph.startsWith('## ')) {
      return `<h2>${paragraph.slice(3)}</h2>`;
    }
    if (paragraph.startsWith('### ')) {
      return `<h3>${paragraph.slice(4)}</h3>`;
    }

    return `<p>${html}</p>`;
  }).join('');
};

export const convertHTMLToText = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  return Array.from(doc.body.childNodes).map(node => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    
    switch(node.tagName) {
      case 'STRONG':
        return `*${node.textContent}*`;
      case 'EM':
        return `_${node.textContent}_`;
      case 'UL':
        return Array.from(node.children)
          .map(li => `• ${li.textContent}`)
          .join('\n');
      case 'H1':
        return `# ${node.textContent}`;
      case 'H2':
        return `## ${node.textContent}`;
      case 'H3':
        return `### ${node.textContent}`;
      default:
        return node.textContent;
    }
  }).join('\n');
};