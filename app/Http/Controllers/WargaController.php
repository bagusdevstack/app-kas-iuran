<?php

namespace App\Http\Controllers;

use App\Models\Warga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WargaController extends Controller
{
    public function index()
    {
        return Inertia::render('Warga/Index', [
            'wargas' => Warga::orderBy('no_rumah', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'no_rumah' => 'required|string|max:50',
            'blok' => 'nullable|string|max:10',
            'no_telp' => 'nullable|string|max:20',
        ]);

        Warga::create($request->all());

        return redirect()->back()->with('success', 'Data warga berhasil ditambahkan!');
    }

    public function update(Request $request, Warga $warga)
    {
        $warga->update($request->all());
        return redirect()->back()->with('success', 'Data warga berhasil diubah!');
    }

    public function destroy(Warga $warga)
    {
        $warga->delete();
        return redirect()->back()->with('success', 'Data warga berhasil dihapus!');
    }
}
