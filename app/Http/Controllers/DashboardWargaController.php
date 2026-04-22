<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\User;
use App\Models\Warga;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardWargaController extends Controller
{
    public function index(Request $request)
    {
        $year = (int) $request->query('year', date('Y'));

        // --- 1. HITUNG SALDO AWAL (Saldo dari tahun-tahun sebelumnya) ---
        $iuranLalu = Payment::where('year', '<', $year)->where('status', 'approved')->sum('amount');
        $donasiLalu = Donation::whereYear('created_at', '<', $year)->sum('amount');
        $expenseLalu = Expense::whereYear('date', '<', $year)->sum('amount');

        $saldoAwal = ($iuranLalu + $donasiLalu) - $expenseLalu;

        // --- 2. DATA TAHUN BERJALAN ---

        // Ambil donasi tahun ini dengan relasi warga
        $donations = Donation::with(['warga', 'user'])
            ->whereYear('created_at', $year)
            ->get();

        // Ambil pengeluaran tahun ini
        $expenses = Expense::whereYear('date', $year)->get();

        // Nominal-nominal untuk ringkasan tahunan
        $iuranTahunIni = Payment::where('year', $year)->where('status', 'approved')->sum('amount');
        $donasiTahunIni = $donations->sum('amount');
        $expenseTahunIni = $expenses->sum('amount');

        $totalPemasukanTahunIni = $iuranTahunIni + $donasiTahunIni;
        $saldoAkhirTahunIni = $saldoAwal + $totalPemasukanTahunIni - $expenseTahunIni;

        // --- 3. DATA GLOBAL (Uang Riil Saat Ini di Kas) ---
        $totalIuranGlobal = Payment::where('status', 'approved')->sum('amount');
        $totalDonasiGlobal = Donation::sum('amount');
        $totalExpenseGlobal = Expense::sum('amount');
        $saldoGlobal = ($totalIuranGlobal + $totalDonasiGlobal) - $totalExpenseGlobal;

        // --- 4. FORMAT DATA TABEL IURAN WARGA ---
        $reportTable = Warga::with(['payments' => function ($query) use ($year) {
            $query->where('year', $year)->where('status', 'approved');
        }])->get();

        $formattedTable = $reportTable->map(function ($w) {
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            $monthsStatus = [];
            foreach ($months as $month) {
                $monthsStatus[$month] = $w->payments->contains('month', $month);
            }
            return [
                'id' => $w->id,
                'name' => $w->nama,
                'no_rumah' => $w->no_rumah,
                'blok' => $w->blok,
                'months' => $monthsStatus
            ];
        });

        // --- 5. OPSI TAHUN UNTUK FILTER ---
        $availableYears = Payment::select('year')->distinct()->orderBy('year', 'asc')->pluck('year')->toArray();
        $yearOptions = array_unique(array_merge([date('Y'), date('Y') + 1], $availableYears));
        sort($yearOptions);

        return Inertia::render('Dashboard', [
            'reportTable' => $formattedTable,
            'expenses'    => $expenses,
            'donations'   => $donations,
            'currentYear' => $year,
            'yearOptions' => $yearOptions,
            'summary' => [
                // Info Saldo Pindahan
                'saldoAwal' => (float)$saldoAwal,

                // Info Tahun Berjalan
                'iuranTahunIni' => (float)$iuranTahunIni,
                'donasiTahunIni' => (float)$donasiTahunIni,
                'totalIncomePerYear' => (float)$totalPemasukanTahunIni,
                'totalExpensePerYear' => (float)$expenseTahunIni,
                'saldoAkhirTahunIni' => (float)$saldoAkhirTahunIni,

                // Info Keseluruhan (Kas di Tangan)
                'saldoGlobal' => (float)$saldoGlobal,
            ]
        ]);
    }

    public function exportPDF(Request $request)
    {
        $year = (int) $request->query('year', date('Y'));
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        // --- 1. LOGIKA SALDO (Sama dengan Dashboard) ---
        $iuranLalu = Payment::where('year', '<', $year)->where('status', 'approved')->sum('amount');
        $donasiLalu = Donation::whereYear('created_at', '<', $year)->sum('amount');
        $expenseLalu = Expense::whereYear('date', '<', $year)->sum('amount');

        $saldoAwal = ($iuranLalu + $donasiLalu) - $expenseLalu;

        // --- 2. DATA TRANSAKSI TAHUN TERKAIT ---
        $donations = Donation::with(['warga', 'user'])
            ->whereYear('created_at', $year)
            ->get();

        $expenses = Expense::whereYear('date', $year)->get();

        $iuranTahunIni = Payment::where('year', $year)->where('status', 'approved')->sum('amount');
        $donasiTahunIni = $donations->sum('amount');
        $expenseTahunIni = $expenses->sum('amount');

        $saldoAkhirTahunIni = $saldoAwal + $iuranTahunIni + $donasiTahunIni - $expenseTahunIni;

        // --- 3. DATA TABEL IURAN ---
        $wargas = Warga::with(['payments' => function ($query) use ($year) {
            $query->where('year', $year)->where('status', 'approved');
        }])->get();

        $reportTable = $wargas->map(function ($w) use ($months) {
            $monthStatus = [];
            foreach ($months as $m) {
                $monthStatus[$m] = $w->payments->contains('month', $m);
            }
            return [
                'name' => $w->nama,
                'no_rumah' => $w->no_rumah,
                'blok' => $w->blok,
                'months' => $monthStatus
            ];
        });

        // --- 4. PREPARE DATA UNTUK VIEW ---
        $data = [
            'year'         => $year,
            'months'       => $months,
            'reportTable'  => $reportTable,
            'donations'    => $donations,
            'expenses'     => $expenses,
            'summary'      => [
                'saldoAwal'           => $saldoAwal,
                'iuranTahunIni'       => $iuranTahunIni,
                'donasiTahunIni'      => $donasiTahunIni,
                'totalExpenseTahunIni' => $expenseTahunIni,
                'saldoAkhirTahunIni'  => $saldoAkhirTahunIni,
            ]
        ];

        $pdf = Pdf::loadView('reports.kas_pdf', $data)->setPaper('a4', 'landscape');

        return $pdf->download("Laporan-Kas-RT-$year.pdf");
    }

    public function exportCSV(Request $request)
    {
        $year = $request->query('year', date('Y'));
        $expenses = Expense::whereYear('date', $year)->get();

        $callback = function () use ($expenses) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Tanggal', 'Keterangan', 'Nominal']);
            foreach ($expenses as $exp) {
                fputcsv($file, [$exp->date, $exp->description, $exp->amount]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Laporan-Pengeluaran-$year.csv",
        ]);
    }
}
