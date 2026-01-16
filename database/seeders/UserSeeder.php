<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Khoirun Nasirin',
                'email' => 'nasirin1@gmail.com',
                'password' => bcrypt('password123'),
            ],
            [
                'name' => 'Muhammad Hatta',
                'email' => 'hatta@gmail.com',
                'password' => bcrypt('password123'),
            ]
        ];

        foreach ($users as $user) {
            \App\Models\User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
