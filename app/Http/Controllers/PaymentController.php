<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Payment;
use App\Models\Warga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        // Menampilkan histori pembayaran milik warga tersebut
        $payments = Payment::where('user_id', Auth::id())->latest()->get();
        return Inertia::render('Payments/Index', [
            'payments' => $payments
        ]);
    }

    public function create()
    {
        return Inertia::render('Payments/Create', [
            'wargas' => Warga::orderBy('nama')->get(['id', 'nama', 'no_rumah'])
        ]);
    }

    public function adminIndex()
    {
        // Mengambil semua pembayaran yang pending untuk diverifikasi
        $payments = Payment::with('user')->latest()->get();
        return Inertia::render('Admin/Payments', [
            'payments' => $payments
        ]);
    }

    public function approve(Request $request)
    {
        // Ambil proof_image dari body request
        $proofImage = $request->input('proof_image');

        if (!$proofImage) {
            return back()->with('error', 'Bukti gambar tidak ditemukan.');
        }

        // Update semua yang gambarnya sama
        Payment::where('proof_image', $proofImage)
            ->where('status', 'pending')
            ->update(['status' => 'approved']);

        return back()->with('success', 'Pembayaran berhasil disetujui.');
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'type' => 'required|in:kas,sumbangan',
    //         'amount' => 'required|numeric|min:1000',
    //         'proof_image' => 'required|image|mimes:jpg,png,jpeg|max:2048',
    //     ]);

    //     $path = $request->file('proof_image')->store('payments', 'public');

    //     if ($request->type === 'kas') {
    //         // --- LOGIKA IURAN KAS (AUTO-SPLIT) ---
    //         $user = Auth::user();
    //         $iuranPerBulan = 50000;
    //         $jumlahBulan = floor($request->amount / $iuranPerBulan);
    //         $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    //         $currentYear = (int)date('Y');
    //         $countCreated = 0;

    //         while ($countCreated < $jumlahBulan) {
    //             foreach ($months as $month) {
    //                 if ($countCreated < $jumlahBulan) {
    //                     $exists = Payment::where('user_id', $user->id)
    //                         ->where('month', $month)
    //                         ->where('year', $currentYear)
    //                         ->whereIn('status', ['pending', 'approved'])
    //                         ->exists();

    //                     if (!$exists) {
    //                         Payment::create([
    //                             'user_id' => $user->id,
    //                             'month' => $month,
    //                             'year' => $currentYear,
    //                             'amount' => $iuranPerBulan,
    //                             'proof_image' => $path,
    //                             'status' => 'pending',
    //                         ]);
    //                         $countCreated++;
    //                     }
    //                 }
    //             }
    //             $currentYear++;
    //             if ($currentYear > (int)date('Y') + 10) break;
    //         }
    //     } else {
    //         // --- LOGIKA SUMBANGAN ---
    //         Donation::create([
    //             'user_id'     => Auth::id(), // Mengambil ID dari objek user yang login
    //             'amount'      => $request->amount,
    //             'description' => $request->description,
    //             'proof_image' => $path,
    //         ]);
    //     }

    //     return redirect()->route('dashboard')->with('success', 'Pembayaran berhasil dikirim dan menunggu verifikasi.');
    // }
    public function store(Request $request)
    {
        // 1. Validasi dinamis tergantung tipe
        $request->validate([
            'type' => 'required|in:kas,sumbangan',
            'warga_id' => 'required|exists:wargas,id',
            'amount' => $request->type === 'kas' ? 'required|numeric|min:50000' : 'required|numeric|min:1000',
            'description' => $request->type === 'sumbangan' ? 'required|string|max:255' : 'nullable',
            'proof_image' => 'nullable|image|max:2048',
        ]);

        // 2. Upload gambar jika ada
        $path = $request->hasFile('proof_image')
            ? $request->file('proof_image')->store('payments', 'public')
            : null;

        if ($request->type === 'kas') {
            // --- LOGIKA IURAN KAS (AUTO-FILL BULAN KOSONG) ---
            $iuranPerBulan = 50000;
            $jumlahBulan = floor($request->amount / $iuranPerBulan);
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

            $currentYear = (int)date('Y');
            $countCreated = 0;

            while ($countCreated < $jumlahBulan) {
                foreach ($months as $month) {
                    if ($countCreated < $jumlahBulan) {
                        // Cek apakah warga sudah bayar di bulan & tahun ini
                        $exists = Payment::where('warga_id', $request->warga_id)
                            ->where('month', $month)
                            ->where('year', $currentYear)
                            ->whereIn('status', ['pending', 'approved'])
                            ->exists();

                        if (!$exists) {
                            Payment::create([
                                'warga_id'    => $request->warga_id,
                                'month'       => $month,
                                'year'        => $currentYear,
                                'amount'      => $iuranPerBulan,
                                'proof_image' => $path,
                                'status'      => 'approved', // Bendahara yang input langsung lunas
                            ]);
                            $countCreated++;
                        }
                    }
                }
                $currentYear++;
                if ($currentYear > (int)date('Y') + 5) break;
            }

            $message = "Berhasil mencatat iuran kas untuk $countCreated bulan.";
        } else {
            // --- LOGIKA SUMBANGAN ---
            Donation::create([
                'warga_id'    => $request->warga_id,
                'user_id'     => Auth::id(),
                'amount'      => $request->amount,
                'description' => $request->description,
                'proof_image' => $path,
            ]);

            $message = "Berhasil mencatat sumbangan dari warga.";
        }

        return redirect()->route('dashboard')->with('success', $message);
    }
}
