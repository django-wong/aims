<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property Client $client
 * @property Org    $org
 * @property int  $org_id
 */
class Project extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory, BelongsToOrg, DynamicPagination, BelongsToClient, HasManyComments, HasManyAssignments;
    use SoftDeletes;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    public static function nextProjectNumber(): string
    {
        $year = date('Y');
        $org = auth()->user()->org;
        $region = $org->code ?? 'AUS'; // Default to 'AUS' if the region code is not set
        $lastProject = Project::query()->whereYear('created_at', $year)
            ->where('org_id', $org->id)
            ->orderBy('id', 'desc')
            ->withTrashed()
            ->first();

        $nextNumber = 1;
        if ($lastProject) {
            preg_match('/(\d+)$/', $lastProject->number, $matches);
            if (isset($matches[1])) {
                $nextNumber = (int)$matches[1] + 1;
            }
        }

        return sprintf('%s-%s-%04d', $year, $region, $nextNumber);
    }

    public function project_type()
    {
        return $this->belongsTo(ProjectType::class);
    }
}
