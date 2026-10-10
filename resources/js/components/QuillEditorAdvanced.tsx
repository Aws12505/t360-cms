// components/QuillEditorAdvanced.tsx
import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { BarChart3, ImagePlus, Info, Minus, MousePointerClick, Sparkles, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CUSTOM_FORMATS,
  registerQuillBlots,
  type CalloutVariant,
  type CtaValue,
  type FigureValue,
  type StatItem,
} from '@/lib/quill-blots';
import { altFromFilename, uploadEditorImage } from '@/lib/upload-image';
import { CtaDialog, FigureDialog, StatsDialog } from '@/components/editor/editor-dialogs';

registerQuillBlots();

interface QuillEditorAdvancedProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
  /** Enables image sizes/captions, callouts, buttons and stat rows (used by driver positions). */
  allowCustomBlocks?: boolean;
}

type DialogState =
  | { type: 'figure'; index: number; editing: boolean; value?: FigureValue }
  | { type: 'cta'; index: number; editing: boolean; value?: CtaValue }
  | { type: 'stats'; index: number; editing: boolean; value?: StatItem[] }
  | null;

const UPLOAD_MIMETYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const QuillEditorAdvanced: React.FC<QuillEditorAdvancedProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  height = '400px',
  className = '',
  allowCustomBlocks = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  onChangeRef.current = onChange;

  const currentIndex = () => {
    const quill = quillRef.current;
    if (!quill) return 0;
    return quill.getSelection(true)?.index ?? quill.getLength();
  };

  const emitChange = () => {
    const html = quillRef.current?.root.innerHTML || '';
    onChangeRef.current(html === '<p><br></p>' ? '' : html);
  };

  /** Insert (or replace, when editing) a block embed at an index. */
  const putEmbed = (index: number, editing: boolean, name: string, embedValue: unknown) => {
    const quill = quillRef.current;
    if (!quill) return;
    if (editing) quill.deleteText(index, 1, 'user');
    quill.insertEmbed(index, name, embedValue, 'user');
    quill.setSelection(index + 1, 0, 'silent');
    emitChange();
  };

  const insertImage = (index: number, editing: boolean, figure: FigureValue) => {
    if (allowCustomBlocks) {
      putEmbed(index, editing, 'figure', figure);
      return;
    }
    // Plain <img> keeps older pages (e.g. newsletter) rendering exactly as before
    const quill = quillRef.current;
    if (!quill) return;
    if (editing) quill.deleteText(index, 1, 'user');
    quill.insertEmbed(index, 'image', figure.src, 'user');
    if (figure.alt) quill.formatText(index, 1, { alt: figure.alt }, 'user');
    quill.setSelection(index + 1, 0, 'silent');
    emitChange();
  };

  // Drag & drop / paste of image files: upload, then insert by URL
  const uploadFiles = async (index: number, files: File[]) => {
    setUploadError(null);
    setUploading(true);
    try {
      let at = index;
      for (const file of files) {
        const uploaded = await uploadEditorImage(file);
        insertImage(at, false, { src: uploaded.url, alt: altFromFilename(file.name), size: 'full' });
        at += 1;
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };
  const uploadFilesRef = useRef(uploadFiles);
  uploadFilesRef.current = uploadFiles;

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
          uploader: {
            mimetypes: UPLOAD_MIMETYPES,
            handler: (range: { index: number }, files: File[]) => {
              uploadFilesRef.current(range?.index ?? 0, files);
            },
          },
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
                handler: function(this: any, range: any, context: any) {
                  this.quill.format('bold', !context.format.bold);
                }
              },
              'italic': {
                key: 'I',
                ctrlKey: true,
                handler: function(this: any, range: any, context: any) {
                  this.quill.format('italic', !context.format.italic);
                }
              },
              'underline': {
                key: 'U',
                ctrlKey: true,
                handler: function(this: any, range: any, context: any) {
                  this.quill.format('underline', !context.format.underline);
                }
              },
              'save': {
                key: 'S',
                ctrlKey: true,
                handler: function() {
                  return false;
                }
              }
            }
          }
        },
        formats: [
          'bold', 'italic', 'underline', 'strike', 'color', 'background',
          'font', 'size', 'script', 'link', 'code',
          'header', 'blockquote', 'code-block', 'list',
          'indent', 'align', 'direction',
          'image', 'video',
          ...CUSTOM_FORMATS,
        ]
      });

      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }

      quillRef.current.on('text-change', (_delta, _oldDelta, source) => {
        if (source === 'user') {
          emitChange();
        }
      });

      // Custom handlers
      const toolbar = quillRef.current.getModule('toolbar') as any;

      // Image: open the upload/URL dialog (alt text required), never base64
      toolbar.addHandler('image', () => {
        setDialog({ type: 'figure', index: currentIndex(), editing: false });
      });

      toolbar.addHandler('video', () => {
        const url = prompt('Enter video URL (YouTube or Vimeo embed link):');
        if (url) {
          const range = quillRef.current?.getSelection(true);
          if (range) {
            quillRef.current?.insertEmbed(range.index, 'video', url, 'user');
          }
        }
      });

      toolbar.addHandler('link', (linkValue: boolean) => {
        if (linkValue) {
          const href = prompt('Enter the URL:');
          if (href) {
            quillRef.current?.format('link', href, 'user');
          }
        } else {
          quillRef.current?.format('link', false, 'user');
        }
      });

      // Click an inserted block to edit it
      quillRef.current.root.addEventListener('click', (event) => {
        const quill = quillRef.current;
        const target = (event.target as HTMLElement).closest('.t3d-figure, .t3d-cta, .t3d-stats') as HTMLElement | null;
        if (!quill || !target) return;
        event.preventDefault();
        const blot = Quill.find(target) as any;
        if (!blot || blot instanceof Quill) return;
        const index = quill.getIndex(blot);
        const statics = blot.constructor as any;
        if (target.classList.contains('t3d-figure')) {
          setDialog({ type: 'figure', index, editing: true, value: statics.value(target) });
        } else if (target.classList.contains('t3d-cta')) {
          setDialog({ type: 'cta', index, editing: true, value: statics.value(target) });
        } else {
          setDialog({ type: 'stats', index, editing: true, value: statics.value(target) });
        }
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current.off('selection-change');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const applyCallout = (variant: CalloutVariant | false) => {
    const quill = quillRef.current;
    if (!quill) return;
    quill.getSelection(true);
    quill.format('callout', variant, 'user');
    emitChange();
  };

  const insertDivider = () => {
    putEmbed(currentIndex(), false, 'divider', true);
  };

  return (
    <div className={className}>
      {allowCustomBlocks && (
        <div className="flex flex-wrap items-center gap-1 rounded-t border border-b-0 border-[#ccc] bg-muted/40 px-2 py-1.5">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Insert</span>
          <Button type="button" variant="ghost" size="sm" onClick={() => setDialog({ type: 'figure', index: currentIndex(), editing: false })}>
            <ImagePlus /> Image
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <Sparkles /> Callout
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => applyCallout('highlight')}>
                <Sparkles className="text-amber-500" /> Highlight box
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => applyCallout('info')}>
                <Info className="text-blue-600" /> Info box
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => applyCallout('warning')}>
                <TriangleAlert className="text-red-600" /> Important box
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => applyCallout(false)}>
                <X /> Remove box
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="button" variant="ghost" size="sm" onClick={() => setDialog({ type: 'cta', index: currentIndex(), editing: false })}>
            <MousePointerClick /> Button
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setDialog({ type: 'stats', index: currentIndex(), editing: false })}>
            <BarChart3 /> Stats row
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={insertDivider}>
            <Minus /> Divider
          </Button>
          <span className="ml-auto hidden text-xs text-muted-foreground md:inline">Tip: click an image, button or stats row to edit it</span>
        </div>
      )}

      <div
        ref={editorRef}
        style={{ height }}
      />

      {(uploading || uploadError) && (
        <p className={`mt-2 text-sm ${uploadError ? 'text-red-500' : 'text-muted-foreground'}`}>
          {uploadError ?? 'Uploading image…'}
        </p>
      )}

      <FigureDialog
        open={dialog?.type === 'figure'}
        initial={dialog?.type === 'figure' ? dialog.value : undefined}
        showLayoutOptions={allowCustomBlocks}
        onClose={() => setDialog(null)}
        onSubmit={(figure) => {
          if (dialog?.type === 'figure') insertImage(dialog.index, dialog.editing, figure);
          setDialog(null);
        }}
        onDelete={dialog?.type === 'figure' && dialog.editing ? () => {
          quillRef.current?.deleteText(dialog.index, 1, 'user');
          setDialog(null);
        } : undefined}
      />
      <CtaDialog
        open={dialog?.type === 'cta'}
        initial={dialog?.type === 'cta' ? dialog.value : undefined}
        onClose={() => setDialog(null)}
        onSubmit={(cta) => {
          if (dialog?.type === 'cta') putEmbed(dialog.index, dialog.editing, 'cta', cta);
          setDialog(null);
        }}
        onDelete={dialog?.type === 'cta' && dialog.editing ? () => {
          quillRef.current?.deleteText(dialog.index, 1, 'user');
          setDialog(null);
        } : undefined}
      />
      <StatsDialog
        open={dialog?.type === 'stats'}
        initial={dialog?.type === 'stats' ? dialog.value : undefined}
        onClose={() => setDialog(null)}
        onSubmit={(stats) => {
          if (dialog?.type === 'stats') putEmbed(dialog.index, dialog.editing, 'stats', stats);
          setDialog(null);
        }}
        onDelete={dialog?.type === 'stats' && dialog.editing ? () => {
          quillRef.current?.deleteText(dialog.index, 1, 'user');
          setDialog(null);
        } : undefined}
      />

      <style>{`
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

        /* Image styling within editor */
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 8px 0;
        }

        /* Custom blocks (mirrors the website look) */
        .ql-editor .t3d-figure { margin: 16px auto; cursor: pointer; }
        .ql-editor .t3d-figure img { display: block; width: 100%; border-radius: 10px; margin: 0; }
        .ql-editor .t3d-figure--half { max-width: 50%; }
        .ql-editor .t3d-figure--small { max-width: 33%; }
        .ql-editor .t3d-figure figcaption { font-size: 12px; color: #6b7280; text-align: center; margin-top: 6px; }
        .ql-editor .t3d-figure:hover, .ql-editor .t3d-cta:hover, .ql-editor .t3d-stats:hover { outline: 2px dashed #2e368f; outline-offset: 4px; }
        .ql-editor aside.t3d-callout { padding: 10px 16px; border-left: 4px solid #f59e0b; background: #fffbeb; }
        .ql-editor aside.t3d-callout + aside.t3d-callout { padding-top: 0; }
        .ql-editor aside.t3d-callout--info { border-color: #2e368f; background: #eef0fb; }
        .ql-editor aside.t3d-callout--warning { border-color: #e93232; background: #fdeeee; }
        .ql-editor .t3d-cta { margin: 16px 0; cursor: pointer; }
        .ql-editor .t3d-btn { display: inline-block; background: #e93232; color: #fff; padding: 10px 22px; border-radius: 999px; font-weight: 600; text-decoration: none; }
        .ql-editor .t3d-btn--outline { background: transparent; color: #2e368f; border: 2px solid #2e368f; }
        .ql-editor .t3d-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin: 16px 0; cursor: pointer; }
        .ql-editor .t3d-stat { background: #f5f6fb; border-radius: 10px; padding: 12px; text-align: center; }
        .ql-editor .t3d-stat dd { margin: 0; font-size: 20px; font-weight: 700; color: #2e368f; }
        .ql-editor .t3d-stat dt { font-size: 12px; color: #6b7280; }
        .ql-editor hr.t3d-divider { border: 0; border-top: 2px solid #e5e7eb; margin: 24px 0; }
      `}</style>
    </div>
  );
};

export default QuillEditorAdvanced;
