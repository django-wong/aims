<?php

namespace App\Http\Requests\APIv1\Users;

use App\Models\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\Password;

class StoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|integer|in:' . implode(',', [
                UserRole::ADMIN,
                UserRole::FINANCE,
                UserRole::PM,
                UserRole::INSPECTOR,
                UserRole::CLIENT,
                UserRole::VENDOR,
                UserRole::STAFF,
            ])
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('create', \App\Models\User::class);
    }

    /**
     * Get the basic user data from the request.
     */
    public function userData(): array
    {
        return $this->only(['first_name', 'last_name', 'title', 'email', 'password']);
    }

    /**
     * Get the user role data from the request.
     */
    public function roleData(): array
    {
        return $this->only(['role', 'org_id']);
    }
}
