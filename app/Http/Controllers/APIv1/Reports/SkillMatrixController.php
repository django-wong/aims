<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;
use App\Models\InspectorSkillMatrix;
use App\Models\InvoiceDetail;
use App\Models\Skill;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;

class SkillMatrixController extends Controller
{
    protected function getModel(): string
    {
        return InspectorSkillMatrix::class;
    }

    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('i_e_a', function (Builder $query, $value) {
                $query->where('i_e_a', $value);
            }),
            AllowedFilter::exact('location', 'state'),
            AllowedFilter::callback('type', function (Builder $query, $value) {
                $query->whereIn(
                    'skill_id', Skill::query()->select('id')->whereJsonContains('on_skill_matrix', $value)
                );
            }),
        ];
    }

    public function __invoke(Request $request)
    {
        $data = [
            'records' => $this->getQueryBuilder()->tap(function (Builder $query) {
                $query
                    ->select(DB::raw('id, user_id, inspector_name, country, state, max(org_id), JSON_ARRAYAGG(skill_code) as skills'))
                    ->groupBy('user_id')
                    ->withCasts([
                        'skills' => 'array',
                    ]);
            })->get(),

            'skills' => Skill::query()->whereJsonContains('on_skill_matrix', $request->input('filter.type'))->get(),
        ];

        return Pdf::loadView('pdfs.skill-matrix', $data)->setPaper('a4', 'landscape')->stream("skill-matrix.pdf");
    }
}
