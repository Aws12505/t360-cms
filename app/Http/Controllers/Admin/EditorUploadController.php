<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Image uploads from the rich text editor. Images are stored as files and referenced
 * by URL, instead of being embedded as base64 inside the HTML.
 */
class EditorUploadController extends Controller
{
    private const MAX_WIDTH = 1920;

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:8192',
        ]);

        $file = $request->file('image');
        $extension = strtolower($file->guessExtension() ?: $file->getClientOriginalExtension());
        $path = 'uploads/editor/' . now()->format('Y/m') . '/' . Str::random(24) . '.' . $extension;

        $contents = $this->downscale($file->getRealPath(), $extension) ?? file_get_contents($file->getRealPath());
        Storage::disk('public')->put($path, $contents);

        [$width, $height] = @getimagesizefromstring($contents) ?: [null, null];

        return response()->json([
            'url' => asset('storage/' . $path),
            'width' => $width,
            'height' => $height,
        ]);
    }

    /**
     * Shrink very large photos with GD so posts stay fast. Returns null when no resize is needed or possible.
     */
    private function downscale(string $realPath, string $extension): ?string
    {
        if (!function_exists('imagecreatetruecolor') || !in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            return null;
        }

        [$width, $height] = @getimagesize($realPath) ?: [0, 0];
        if ($width <= self::MAX_WIDTH || $width === 0) {
            return null;
        }

        $source = match ($extension) {
            'png' => @imagecreatefrompng($realPath),
            'webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($realPath) : false,
            default => @imagecreatefromjpeg($realPath),
        };
        if (!$source) {
            return null;
        }

        $newHeight = (int) round($height * self::MAX_WIDTH / $width);
        $target = imagecreatetruecolor(self::MAX_WIDTH, $newHeight);
        if ($extension !== 'jpg' && $extension !== 'jpeg') {
            imagealphablending($target, false);
            imagesavealpha($target, true);
        }
        imagecopyresampled($target, $source, 0, 0, 0, 0, self::MAX_WIDTH, $newHeight, $width, $height);

        ob_start();
        match ($extension) {
            'png' => imagepng($target, null, 8),
            'webp' => imagewebp($target, null, 82),
            default => imagejpeg($target, null, 82),
        };
        $output = ob_get_clean();

        imagedestroy($source);
        imagedestroy($target);

        return $output ?: null;
    }
}
