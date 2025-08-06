/* resources/js/Pages/Admin/PricingTables/Edit.tsx */
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import QuillEditor from '@/components/QuillEditor';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Content {
  id: number;
  service_name: string;
  description: string;
  is_safety: boolean;
}

interface Props {
  table: {
    id: number;
    title: string;
    contents: Content[];
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pricing Tables', href: '/admin/pricing-tables' },
  { title: 'Edit', href: '#' },
];

export default function PricingTablesEdit({ table }: Props) {
  const [editingContent, setEditingContent] = useState<number | null>(null);

  // Table title form
  const { data: titleData, setData: setTitleData, put, processing: titleProcessing, errors: titleErrors } = useForm({
    title: table.title,
  });

  // Add content form
  const { data: contentData, setData: setContentData, post, processing: contentProcessing, errors: contentErrors, reset } = useForm({
    service_name: '',
    description: '',
    is_safety: false,
  });

  // Edit content form
  const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing, errors: editErrors } = useForm({
    service_name: '',
    description: '',
    is_safety: false,
  });

  const updateTitle = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.pricing-tables.update', table.id));
  };

  const addContent = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.pricing-tables.contents.store', table.id), {
      onSuccess: () => reset(),
    });
  };

  const startEditing = (content: Content) => {
    setEditingContent(content.id);
    setEditData({
      service_name: content.service_name,
      description: content.description,
      is_safety: content.is_safety,
    });
  };

  const cancelEditing = () => {
    setEditingContent(null);
  };

  const updateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContent) {
      putEdit(route('admin.pricing-table-contents.update', editingContent), {
        onSuccess: () => setEditingContent(null),
      });
    }
  };

  const deleteContent = (id: number) => {
    if (confirm('Are you sure you want to delete this content?')) {
      router.delete(route('admin.pricing-table-contents.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Table: ${table.title}`} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8 space-y-8">
          
          {/* Table Title */}
          <form onSubmit={updateTitle} className="space-y-4">
            <h2 className="text-xl font-semibold">Table Settings</h2>
            <div className="flex flex-col gap-2">
              <Label>Table Title</Label>
              <Input
                value={titleData.title}
                onChange={e => setTitleData('title', e.target.value)}
              />
              {titleErrors.title && <p className="text-sm text-red-500">{titleErrors.title}</p>}
            </div>
            <Button type="submit" disabled={titleProcessing}>
              {titleProcessing ? 'Saving…' : 'Save Title'}
            </Button>
          </form>

          {/* Existing Contents */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Table Contents</h2>
            
            {table.contents.length === 0 ? (
              <p className="text-muted-foreground">No contents added yet.</p>
            ) : (
              <div className="space-y-4">
                {table.contents.map((content) => (
                  <div key={content.id} className="border rounded-lg p-4 bg-card">
                    {editingContent === content.id ? (
                      // Edit form
                      <form onSubmit={updateContent} className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <Label>Service Name</Label>
                          <Input
                            value={editData.service_name}
                            onChange={e => setEditData('service_name', e.target.value)}
                          />
                          {editErrors.service_name && <p className="text-sm text-red-500">{editErrors.service_name}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label>Description</Label>
                          <QuillEditor
                            value={editData.description}
                            onChange={content => setEditData('description', content)}
                          />
                          {editErrors.description && <p className="text-sm text-red-500">{editErrors.description}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-safety-${content.id}`}
                            checked={editData.is_safety}
                            onCheckedChange={checked => setEditData('is_safety', !!checked)}
                          />
                          <Label htmlFor={`edit-safety-${content.id}`}>Safety Feature</Label>
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" disabled={editProcessing}>
                            {editProcessing ? 'Saving…' : 'Save'}
                          </Button>
                          <Button type="button" variant="outline" onClick={cancelEditing}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      // Display content
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{content.service_name}</h3>
                          <div 
                            className="prose prose-sm max-w-none mt-2 text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: content.description }}
                          />
                          {content.is_safety && (
                            <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Safety ✓
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startEditing(content)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteContent(content.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Content */}
          <form onSubmit={addContent} className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Add New Content</h2>
            
            <div className="flex flex-col gap-2">
              <Label>Service Name</Label>
              <Input
                value={contentData.service_name}
                onChange={e => setContentData('service_name', e.target.value)}
                placeholder="e.g., Customer Support"
              />
              {contentErrors.service_name && <p className="text-sm text-red-500">{contentErrors.service_name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <QuillEditor
                value={contentData.description}
                onChange={content => setContentData('description', content)}
              />
              {contentErrors.description && <p className="text-sm text-red-500">{contentErrors.description}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_safety"
                checked={contentData.is_safety}
                onCheckedChange={checked => setContentData('is_safety', !!checked)}
              />
              <Label htmlFor="is_safety">Safety Feature</Label>
            </div>

            <Button type="submit" disabled={contentProcessing}>
              {contentProcessing ? 'Adding…' : 'Add Content'}
            </Button>
          </form>

        </div>
      </div>
    </AppLayout>
  );
}
