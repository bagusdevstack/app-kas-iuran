<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warga extends Model
{

    protected $fillable = [
        'nama',
        'no_rumah',
        'blok',
        'no_telp',
        'status_tinggal'
    ];
    //
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
