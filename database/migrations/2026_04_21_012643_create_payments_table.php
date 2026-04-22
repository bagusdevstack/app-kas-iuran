<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warga_id')->nullable()->constrained('wargas')->onDelete('cascade');
            // user_id dibuat nullable karena sekarang yang bayar bisa warga non-login
            $table->foreignId('user_id')->nullable()->change();
            $table->integer('amount')->default(50000);
            $table->string('month'); // Contoh: Januari
            $table->year('year');
            $table->string('proof_image'); // Nama file foto bukti transfer
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
