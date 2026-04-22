import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function Dashboard({ auth, reportTable, expenses = [], donations = [], summary, currentYear, yearOptions = [] }) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    console.log("Data:", summary);

    // Fungsi untuk mengganti tahun
    const handleYearChange = (e) => {
        router.get(route('dashboard'), { year: e.target.value }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Kas RT</h2>}
        >
            <Head title="Dashboard Laporan Kas" />

            <div className="py-12 px-4 max-w-7xl mx-auto space-y-8">

                {/* HEADER & FILTER TAHUN */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Transparansi Kas Digital</h3>
                        <p className="text-sm text-gray-500">Menampilkan laporan iuran dan pengeluaran tahun {currentYear}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                        <label className="text-sm font-semibold text-gray-600">Periode Tahun:</label>
                        <select
                            value={currentYear}
                            onChange={handleYearChange}
                            className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 py-1"
                        >
                            {yearOptions.length > 0 ? (
                                yearOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))
                            ) : (
                                <option value={currentYear}>{currentYear}</option>
                            )}
                        </select>
                    </div>
                </div>

                {/* 1. WIDGET RINGKASAN KAS (SALDO) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {/* 1. SALDO AWAL (PINDAHAN) */}
                    <div className="bg-white border-l-4 border-amber-500 p-5 rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Saldo Pindahan ({currentYear - 1})</p>
                        <h2 className="text-2xl font-black text-gray-800 mt-1">
                            Rp {Number(summary?.saldoAwal || 0).toLocaleString('id-ID')}
                        </h2>
                        <p className="text-[10px] text-amber-600 mt-1 font-medium">*Saldo akhir tahun sebelumnya</p>
                    </div>

                    {/* 2. PEMASUKAN TAHUN INI */}
                    <div className="bg-white border-l-4 border-emerald-500 p-5 rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pemasukan Tahun {currentYear}</p>
                        <h2 className="text-2xl font-black text-emerald-600 mt-1">
                            + Rp {Number(summary?.totalIncomePerYear || 0).toLocaleString('id-ID')}
                        </h2>
                        <div className="flex gap-2 mt-1 text-[9px] font-bold uppercase">
                            <span className="text-blue-500">Iuran: {Number(summary?.iuranTahunIni || 0).toLocaleString('id-ID')}</span>
                            <span className="text-purple-500">Donasi: {Number(summary?.donasiTahunIni || 0).toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {/* 3. PENGELUARAN TAHUN INI */}
                    <div className="bg-white border-l-4 border-rose-500 p-5 rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pengeluaran Tahun {currentYear}</p>
                        <h2 className="text-2xl font-black text-rose-600 mt-1">
                            - Rp {Number(summary?.totalExpensePerYear || 0).toLocaleString('id-ID')}
                        </h2>
                        <p className="text-[10px] text-gray-400 mt-1 italic">Total biaya operasional & sosial</p>
                    </div>

                    {/* 4. SALDO AKHIR (UANG RIIL) */}
                    <div className="bg-blue-600 p-5 rounded-xl shadow-lg shadow-blue-100 ring-4 ring-blue-50">
                        <p className="text-xs text-blue-100 uppercase font-bold tracking-wider">Total Kas Riil (Saat Ini)</p>
                        <h2 className="text-2xl font-black text-white mt-1">
                            Rp {Number(summary?.saldoGlobal || 0).toLocaleString('id-ID')}
                        </h2>
                        <p className="text-[10px] text-blue-200 mt-1 font-medium">Sesuai dengan uang di tangan</p>
                    </div>
                </div>

                {/* TOMBAL EXPORT */}
                <div className="flex gap-2 mb-4">
                    <a
                        href={route('laporan.pdf', { year: currentYear })}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 2l4 4H11V4z" /></svg>
                        Export PDF
                    </a>
                    <a
                        href={route('laporan.csv', { year: currentYear })}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" /></svg>
                        Export CSV
                    </a>

                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                            `Halo, berikut adalah Laporan Iuran Kas Tahun ${currentYear}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition"
                    >
                        {/* Icon WhatsApp */}
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Share WhatsApp
                    </a>
                </div>

                {/* 2. TABEL REKAPITULASI IURAN WARGA */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-800">Buku Kas Umum {currentYear}</h3>
                        <div className="flex gap-3 text-[9px] font-bold uppercase">
                            <span className="flex items-center text-green-600">● Lunas</span>
                            <span className="flex items-center text-gray-300">○ Belum</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-xs text-center">
                            <thead className="bg-gray-50 text-gray-600 uppercase font-bold">
                                <tr>
                                    <th className="border-b p-4 text-left w-64">Keterangan / Nama Warga</th>
                                    <th className="border-b p-4 w-24">No/Bukti</th>
                                    {months.map(m => <th key={m} className="border-b p-2 w-12">{m}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">

                                {/* --- SEKSI 1: IURAN WARGA --- */}
                                <tr className="bg-blue-50/50">
                                    <td colSpan={14} className="p-2 text-left font-bold text-blue-700 italic px-4">1. Iuran Warga (Rp50.000/bln)</td>
                                </tr>
                                {reportTable && reportTable.map((warga, i) => (
                                    <tr key={`warga-${i}`} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 text-left font-semibold text-gray-700 px-4">
                                            {warga.name}
                                            {warga.role === 'bendahara' && <span className="ml-2 text-[8px] bg-amber-100 text-amber-600 px-1 rounded">Bendahara</span>}
                                        </td>
                                        <td className="p-3 text-gray-400 font-mono">Blok {warga.blok}{warga.no_rumah}</td>
                                        {months.map(m => (
                                            <td key={m} className={`p-2 text-sm ${warga.months[m] ? 'text-green-600 font-bold' : 'text-gray-200'}`}>
                                                {warga.months[m] ? '✔' : '○'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                {/* --- SEKSI 2: SUMBANGAN --- */}
                                <tr className="bg-amber-50/50 border-t-2 border-amber-100">
                                    <td colSpan={14} className="p-2 text-left font-bold text-amber-700 italic px-4">2. Sumbangan & Masukan Lainnya</td>
                                </tr>

                                {donations.length > 0 ? donations.map((don, idx) => {
                                    // Ambil index bulan (0-11) dari data donasi
                                    const donDate = new Date(don.date || don.created_at);
                                    const donMonthIndex = donDate.getMonth();

                                    return (
                                        <tr key={`don-${idx}`} className="hover:bg-amber-50/20 border-b border-gray-100 text-xs">
                                            <td className="p-4 border border-gray-300 text-left vertical-align-top">
                                                <div className="flex flex-col space-y-0.5">
                                                    {/* Nama - Rata Kiri */}
                                                    <div className="font-bold text-gray-800 leading-tight">
                                                        {don.warga?.nama || 'Warga'} - {don.warga?.blok}{don.warga?.no_rumah}
                                                    </div>

                                                    {/* Deskripsi - Rata Kiri & Kecil */}
                                                    <div className="text-[10px] text-gray-500 italic leading-tight">
                                                        {don.description || 'Sumbangan/Donasi'}
                                                    </div>

                                                    {/* Tanda Bukti - Rata Kiri & Kecil */}
                                                    {don.proof_image ? (
                                                        <a
                                                            href={`/storage/${don.proof_image}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[9px] text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                                                        >
                                                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Lihat Bukti
                                                        </a>
                                                    ) : (
                                                        <span className="text-[9px] text-gray-300 italic">Tanpa Bukti</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Looping 12 kolom bulan */}
                                            {months.map((m, mIdx) => (
                                                <td key={m} className="p-2 border border-gray-300 text-right">
                                                    {donMonthIndex === mIdx ? (
                                                        <span className="text-green-600 font-bold">
                                                            + {Number(don.amount).toLocaleString('id-ID')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={14} className="p-4 text-gray-400 italic text-center">
                                            Tidak ada data sumbangan tahun {currentYear}
                                        </td>
                                    </tr>
                                )}

                                {/* --- SEKSI 3: PENGELUARAN --- */}
                                <tr className="bg-red-50/50 border-t-2 border-red-100">
                                    <td colSpan={14} className="p-2 text-left font-bold text-red-700 italic px-4">3. Pengeluaran Kas RT</td>
                                </tr>
                                {expenses.length > 0 ? expenses.map((exp, idx) => {
                                    // Ambil index bulan (0-11) dari data pengeluaran
                                    const expDate = new Date(exp.date || exp.created_at);
                                    const expMonthIndex = expDate.getMonth();

                                    return (
                                        <tr key={`exp-${idx}`} className="hover:bg-red-50/20 text-xs">
                                            <td className="p-2 border border-gray-300 font-medium bg-red-50/30 text-left pl-4">
                                                {exp.description}
                                            </td>

                                            {/* Looping 12 bulan */}
                                            {months.map((m, mIdx) => (
                                                <td key={m} className="p-2 border border-gray-300 text-right">
                                                    {/* Jika index bulan sama, tampilkan nominalnya */}
                                                    {expMonthIndex === mIdx ? (
                                                        <span className="text-red-600 font-bold">
                                                            - {Number(exp.amount).toLocaleString('id-ID')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan={14} className="p-4 text-gray-400 italic">Tidak ada pengeluaran tahun {currentYear}</td></tr>
                                )}
                            </tbody>
                            <tfoot className="bg-gray-900 text-white font-black text-sm">
                                <tr>
                                    <td colSpan={2} className="p-4 text-left uppercase tracking-widest px-4">Saldo Akhir Kas</td>
                                    <td colSpan={12} className="p-4 text-right pr-10 text-xl font-mono">
                                        Rp {summary?.saldoAkhirTahunIni?.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}