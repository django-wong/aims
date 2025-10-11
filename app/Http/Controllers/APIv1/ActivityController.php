<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\IndexActivityRequest;
use App\Models\Activity;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityController extends Controller
{
    protected function getModel(): string
    {
        return Activity::class;
    }

    public function index(IndexActivityRequest $request)
    {
        return $this->getQueryBuilder()
            ->whereMorphedTo('subject', $request->subject())
            ->with('causer', function (MorphTo $query) {
                $query->select(['id', 'name']);
            })
            ->orderBy('created_at', 'desc')
            ->paginate();
    }
}
