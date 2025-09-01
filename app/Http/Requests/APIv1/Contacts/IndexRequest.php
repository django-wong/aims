<?php

namespace App\Http\Requests\APIv1\Contacts;

use App\Models\Contactable;
use App\Support\ModelResolver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;

class IndexRequest extends FormRequest
{
    public function contactable(): Contactable | null
    {
        /**
         * @var class-string<Model> $class
         */
        $class = ModelResolver::for($this->validated('contactable_type'));
        $id = $this->validated('contactable_id');
        if (is_numeric($id)) {
            FIND:
            return $class::query()->findOrFail($id);
        }


        $accessor = explode('.', trim($id, '{}'));

        // Get the first two parts of the accessor and save the rest as a array
        if (count($accessor) < 3) {
            abort(400, 'Accessor must be in the format {table.id.field}');
        }

        list($table, $accessor_id) = $accessor;

        $model = \App\Support\ModelResolver::for($table);

        $value = $model::query()->findOrFail($accessor_id);

        foreach (array_slice($accessor, 2) as $attribute) {
            if ($value) {
                $value = $value->{$attribute} ?? null;
            }
        }

        if (is_numeric($value)) {
            $id = $value;
            goto FIND;
        }
    }

    public function rules(): array
    {
        return [
            'contactable_id' => ['required', function ($attribute, $value, $fail) {
                // $value must be a number or string in the format /{.*}/
                if (!is_numeric($value) && !preg_match('/^\{.+}$/', $value)) {
                    $fail("The $attribute must be a valid ID.");
                }

                if (!is_numeric($value)) {
                    $value = trim($value, '{}');
                    $accessor = explode('.', $value);
                    if (count($accessor) < 3) {
                        $fail("Accessor must be in the format {table.id.field}");
                    }
                }
            }],
            'contactable_type' => 'string|required',
        ];
    }
}
