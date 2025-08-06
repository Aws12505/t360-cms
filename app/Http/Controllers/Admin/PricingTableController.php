<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingTable;
use App\Models\PricingTableContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingTableController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/PricingTables/Index', [
            'tables' => PricingTable::withCount('contents')->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/PricingTables/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255'
        ]);

        PricingTable::create($validated);

        return redirect()
            ->route('admin.pricing-tables.index')
            ->with('success', 'Pricing table created successfully.');
    }

    public function edit(PricingTable $pricingTable)
{
    $safetyContents = $pricingTable->contents()
        ->where('is_safety', true)
        ->paginate(10, ['*'], 'safety_page');
    
    $regularContents = $pricingTable->contents()
        ->where('is_safety', false)
        ->paginate(10, ['*'], 'regular_page');

    return Inertia::render('Admin/PricingTables/Edit', [
        'table' => $pricingTable->only(['id', 'title']),
        'safetyContents' => $safetyContents,
        'regularContents' => $regularContents,
    ]);
}

    public function update(Request $request, PricingTable $pricingTable)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $pricingTable->update($validated);

        return back()->with('success', 'Table updated successfully.');
    }

    public function destroy(PricingTable $pricingTable)
    {
        $pricingTable->delete();

        return redirect()
            ->route('admin.pricing-tables.index')
            ->with('success', 'Table deleted successfully.');
    }

    // Content management methods
    public function storeContent(Request $request, PricingTable $pricingTable)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'description' => 'required|string',
            'is_safety' => 'boolean'
        ]);

        $pricingTable->contents()->create($validated);

        return back()->with('success', 'Content added successfully.');
    }

    public function updateContent(Request $request, PricingTableContent $content)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'description' => 'required|string',
            'is_safety' => 'boolean'
        ]);

        $content->update($validated);

        return back()->with('success', 'Content updated successfully.');
    }

    public function destroyContent(PricingTableContent $content)
    {
        $content->delete();

        return back()->with('success', 'Content deleted successfully.');
    }
}
