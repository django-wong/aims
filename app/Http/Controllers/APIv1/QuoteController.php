<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\StoreQuoteRequest;
use App\Http\Requests\APIv1\UpdateQuoteRequest;
use App\Models\CurrentOrg;
use App\Models\Quote;
use App\Models\QuoteDetail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class QuoteController extends Controller
{

    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                if ($value) {
                    $query->whereAny([
                        'type',
                        'title',
                        'details',
                        'client_business_name',
                        'quote_client_business_name',
                        'controlling_org_name'
                    ], 'like', "%$value%");
                }
            })
        ];
    }

    protected function getModel(): string
    {
        return QuoteDetail::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(CurrentOrg $org)
    {
        return $this->getQueryBuilder()->tap(function (Builder $query) use ($org) {
            $query->where('org_id', $org->id);
        })->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuoteRequest $request, CurrentOrg $org)
    {
        $quote = DB::transaction(function () use ($request, $org) {
            $quote = Quote::query()->create([
                ...$request->input(),
                'org_id' => $org->id,
            ]);

            activity()->on($quote)->withProperties($request->input())->log('Quote created');

            return $quote;
        });

        return [
            'message' => 'Quote created',
            'data' => $quote,
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Quote $quote)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuoteRequest $request, Quote $quote)
    {
        $quote->update($request->input());

        activity()->on($quote)->withProperties($quote->getChanges())->log('Quote updated');

        return [
            'message' => 'Quote updated',
            'data' => $quote,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quote $quote)
    {
        Gate::authorize('delete', $quote);
        $quote->delete();

        return [
            'message' => 'Quote deleted',
        ];
    }
}
