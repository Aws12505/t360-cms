<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeaderSetting;
use App\Models\FooterSetting;
use App\Models\HeroSection;
use App\Models\VideoSection;
use App\Models\Slider;
use App\Models\Faq;
use App\Models\MeetingSection;
use App\Models\FormSection;
use App\Models\PricingPlan;
use App\Models\PricingTable;
use App\Models\PricingBooking;
use App\Models\Article;
use Illuminate\Support\Str;

class WebsiteController extends Controller
{
    /**
     * Make a full URL to a file stored under /storage using APP_URL.
     */
    private function storageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $clean = ltrim($path, '/');

        // Already absolute? leave it as-is.
        if (Str::startsWith($clean, ['http://', 'https://'])) {
            return $path;
        }

        // If it already begins with "storage/", don't double it.
        if (Str::startsWith($clean, 'storage/')) {
            return asset($clean);
        }

        return asset('storage/' . $clean);
    }

    /**
     * Recursively walk an array (or model->toArray()) and append APP_URL/storage
     * to keys that look like media fields (image/logo/icon/video/file/path/url/thumbnail/background/banner).
     */
    private function transformMedia($payload)
    {
        if (is_null($payload)) {
            return $payload;
        }

        if (is_array($payload)) {
            foreach ($payload as $key => $value) {
                if (is_array($value)) {
                    $payload[$key] = $this->transformMedia($value);
                    continue;
                }

                // Only attempt to transform string-ish fields
                if (is_string($value)) {
                    $keyLower = strtolower((string) $key);

                    $looksLikeMediaKey =
                        Str::contains($keyLower, ['image', 'video', 'logo', 'icon', 'favicon', 'thumbnail', 'banner', 'background'])
                        || Str::endsWith($keyLower, ['_file', '_path', '_url']);

                    if ($looksLikeMediaKey) {
                        $payload[$key] = $this->storageUrl($value);
                    }
                }
            }

            return $payload;
        }

        // If it's a model/collection, try toArray() if available
        if (is_object($payload) && method_exists($payload, 'toArray')) {
            return $this->transformMedia($payload->toArray());
        }

        return $payload;
    }

    /**
     * General data - Header & Footer
     */
    public function general()
    {
        try {
            $header = HeaderSetting::first();
            $footer = FooterSetting::first();

            return response()->json([
                'success' => true,
                'data' => [
                    'header' => $this->transformMedia($header ? $header->toArray() : null),
                    'footer' => $this->transformMedia($footer ? $footer->toArray() : null),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch general data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Homepage data
     */
    public function homepage()
    {
        try {
            $hero = HeroSection::with('animatedTexts')->first();
            $video = VideoSection::first();
            $sliders = Slider::ordered()->get();
            $faqs = Faq::forPage('home')->ordered()->get();
            $meeting = MeetingSection::first();
            $form = FormSection::first();

            return response()->json([
                'success' => true,
                'data' => [
                    'hero' => [
                        'title' => $hero?->title,
                        'description' => $hero?->description,
                        'image' => $this->storageUrl($hero?->image),
                        'animated_texts' => $hero?->animatedTexts?->pluck('text') ?? [],
                    ],
                    'video' => [
                        'title' => $video?->title,
                        'description' => $video?->description,
                        'video' => $this->storageUrl($video?->video),
                    ],
                    'sliders' => $sliders->map(function ($slider) {
                        return [
                            'id' => $slider->id,
                            'title' => $slider->title,
                            'description' => $slider->description,
                            'features' => $slider->features,
                            'order' => $slider->order,
                            'image' => $this->storageUrl($slider->image),
                        ];
                    }),
                    'faqs' => $faqs->map(function ($faq) {
                        return [
                            'id' => $faq->id,
                            'title' => $faq->title,
                            'description' => $faq->description,
                            'order' => $faq->order,
                        ];
                    }),
                    'meeting' => [
                        'title' => $meeting?->title,
                        'description' => $meeting?->description,
                        'btn_name' => $meeting?->btn_name,
                        'btn_link' => $meeting?->btn_link,
                        'image' => $this->storageUrl($meeting?->image),
                    ],
                    'form' => [
                        'title' => $form?->title,
                        'description' => $form?->description,
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch homepage data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Pricing page data
     */
    public function pricing()
    {
        try {
            $plans = PricingPlan::with('customFeatures')->get();
            $tables = PricingTable::with('contents')->get();
            $booking = PricingBooking::first();
            $faqs = Faq::forPage('pricing')->ordered()->get();

            // Format plans based on customizable vs fixed
            $formattedPlans = $plans->map(function ($plan) {
                $planData = [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'description' => $plan->description,
                    'features' => $plan->features, // small text summary
                    'is_customizable' => $plan->is_customizable,
                    'is_best_value' => $plan->is_best_value,
                    'order' => $plan->order,
                ];

                if ($plan->is_customizable) {
                    // Customizable plan - show features with individual prices
                    $planData['total_value'] = null;
                    $planData['per_text'] = null;
                    $planData['custom_features'] = $plan->customFeatures->map(function ($feature) {
                        return [
                            'id' => $feature->id,
                            'name' => $feature->name,
                            'price' => $feature->price,
                        ];
                    });
                } else {
                    // Fixed plan - show total price, features without individual prices
                    $planData['total_value'] = $plan->total_value;
                    $planData['per_text'] = $plan->per_text;
                    $planData['custom_features'] = $plan->customFeatures->pluck('name');
                }

                return $planData;
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'plans' => $formattedPlans,
                    'tables' => $tables->map(function ($table) {
                        return [
                            'id' => $table->id,
                            'title' => $table->title,
                            'contents' => $table->contents->map(function ($content) {
                                return [
                                    'id' => $content->id,
                                    'service_name' => $content->service_name,
                                    'description' => $content->description,
                                    'is_safety' => $content->is_safety,
                                ];
                            }),
                        ];
                    }),
                    'faqs' => $faqs->map(function ($faq) {
                        return [
                            'id' => $faq->id,
                            'title' => $faq->title,
                            'description' => $faq->description,
                            'order' => $faq->order,
                        ];
                    }),
                    'booking' => [
                        'title' => $booking?->title,
                        'description' => $booking?->description,
                        'btn_name' => $booking?->btn_name,
                        'btn_link' => $booking?->btn_link,
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pricing data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Newsletter data - Articles with images
     */
    public function newsletter()
    {
        try {
            $articles = Article::active()
                ->with('images')
                ->orderBy('custom_date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'articles' => $articles->map(function ($article) {
                        return [
                            'id' => $article->id,
                            'title' => $article->title,
                            'description' => $article->description,
                            'featured_image' => $this->storageUrl($article->featured_image),
                            'custom_date' => $article->custom_date?->format('Y-m-d'),
                            'content' => $article->content,
                            'images' => $article->images->map(function ($image) {
                                return [
                                    'id' => $image->id,
                                    'image_url' => $this->storageUrl($image->image_path),
                                    'alt_text' => $image->alt_text,
                                ];
                            }),
                        ];
                    }),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch newsletter data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
