<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Tambahkan ini agar Auth dikenali
use Symfony\Component\HttpFoundation\Response;

class EnsureIsBendahara
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah user sudah login
        // 2. Cek apakah role-nya adalah bendahara
        if (!Auth::check() || Auth::user()->role !== 'bendahara') {
            return redirect('/dashboard')->with('error', 'Akses ditolak! Anda bukan bendahara.');
        }

        return $next($request);
    }
}
