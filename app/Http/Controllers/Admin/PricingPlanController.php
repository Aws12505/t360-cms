<?php
// app/Http/Controllers/Admin/PricingPlanController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingPlan;
use App\Models\CustomPlanFeature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingPlanController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/PricingPlans/Index', [
            'plans' => PricingPlan::ordered()
                ->orderBy('is_best_value', 'desc')
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/PricingPlans/Create', [
            'allFeatures' => CustomPlanFeature::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'total_value'     => 'nullable|numeric|min:0',
            'per_text'        => 'nullable|string|max:100',
            'description'     => 'required|string',
            'features'        => 'nullable|string',
            'is_customizable' => 'boolean',
            'is_best_value'   => 'boolean',
            'order'           => 'integer|min:0',
            'feature_ids'     => 'array',
            'feature_ids.*'   => 'exists:custom_plan_features,id',
            'button_link'     => 'nullable|string|max:500',
            'button_text'     => 'nullable|string|max:100',
            'highlighted_text' => 'nullable|string',
            'button_bg_color' => 'nullable|string|regex:/^#[0-9A-F]{6}$/i',
            'total_value_bg_color' => 'nullable|string|regex:/^#[0-9A-F]{6}$/i',
        ]);

        if (!($validated['is_customizable'] ?? false)) {
            $request->validate(['total_value' => 'required|numeric|min:0']);
        } else {
            $validated['total_value'] = null;
            $validated['per_text']    = null;
        }

        if ($validated['is_best_value'] ?? false) {
            PricingPlan::where('is_best_value', true)->update(['is_best_value' => false]);
        }

        $plan = PricingPlan::create($validated);
        $plan->customFeatures()->sync($validated['feature_ids'] ?? []);

        return to_route('admin.pricing-plans.index')
               ->with('success','Pricing plan created.');
    }

    public function edit(PricingPlan $pricingPlan)
    {
        return Inertia::render('Admin/PricingPlans/Edit', [
            'plan' => $pricingPlan->load('customFeatures'),
            'allFeatures' => CustomPlanFeature::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, PricingPlan $pricingPlan)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'total_value'     => 'nullable|numeric|min:0',
            'per_text'        => 'nullable|string|max:100',
            'description'     => 'required|string',
            'features'        => 'nullable|string',
            'is_customizable' => 'boolean',
            'is_best_value'   => 'boolean',
            'order'           => 'integer|min:0',
            'feature_ids'     => 'array',
            'feature_ids.*'   => 'exists:custom_plan_features,id',
            'button_link'     => 'nullable|string|max:500',
            'button_text'     => 'nullable|string|max:100',
            'highlighted_text' => 'nullable|string',
            'button_bg_color' => 'nullable|string|regex:/^#[0-9A-F]{6}$/i',
            'total_value_bg_color' => 'nullable|string|regex:/^#[0-9A-F]{6}$/i',
        ]);

        if (!($validated['is_customizable'] ?? false)) {
            $request->validate(['total_value' => 'required|numeric|min:0']);
        } else {
            $validated['total_value'] = null;
            $validated['per_text']    = null;
        }

        if ($validated['is_best_value'] ?? false) {
            PricingPlan::where('is_best_value', true)
                ->where('id','!=',$pricingPlan->id)
                ->update(['is_best_value' => false]);
        }

        $pricingPlan->update($validated);
        $pricingPlan->customFeatures()->sync($validated['feature_ids'] ?? []);

        return to_route('admin.pricing-plans.index')
               ->with('success','Pricing plan updated.');
    }

    public function destroy(PricingPlan $pricingPlan)
    {
        $pricingPlan->delete();

        return redirect()
            ->route('admin.pricing-plans.index')
            ->with('success', 'Pricing plan deleted successfully.');
    }
}
