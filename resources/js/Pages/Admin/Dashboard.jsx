import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Dashboard({ auth, payments, expenses, totalKas }) {
    const { data, setData, post, reset, errors } = useForm({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    const submitExpense = (e) => {
        e.preventDefault();
        post(route('expenses.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleApprove = (proofImage) => {
        if (confirm('Setujui semua pembayaran dengan bukti ini?')) {
            router.post(route('admin.payments.approve'), {
                proof_image: proofImage // Mengirim string nama file
            });
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel Bendahara</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Ringkasan Kas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
                            <p className="text-sm opacity-80 text-black">Total Saldo Kas</p>
                            <h2 className="text-4xl font-bold text-black">Rp {totalKas.toLocaleString()}</h2>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500">Informasi Pembayaran</p>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {/* Logika untuk menghitung User unik */}
                                {[...new Set(
                                    payments
                                        .filter(p => p.status === 'approved')
                                        .map(p => p.user_id)
                                )].length} Warga Telah Bayar
                            </h2>
                        </div>
                    </div>

                    {/* Form Input Pengeluaran */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="font-bold text-lg mb-4 text-red-600">Catat Pengeluaran Baru</h3>
                        <form onSubmit={submitExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Keterangan (misal: Bayar Sampah)"
                                className="border rounded p-2"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Jumlah (Rp)"
                                className="border rounded p-2"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                            />
                            <input
                                type="date"
                                className="border rounded p-2"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                            />
                            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                                Simpan Pengeluaran
                            </button>
                        </form>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Tabel Verifikasi Pembayaran */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Menunggu Verifikasi (Pending)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50 text-left">
                                        <th className="p-3">Warga</th>
                                        <th className="p-3">No. Rumah</th>
                                        <th className="p-3">Bulan</th>
                                        <th className="p-3">Bukti</th>
                                        <th className="p-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(
                                        payments
                                            .filter(p => p.status === 'pending')
                                            .reduce((acc, curr) => {
                                                // Kelompokkan berdasarkan proof_image
                                                if (!acc[curr.proof_image]) {
                                                    acc[curr.proof_image] = { ...curr, all_months: [curr.month] };
                                                } else {
                                                    acc[curr.proof_image].all_months.push(curr.month);
                                                }
                                                return acc;
                                            }, {})
                                    ).map((group) => (
                                        <tr key={group.proof_image} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{group.user.name}</td>
                                            <td className="p-3">{group.user.no_rumah}</td>
                                            <td className="p-3">
                                                {/* Menampilkan rentang bulan yang dibayar sekaligus */}
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                                                    {group.all_months.join(', ')} {group.year}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <a href={`/storage/${group.proof_image}`} target="_blank" className="text-blue-600 hover:underline font-bold">
                                                    Lihat Bukti
                                                </a>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={() => handleApprove(group.proof_image)} // Kirim nama filenya, bukan ID-nya
                                                    className="bg-green-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm"
                                                >
                                                    Approve Semua
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}