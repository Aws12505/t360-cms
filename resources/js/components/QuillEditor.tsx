// components/QuillEditor.tsx
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  name: string;
  value: string;
  onChange: (content: string) => void;
  className?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  name,
  value,
  onChange,
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        },
      });

      // Initial content
      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }

      // Change listener
      quillRef.current.on('text-change', () => {
        const html = quillRef.current?.root.innerHTML || '';
        onChange(html);
      });
    }
  }, []);

  useEffect(() => {
    // Sync external changes to the editor (if any)
    if (
      quillRef.current &&
      value !== quillRef.current.root.innerHTML &&
      document.activeElement !== quillRef.current.root
    ) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value]);

  return (
    <div className={className}>
      <div ref={editorRef} style={{ height: '300px' }} />
      <input type="hidden" name={name} value={value} />
    </div>
  );
};

export default QuillEditor;
