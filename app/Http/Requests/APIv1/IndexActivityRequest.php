<?php

namespace App\Http\Requests\APIv1;

use App\Support\ModelResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class IndexActivityRequest extends FormRequest
{
    protected $subject = null;

    public function rules()
    {
        return [
            'subject_type' => 'required|string',
            'subject_id' => 'required|integer',
        ];
    }

    public function authorize(): \Illuminate\Auth\Access\Response|false
    {
        if (! empty($this->subject())) {
            return Gate::authorize('view', $this->subject());
        }

        return false;
    }

    public function subject()
    {
        if ($this->subject === null){
            $class = ModelResolver::for($this->input('subject_type'));
            $this->subject = $class::query()->find($this->input('subject_id'));
        }
        return $this->subject;
    }
}
