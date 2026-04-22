import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";

export default function WargaIndex({ auth, wargas }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        nama: '',
        no_rumah: '',
        blok: '',
        no_telp: ''
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('warga.update', editId), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('warga.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Hapus data warga ini? Semua riwayat pembayaran terkait juga akan hilang.")) {
            router.delete(route('warga.destroy', id));
        }
    };

    const openEdit = (warga) => {
        setIsEditing(true);
        setEditId(warga.id);
        setData({
            nama: warga.nama,
            no_rumah: warga.no_rumah,
            blok: warga.blok,
            no_telp: warga.no_telp
        });
    };

    const closeModal = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Data Warga</h2>}
        >
            <Head title="Data Warga" />

            <div className="py-12 px-4 max-w-7xl mx-auto space-y-8">

                {/* SECTION 1: FORM INPUT */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800">
                            {isEditing ? '📝 Edit Data Warga' : '👤 Tambah Warga Baru'}
                        </h3>
                        <p className="text-sm text-gray-500">Pastikan nomor rumah diisi dengan benar untuk keperluan laporan kas.</p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nama Lengkap</label>
                                <input
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500"
                                    placeholder="Nama Warga"
                                />
                                {errors.nama && <p className="text-red-500 text-[10px] mt-1">{errors.nama}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">No. Rumah</label>
                                <input
                                    value={data.no_rumah}
                                    onChange={e => setData('no_rumah', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg text-sm"
                                    placeholder="Misal: A-01"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Blok</label>
                                <input
                                    value={data.blok}
                                    onChange={e => setData('blok', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg text-sm"
                                    placeholder="Blok"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`flex-1 text-white px-4 py-2 rounded-lg font-bold text-sm transition ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isEditing ? 'Update' : 'Simpan'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-300"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* SECTION 2: TABEL LIST WARGA */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800">Daftar Seluruh Warga</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-left uppercase text-[11px] font-bold">
                                    <th className="p-4 border-b">Nama</th>
                                    <th className="p-4 border-b text-center">No. Rumah</th>
                                    <th className="p-4 border-b text-center">Blok</th>
                                    <th className="p-4 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {wargas.length > 0 ? wargas.map((w) => (
                                    <tr key={w.id} className="hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-medium text-gray-700">{w.nama}</td>
                                        <td className="p-4 text-center text-gray-600 font-mono">{w.no_rumah}</td>
                                        <td className="p-4 text-center text-gray-600">{w.blok || '-'}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => openEdit(w)} className="text-amber-500 hover:text-amber-700 transition">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(w.id)} className="text-red-500 hover:text-red-700 transition">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-gray-400 italic font-medium">
                                            Belum ada data warga terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}