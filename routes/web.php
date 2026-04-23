<?php

use App\Http\Controllers\DashboardWargaController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WargaController;
use App\Models\Donation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login');

use App\Models\Payment;
use App\Models\Expense;

Route::middleware(['auth', 'bendahara'])->group(function () {
    Route::get('/admin-dashboard', function () {
        // Ambil tahun saat ini untuk filter
        $currentYear = date('Y');

        // 1. Ambil iuran
        $payments = Payment::with('user')->get();

        // 2. Ambil pengeluaran
        $expenses = Expense::all();

        // 3. UPDATE DI SINI: Ambil sumbangan + Relasi User + Filter Tahun
        $donations = Donation::with('user') // <--- INI WAJIB ADA
            ->whereYear('created_at', $currentYear)
            ->get();

        // Logika Saldo (Tetap pastikan menghitung sumbangan juga)
        $totalIuran = Payment::where('status', 'approved')->sum('amount');
        $totalSumbangan = \App\Models\Donation::sum('amount');
        $totalKeluar = Expense::sum('amount');

        return Inertia::render('Admin/Dashboard', [
            'payments' => $payments,
            'expenses' => $expenses,
            'donations' => $donations, // Data ini yang dikirim ke React
            'totalKas' => ($totalIuran + $totalSumbangan) - $totalKeluar
        ]);
    })->name('admin.dashboard');

    Route::get('/pembayaran/create', [PaymentController::class, 'create'])->name('pembayaran.create');
    Route::post('/payments', [PaymentController::class, 'store'])->name('pembayaran.store');
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');

    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::post('/admin/payments/approve', [PaymentController::class, 'approve'])->name('admin.payments.approve');
    Route::get('/laporan/pdf', [DashboardWargaController::class, 'exportPDF'])->name('laporan.pdf');
    Route::get('/laporan/csv', [DashboardWargaController::class, 'exportCSV'])->name('laporan.csv');
});


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardWargaController::class, 'index'])->name('dashboard');
    Route::get('/laporan/bendahara', [DashboardWargaController::class, 'index'])->name('laporan.kas');
    Route::resource('warga', WargaController::class);

    // Route Profile (bawaan breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
