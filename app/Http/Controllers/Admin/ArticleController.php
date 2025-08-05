<?php

/* app/Http/Controllers/Admin/ArticleController.php */
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Articles/Index', [
            'articles' => Article::withCount('images')
                          ->orderBy('created_at','desc')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Articles/Create');
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'featured_image'=> 'nullable|image|max:2048',
            'custom_date'  => 'nullable|date',
            'content'      => 'required|string',
            'is_active'    => 'boolean',
        ]);

        if ($r->hasFile('featured_image')) {
            $data['featured_image'] = $r->file('featured_image')->store('uploads/articles','public');
        }

        $article = Article::create($data);

        // upload additional images
        if ($r->has('extra_images')) {
            foreach ($r->file('extra_images', []) as $file) {
                $path = $file->store('uploads/articles','public');
                ArticleImage::create([
                    'article_id' => $article->id,
                    'image_path' => $path,
                    'alt_text'   => $file->getClientOriginalName(),
                ]);
            }
        }

        return redirect()->route('admin.articles.index')->with('success','Article created.');
    }

    public function edit(Article $article)
    {
        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article->load('images'),
        ]);
    }

    public function update(Request $r, Article $article)
    {
        $data = $r->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'featured_image'=> 'nullable|image|max:2048',
            'custom_date'  => 'nullable|date',
            'content'      => 'required|string',
            'is_active'    => 'boolean',
        ]);

        if ($r->hasFile('featured_image')) {
            // remove old
            if ($article->featured_image) Storage::disk('public')->delete($article->featured_image);
            $data['featured_image'] = $r->file('featured_image')->store('uploads/articles','public');
        }

        $article->update($data);

        // handle newly-added extra images
        if ($r->has('extra_images')) {
            foreach ($r->file('extra_images', []) as $file) {
                $path = $file->store('uploads/articles','public');
                ArticleImage::create([
                    'article_id' => $article->id,
                    'image_path' => $path,
                    'alt_text'   => $file->getClientOriginalName(),
                ]);
            }
        }

        return back()->with('success','Article updated.');
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return back()->with('success','Article deleted.');
    }
}
