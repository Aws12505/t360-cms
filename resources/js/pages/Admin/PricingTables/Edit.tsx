/* resources/js/Pages/Admin/PricingTables/Edit.tsx */
import { Head, useForm, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import QuillEditor from '@/components/QuillEditor';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import FlashMessage from '@/components/flash-message'; // Add this import

interface Content {
  id: number;
  service_name: string;
  description: string;
  is_safety: boolean;
}

interface PaginatedContents {
  data: Content[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface Props {
  table: {
    id: number;
    title: string;
  };
  safetyContents: PaginatedContents;
  regularContents: PaginatedContents;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pricing Tables', href: '/admin/pricing-tables' },
  { title: 'Edit', href: '#' },
];

export default function PricingTablesEdit({ table, safetyContents, regularContents }: Props) {
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

  // Pagination component
  const PaginationLinks = ({ paginatedData, pageParam }: { 
    paginatedData: PaginatedContents; 
    pageParam: string;
  }) => {
    if (paginatedData.last_page <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-4">
        {paginatedData.links.map((link, index) => {
          if (!link.url) {
            return (
              <span 
                key={index} 
                className="px-3 py-1 text-gray-400 cursor-not-allowed"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            );
          }

          const url = new URL(link.url);
          const currentUrl = new URL(window.location.href);
          
          // Preserve current page parameters for the other paginator
          const searchParams = new URLSearchParams(currentUrl.search);
          url.searchParams.forEach((value, key) => {
            if (key === pageParam || key === 'page') {
              searchParams.set(key, value);
            }
          });

          return (
            <Link
              key={index}
              href={`${currentUrl.pathname}?${searchParams.toString()}`}
              className={`px-3 py-1 rounded ${
                link.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        })}
      </div>
    );
  };

  // Content list component
  const ContentList = ({ 
    contents, 
    title, 
    emptyMessage, 
    paginatedData, 
    pageParam 
  }: { 
    contents: Content[]; 
    title: string; 
    emptyMessage: string;
    paginatedData: PaginatedContents;
    pageParam: string;
  }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          Total: {paginatedData.total} items
        </span>
      </div>
      
      {contents.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
      ) : (
        <>
          <div className="space-y-3">
            {contents.map((content) => (
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
                      <h4 className="font-semibold">{content.service_name}</h4>
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
          
          <PaginationLinks paginatedData={paginatedData} pageParam={pageParam} />
        </>
      )}
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Table: ${table.title}`} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
              <FlashMessage />
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8 space-y-8">
          
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

          {/* Contents Side by Side */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Table Contents</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Safety Contents */}
              <div className="border rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20">
                <ContentList
                  contents={safetyContents.data}
                  title="Safety Features"
                  emptyMessage="No safety contents added yet."
                  paginatedData={safetyContents}
                  pageParam="safety_page"
                />
              </div>

              {/* Regular Contents */}
              <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20">
                <ContentList
                  contents={regularContents.data}
                  title="Regular Features"
                  emptyMessage="No regular contents added yet."
                  paginatedData={regularContents}
                  pageParam="regular_page"
                />
              </div>
            </div>
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
