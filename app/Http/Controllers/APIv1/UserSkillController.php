<?php

namespace App\Http\Controllers\APIv1;

use App\Models\User;
use App\Models\Skill;
use App\Models\UserSkill;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class UserSkillController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                $query->whereHas('skill', function (Builder $query) use ($value) {
                    $query->where('code', 'like', '%' . $value . '%')
                        ->orWhere('description', 'like', '%' . $value . '%');
                });
            })
        ];
    }

    protected function allowedSorts()
    {
        return [
            AllowedSort::callback('code', function (Builder $query, $descending) {
                $query->orderByRaw(
                    '(select code from skills where skills.id = user_skills.skill_id) ' . ($descending ? 'desc' : 'asc')
                );
            }),
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'skill'
        ];
    }

    public function index(Request $request, User $user)
    {
        return $this->getQueryBuilder()->paginate();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'skill_id' => 'required|exists:skills,id',
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::query()->findOrFail($validated['user_id']);

        Gate::authorize('create', [UserSkill::class, $user]);

        $skill = Skill::query()->findOrFail(
            $validated['skill_id']
        );

        if ($user->skills()->where('skill_id', $skill->id)->exists()) {
            return response()->json([
                'message' => 'Skill already assigned to this user'
            ], 422);
        }

        $user->skills()->attach($skill->id);

        return response()->json([
            'data' => $user->skills()->where('skill_id', $skill->id)->first(),
            'message' => 'Skill added successfully'
        ], 201);
    }

    public function destroy(UserSkill $user_skill)
    {
        Gate::authorize('delete', $user_skill);

        $user_skill->delete();

        return response()->json([
            'message' => 'Skill removed successfully'
        ]);
    }
}
