// components/QuillEditorAdvanced.tsx
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorAdvancedProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
}

const QuillEditorAdvanced: React.FC<QuillEditorAdvancedProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  height = '400px',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            // Text formatting
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            
            // Text styling
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            
            // Alignment and indentation
            [{ 'align': [] }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            
            // Lists
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            
            // Links and media
            ['link', 'image', 'video'],
            
            // Block formatting
            ['blockquote', 'code-block'],
            
            // Clean formatting
            ['clean']
          ],
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
          },
          clipboard: {
            matchVisual: false,
          },
          keyboard: {
            bindings: {
              'bold': {
                key: 'B',
                ctrlKey: true,
                handler: function(range: any, context: any) {
                  this.quill.format('bold', !context.format.bold);
                }
              },
              'italic': {
                key: 'I',
                ctrlKey: true,
                handler: function(range: any, context: any) {
                  this.quill.format('italic', !context.format.italic);
                }
              },
              'underline': {
                key: 'U',
                ctrlKey: true,
                handler: function(range: any, context: any) {
                  this.quill.format('underline', !context.format.underline);
                }
              },
              'save': {
                key: 'S',
                ctrlKey: true,
                handler: function() {
                  console.log('Save triggered');
                  return false;
                }
              }
            }
          }
        },
        formats: [
          'bold', 'italic', 'underline', 'strike', 'color', 'background',
          'font', 'size', 'script', 'link', 'code',
          'header', 'blockquote', 'code-block', 'list', 'bullet',
          'indent', 'align', 'direction',
          'image', 'video'
        ]
      });

      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }

      quillRef.current.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          const html = quillRef.current?.root.innerHTML || '';
          const cleanedHtml = html === '<p><br></p>' ? '' : html;
          onChange(cleanedHtml);
        }
      });

      // Custom handlers
      const toolbar = quillRef.current.getModule('toolbar');
      
      toolbar.addHandler('image', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
          const file = input.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const range = quillRef.current?.getSelection(true);
              if (range) {
                quillRef.current?.insertEmbed(range.index, 'image', e.target?.result);
              }
            };
            reader.readAsDataURL(file);
          }
        };
      });

      toolbar.addHandler('video', () => {
        const url = prompt('Enter video URL:');
        if (url) {
          const range = quillRef.current?.getSelection(true);
          if (range) {
            quillRef.current?.insertEmbed(range.index, 'video', url);
          }
        }
      });

      toolbar.addHandler('link', (value) => {
        if (value) {
          const href = prompt('Enter the URL:');
          if (href) {
            quillRef.current?.format('link', href);
          }
        } else {
          quillRef.current?.format('link', false);
        }
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current.off('selection-change');
      }
    };
  }, []);

  useEffect(() => {
    if (
      quillRef.current &&
      value !== quillRef.current.root.innerHTML &&
      document.activeElement !== quillRef.current.root
    ) {
      const selection = quillRef.current.getSelection();
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
      if (selection) {
        quillRef.current.setSelection(selection);
      }
    }
  }, [value]);

  return (
    <div className={className}>
      <div 
        ref={editorRef} 
        style={{ height }} 
      />
      
      <style jsx>{`
        /* Main Editor Container */
        .ql-toolbar {
          border: 1px solid #ccc;
          border-bottom: none;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
        
        .ql-container {
          border: 1px solid #ccc;
          border-top: none;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          font-family: inherit;
        }
        
        /* Editor Content Area */
        .ql-editor {
          min-height: ${height};
        }
        
        /* Toolbar Buttons */
        .ql-toolbar button {
          width: 28px;
          height: 28px;
        }
        
        /* Focus States */
        .ql-container.ql-snow {
          border-color: #ccc;
        }
        
        .ql-editor:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default QuillEditorAdvanced;