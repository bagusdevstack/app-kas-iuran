import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Head } from "@inertiajs/react";

export default function PaymentPage({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'kas', // default ke bayar kas
        amount: '',
        proof_image: null,
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Pembayaran" />
            <div className="py-12 max-w-2xl mx-auto px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Pembayaran</h2>

                    <form onSubmit={submit} className="space-y-6">
                        {/* PILIHAN JENIS PEMBAYARAN */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Pilih Jenis Pembayaran</label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* <button
                                    type="button"
                                    onClick={() => setData('type', 'kas')}
                                    className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${data.type === 'kas'
                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                        : 'border-gray-100 bg-gray-50 text-gray-400'
                                        }`}
                                >
                                    Bayar Iuran Kas
                                </button> */}
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'sumbangan')}
                                    className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${data.type === 'sumbangan'
                                        ? 'border-amber-500 bg-amber-50 text-amber-600'
                                        : 'border-gray-100 bg-gray-50 text-gray-400'
                                        }`}
                                >
                                    Sumbangan
                                </button>
                            </div>
                        </div>

                        {/* INPUT NOMINAL */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                {data.type === 'kas' ? 'Jumlah Bayar (Kelipatan Rp50.000)' : 'Jumlah Sumbangan (Bebas)'}
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp</span>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500"
                                    placeholder={data.type === 'kas' ? 'Contoh: 150000' : 'Contoh: 20000'}
                                />
                            </div>
                            {data.type === 'kas' && (
                                <p className="text-[11px] text-gray-500 mt-2">
                                    *Pembayaran kas akan otomatis dialokasikan ke bulan-bulan yang belum lunas.
                                </p>
                            )}
                            {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
                        </div>

                        {data.type === 'sumbangan' && (
                            <div className="transition-all duration-300">
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Keterangan Sumbangan
                                </label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="block w-full border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Contoh: Sumbangan HUT RI Ke-77"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">
                                    *Tuliskan tujuan sumbangan agar bendahara mudah mencatat.
                                </p>
                                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                            </div>
                        )}

                        {/* UPLOAD BUKTI */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Unggah Bukti Transfer</label>
                            <input
                                type="file"
                                onChange={e => setData('proof_image', e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />
                            {errors.proof_image && <div className="text-red-500 text-xs mt-1">{errors.proof_image}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${data.type === 'kas' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-500 hover:bg-amber-600'
                                }`}
                        >
                            {processing ? 'Memproses...' : `Kirim ${data.type === 'kas' ? 'Iuran Kas' : 'Sumbangan'}`}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}