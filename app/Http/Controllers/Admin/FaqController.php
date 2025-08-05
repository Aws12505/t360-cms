<?php

// app/Http/Controllers/Admin/FaqController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->get('page', 'home');
        
        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => Faq::forPage($page)->ordered()->get(),
            'currentPage' => $page,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Admin/Faqs/Create', [
            'selectedPage' => $request->get('page', 'home'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'page'        => 'required|in:home,pricing',
            'order'       => 'integer|min:0',
        ]);

        Faq::create($validated);

        return redirect()
            ->route('admin.faqs.index', ['page' => $validated['page']])
            ->with('success', 'FAQ created successfully.');
    }

    public function edit(Faq $faq)
    {
        return Inertia::render('Admin/Faqs/Edit', [
            'faq' => $faq,
        ]);
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'page'        => 'required|in:home,pricing',
            'order'       => 'integer|min:0',
        ]);

        $faq->update($validated);

        return redirect()
            ->route('admin.faqs.index', ['page' => $validated['page']])
            ->with('success', 'FAQ updated successfully.');
    }

    public function destroy(Faq $faq)
    {
        $page = $faq->page;
        $faq->delete();

        return redirect()
            ->route('admin.faqs.index', ['page' => $page])
            ->with('success', 'FAQ deleted successfully.');
    }
}
