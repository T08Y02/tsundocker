<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customuser extends Model
{
    use HasFactory;

    protected $fillable = [
        'sub',
        'nickname',
        'uuid', 
    ];
}