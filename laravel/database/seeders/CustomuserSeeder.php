<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customuser;

class CustomuserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customuser::create([
            'sub' => 'defaultuser',
            'uuid' => '73d7a936-245f-4bec-b082-0941422698a1',
        ]);
    }
}
