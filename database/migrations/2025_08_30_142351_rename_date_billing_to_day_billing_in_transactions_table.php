<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            DB::statement("ALTER TABLE transactions CHANGE COLUMN date_billing day_billing ENUM('batch1', 'batch2', 'batch3', 'batch4', 'batch5', 'all_cheque', 'n/a') NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            DB::statement("ALTER TABLE transactions CHANGE COLUMN day_billing date_billing ENUM('batch1', 'batch2', 'batch3', 'batch4', 'batch5', 'all_cheque') NOT NULL");
        });
    }
};
