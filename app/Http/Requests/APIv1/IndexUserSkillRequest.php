<?php

namespace App\Http\Requests\APIv1;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class IndexUserSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = User::query()->find($this->input('user_id'));

        return Gate::allows('view', $user);
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
        ];
    }
}
