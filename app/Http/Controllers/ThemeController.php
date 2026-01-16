<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeController extends Controller
{
    public function toggle(Request $request)
    {
        $user = $request->user();

        // Toggle between light and dark
        $newTheme = $user->theme === 'light' ? 'dark' : 'light';

        $user->update(['theme' => $newTheme]);

        return back();
    }
}
