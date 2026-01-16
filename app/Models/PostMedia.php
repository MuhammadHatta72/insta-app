<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostMedia extends Model
{
    protected $table = 'post_media';

    protected $fillable = [
        'post_id',
        'media_path',
        'media_type',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Get the post that owns this media.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
