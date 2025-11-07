<?php

namespace App\Http\Requests\APIv1;

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\TimesheetItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreExpenseRequest extends FormRequest
{
    use HasAttachments;

    public function rules()
    {
        return [
            'timesheet_item_id' => ['required', 'exists:timesheet_items,id'],
            'net_amount' => 'required|numeric|min:0',
            'gst' => 'numeric|nullable|min:0',
            'process_fee' => 'numeric|nullable|min:0',
            'type' => 'required|string|in:travel,meals,accommodation,other',
            'invoice_number' => 'string|nullable',
            'creditor' => 'required|string',
            'description' => 'string|nullable',
            'report_number' => 'string|nullable',
        ];
    }

    public function authorize()
    {
        return Gate::allows('create', [Expense::class, TimesheetItem::query()->find($this->input('timesheet_item_id'))]);
    }
}
