<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'body', 
        'progress', 
        'img_url',
        'customuser_id',
    ];

    public function customuser()
    {
        return $this->belongsTo(Customuser::class);
    }
}
