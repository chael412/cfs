<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('middlename')->nullable();
            $table->string('lastname');
            $table->enum('sex', ['male', 'female']);
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed', 'separated']);

            $table->date('birthdate');
            $table->string('address')->nullable();
            $table->string('occupation')->nullable();
            $table->string('cellphone_no');
            $table->string('spouse_name');
            $table->string('spouse_occupation')->nullable();
            $table->string('spouse_cellphone_no');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
