<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\DestroyExpenseRequest;
use App\Http\Requests\APIv1\StoreExpenseRequest;
use App\Http\Requests\APIv1\UpdateExpenseRequest;
use App\Models\AssignmentInspector;
use App\Models\Expense;
use App\Models\TimesheetItem;
use App\PDFs\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class ExpenseController extends Controller
{
    protected function allowedIncludes()
    {
        return [
            'attachments', 'attachments_count'
        ];
    }

    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('timesheet_item_id', function ($query, $value) {
                if (! empty($value)) {
                    Gate::authorize(
                        'create', [
                            Expense::class,
                            TimesheetItem::query()->findOrFail($value)
                        ]
                    );
                    $query->where('timesheet_item_id', $value);
                } else {
                    Gate::authorize('create', Invoice::class);
                }
            })->default('')
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->getQueryBuilder()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpenseRequest $request)
    {
        $timesheet_item = TimesheetItem::query()->findOrFail($request->input('timesheet_item_id'));

        $inspector = AssignmentInspector::query()
            ->where([
                'assignment_id' => $timesheet_item->timesheet->assignment_id,
                'user_id' => $timesheet_item->timesheet->user_id,
            ])
            ->first();

        $expense = Expense::query()->create([
            ...$request->validated(),
            'assignment_id' => $timesheet_item->timesheet->assignment_id,
            'timesheet_id' => $timesheet_item->timesheet_id,
            'user_id' => $timesheet_item->timesheet->user_id,
            'assignment_inspector_id' => $inspector->id
        ]);

        $request->saveAttachments($expense);

        return [
            'message' => 'Expense created successfully', 'data' => $expense,
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());

        $request->saveAttachments($expense);

        return [
            'message' => 'Expense updated successfully',
            'data' => $expense,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DestroyExpenseRequest $request, Expense $expense)
    {
        $expense->delete();

        return [
            'message' => 'Expense deleted successfully',
        ];
    }
}
