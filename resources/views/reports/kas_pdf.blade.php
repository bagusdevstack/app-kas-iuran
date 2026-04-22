<!DOCTYPE html>
<html>

<head>
    <title>Laporan Kas RT {{ $year }}</title>
    <style>
        body {
            font-family: sans-serif;
            /* Ukuran font dikurangi sedikit agar angka 50.000 muat dalam kolom yang sempit */
            font-size: 9px;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            table-layout: fixed;
            /* Menjaga lebar kolom tetap konsisten */
        }

        th,
        td {
            border: 1px solid #000;
            /* Garis lebih tegas untuk cetak PDF */
            padding: 4px 2px;
            text-align: center;
        }

        /* Kolom nama warga dibuat lebih lebar sedikit */
        .col-nama {
            width: 120px;
            text-align: left;
            padding-left: 5px;
        }

        .bg-gray {
            background-color: #f3f3f3;
            font-weight: bold;
        }

        .text-right {
            text-align: right;
            padding-right: 5px;
        }

        .text-green {
            color: #059669;
            font-weight: bold;
        }

        .text-red {
            color: #dc2626;
            font-weight: bold;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .footer {
            margin-top: 30px;
            text-align: right;
            font-style: italic;
            font-size: 8px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2 style="margin-bottom: 5px;">LAPORAN KAS RT TAHUN {{ $year }}</h2>
        <p style="margin: 0;">Dicetak pada: {{ date('d/m/Y H:i') }}</p>
    </div>

    <h3>1. Iuran Warga (Bulan Berjalan)</h3>
    <table>
        <thead>
            <tr class="bg-gray">
                <th class="col-nama">Nama Warga</th>
                @foreach($months as $m)
                <th>{{ $m }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($reportTable as $warga)
            <tr>
                <td class="col-nama">{{ $warga['name'] }}</td>
                @foreach($months as $m)
                <td>
                    {{-- Mengubah ✔ menjadi nominal 50.000 --}}
                    @if($warga['months'][$m])
                    50.000
                    @else
                    -
                    @endif
                </td>
                @endforeach
            </tr>
            @endforeach
        </tbody>
    </table>

    <h3>2. Rincian Sumbangan & Pengeluaran</h3>
    <table>
        <thead>
            <tr class="bg-gray">
                <th style="text-align: left; padding-left: 10px;">Keterangan</th>
                <th style="width: 100px;">Tanggal</th>
                <th class="text-right" style="width: 150px;">Nominal</th>
            </tr>
        </thead>
        <tbody>
            {{-- Loop Sumbangan --}}
            @foreach($donations as $don)
            <tr>
                <td style="text-align: left; padding-left: 10px;">Sumbangan Masuk (Lain-lain)</td>
                <td>{{ $don->created_at->format('d/m/Y') }}</td>
                <td class="text-right text-green">+ Rp {{ number_format($don->amount, 0, ',', '.') }}</td>
            </tr>
            @endforeach

            {{-- Loop Pengeluaran --}}
            @foreach($expenses as $exp)
            <tr>
                <td style="text-align: left; padding-left: 10px;">{{ $exp->description }}</td>
                <td>{{ \Carbon\Carbon::parse($exp->date)->format('d/m/Y') }}</td>
                <td class="text-right text-red">- Rp {{ number_format($exp->amount, 0, ',', '.') }}</td>
            </tr>
            @endforeach

            <tr class="bg-gray">
                <td colspan="2" class="text-right">SALDO AKHIR KAS TAHUN {{ $year }}</td>
                <td class="text-right" style="font-size: 11px;">Rp {{ number_format($summary['saldoAkhirTahunIni'], 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        *Laporan ini dihasilkan secara otomatis oleh Sistem Kas RT Digital.
    </div>
</body>

</html>