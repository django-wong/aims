<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\StoreSkillRequest;
use App\Http\Requests\APIv1\UpdateSkillRequest;
use App\Models\Skill;
use Illuminate\Support\Facades\Gate;

class SkillController extends Controller
{
    protected function allowedSorts()
    {
        return [
            'code', 'report_code', 'sort'
        ];
    }

    public function index()
    {
        return $this->getQueryBuilder()->paginate();
    }

    public function store(StoreSkillRequest $request)
    {
        $skill = Skill::query()->create($request->validated());

        return [
            'data' => $skill,
            'message' => 'Skill created successfully.'
        ];
    }

    public function update(UpdateSkillRequest $request, Skill $skill)
    {
        $skill->update($request->validated());

        return [
            'data' => $skill,
            'message' => 'Skill updated successfully.'
        ];
    }

    public function destroy(Skill $skill)
    {
        Gate::authorize('delete', $skill);

        $skill->delete();

        return [
            'message' => 'Skill deleted successfully.'
        ];
    }
}
