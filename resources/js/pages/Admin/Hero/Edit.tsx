// resources/js/Pages/Admin/Hero/Edit.tsx
import { Head, useForm }     from '@inertiajs/react';
import AppLayout             from '@/layouts/app-layout';
import { Button }            from '@/components/ui/button';
import { Label }             from '@/components/ui/label';
import { Input }             from '@/components/ui/input';
import { Textarea }          from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import FlashMessage from '@/components/flash-message'; // Add this import

interface AnimatedText {
    id?: number;
    text: string;
}

interface Props {
  hero: {
    title: string;
    description: string;
    image: string | null;
    animated_texts: AnimatedText[];
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Hero Section', href: '/admin/hero' },
];

export default function HeroEdit({ hero }: Props) {
  const [animatedTexts, setAnimatedTexts] = useState<AnimatedText[]>(
    hero.animated_texts.length > 0 ? hero.animated_texts : [{ text: '' }]
  );

  const { data, setData, post, processing, errors, progress } = useForm({
    _method:         'put',
    title:           hero.title,
    description:     hero.description,
    image:           null as File | null,
    animated_texts:  animatedTexts,
  });

  const addAnimatedText = () => {
    const newTexts = [...animatedTexts, { text: '' }];
    setAnimatedTexts(newTexts);
    setData('animated_texts', newTexts);
  };

  const removeAnimatedText = (index: number) => {
    const newTexts = animatedTexts.filter((_, i) => i !== index);
    setAnimatedTexts(newTexts);
    setData('animated_texts', newTexts);
  };

  const updateAnimatedText = (index: number, text: string) => {
    const newTexts = animatedTexts.map((item, i) => 
      i === index ? { ...item, text } : item
    );
    setAnimatedTexts(newTexts);
    setData('animated_texts', newTexts);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.hero.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hero Section" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
              <FlashMessage />
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-8">

            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                value={data.title}
                onChange={e => setData('title', e.target.value)}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={data.description}
                onChange={e => setData('description', e.target.value)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Hero Image</Label>
              <Input
                type="file"
                id="image"
                onChange={e => setData('image', e.target.files?.[0] ?? null)}
              />
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>

            {/* Animated Texts Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label>Animated Texts</Label>
                <Button type="button" onClick={addAnimatedText} variant="outline">
                  Add Text
                </Button>
              </div>
              
              {animatedTexts.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Animated text ${index + 1}`}
                    value={item.text}
                    onChange={e => updateAnimatedText(index, e.target.value)}
                    className="flex-1"
                  />
                  {animatedTexts.length > 1 && (
                    <Button 
                      type="button" 
                      onClick={() => removeAnimatedText(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {errors['animated_texts.0.text'] && (
                <p className="text-sm text-red-500">At least one animated text is required</p>
              )}
            </div>

            {progress && (
              <div className="w-full rounded bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-2 rounded bg-primary"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            )}

            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
