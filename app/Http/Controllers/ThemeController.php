<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function toggle(Request $request)
    {
        $newTheme = $request->input('theme') === 'dark' ? 'dark' : 'light';
        $user = User::find($request->input('user_id'));
        if ($user) {
            $user->theme = $newTheme;
            $user->save();
        }

        return back();
    }
}
