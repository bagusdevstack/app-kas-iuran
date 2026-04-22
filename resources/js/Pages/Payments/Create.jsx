import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Create({ auth, wargas }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'kas',        // Tambahkan tipe: 'kas' atau 'sumbangan'
        warga_id: '',
        amount: 50000,
        description: '',    // Untuk keterangan sumbangan
        proof_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('pembayaran.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Input Transaksi Kas</h2>}>
            <Head title="Input Pembayaran" />

            <div className="py-12 max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header Tab-like selector */}
                    <div className="flex border-b">
                        <button
                            type="button"
                            onClick={() => setData('type', 'kas')}
                            className={`flex-1 py-4 text-sm font-bold transition-all ${data.type === 'kas' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                        >
                            💰 IURAN KAS
                        </button>
                        <button
                            type="button"
                            onClick={() => setData('type', 'sumbangan')}
                            className={`flex-1 py-4 text-sm font-bold transition-all ${data.type === 'sumbangan' ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                        >
                            🎁 SUMBANGAN / DONASI
                        </button>
                    </div>

                    <form onSubmit={submit} className="p-8 space-y-6">
                        {/* CARI WARGA */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Warga / No Rumah</label>
                            <input
                                list="warga-list"
                                placeholder="Cari nama atau no rumah..."
                                className="w-full border-gray-300 rounded-xl focus:ring-blue-500 shadow-sm"
                                autoComplete="off"
                                onChange={(e) => {
                                    const selected = wargas.find(w => `${w.no_rumah} - ${w.nama}` === e.target.value);
                                    if (selected) setData('warga_id', selected.id);
                                }}
                            />
                            <datalist id="warga-list">
                                {wargas.map(w => (
                                    <option key={w.id} value={`${w.no_rumah} - ${w.nama}`} />
                                ))}
                            </datalist>
                            {errors.warga_id && <p className="text-red-500 text-[10px] mt-1">{errors.warga_id}</p>}
                        </div>

                        {/* NOMINAL */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Total Nominal (Rp)</label>
                            <input
                                type="number"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                className={`w-full border-gray-300 rounded-xl font-bold text-2xl focus:ring-opacity-50 ${data.type === 'kas' ? 'text-blue-600 focus:ring-blue-500' : 'text-emerald-600 focus:ring-emerald-500'}`}
                                placeholder="50000"
                            />
                            {data.type === 'kas' ? (
                                <p className="text-[10px] text-blue-400 mt-2 italic">💡 Pelunasan bulan kosong akan diisi otomatis.</p>
                            ) : (
                                <p className="text-[10px] text-emerald-400 mt-2 italic">💡 Donasi akan masuk ke laporan pendapatan sumbangan.</p>
                            )}
                        </div>

                        {/* DESKRIPSI (Hanya muncul jika Sumbangan) */}
                        {data.type === 'sumbangan' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Keterangan Sumbangan</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl focus:ring-emerald-500 shadow-sm"
                                    placeholder="Contoh: Sumbangan Fogging atau Santunan..."
                                    rows="2"
                                />
                                {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description}</p>}
                            </div>
                        )}

                        {/* BUKTI FOTO */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bukti Pembayaran (Wajib)</label>
                            <input
                                type="file"
                                onChange={e => setData('proof_image', e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />
                        </div>

                        <button
                            disabled={processing}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${data.type === 'kas' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
                        >
                            {processing ? 'Menyimpan...' : 'Catat Transaksi'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}