<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Contacts\IndexRequest;
use App\Http\Requests\APIv1\Contacts\StoreRequest;
use App\Http\Requests\APIv1\Contacts\UpdateRequest;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class ContactController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                $query->where(function (Builder $query) use ($value) {
                    $query->whereAny([
                        'name',
                        'email',
                        'phone',
                    ], 'LIKE', "%$value%");
                });
            }),
        ];
    }

    protected function allowedSorts()
    {
        return [
            'name', 'first_name', 'last_name', 'email', 'phone', 'created_at', 'updated_at',
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        if ($contactable = $request->contactable()) {
            Gate::authorize('view', $contactable);
        } else {
            abort(404, 'Contactable not found');
        }

        return $this->getQueryBuilder()->whereMorphedTo('contactable', $contactable)->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $contact = $request->contactable()->contacts()->create($request->basic());

        return [
            'message' => 'Contact created successfully',
            'data' => $contact,
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Contact $contact)
    {
        $contact->update($request->basic());

        return [
            'message' => 'Contact updated successfully',
            'data' => $contact,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        //
    }
}
