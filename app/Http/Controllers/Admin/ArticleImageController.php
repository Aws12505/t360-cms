<?php

/* app/Http/Controllers/Admin/ArticleImageController.php */
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticleImage;
use Illuminate\Support\Facades\Storage;

class ArticleImageController extends Controller
{
    public function destroy(ArticleImage $articleImage)
    {
        Storage::disk('public')->delete($articleImage->image_path);
        $articleImage->delete();

        return back()->with('success','Image removed.');
    }
}
