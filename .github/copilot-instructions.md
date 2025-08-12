This is AIMS project's Copilot instructions file.

This project is built with the Laravel framework (version 12) and React (version 18).

The frontend also uses tailwindcss (version 4) and shadcn/ui.

All page routes are defined in the `routes/web.php` file.
All API routes are defined in the `routes/api.php` file.

Place you pages in the `resources/js/pages` directory, and components in the `resources/js/components/ui` or `resources/js/components` directory depending on whether they are general reusable components or project-specific components.

I don't expect you to add any new js/css files directly in the `public` directory, if you need to add third-party modules, please consider installing a new npm package and import it properly.

Do not call `Model::create()` or `Model::update()` directly, instead use `Model::query()->create()` or `Model::query()->update()` to ensure a better type hinting.

APIv1 controllers should extend `App\Http\Controllers\Api\V1\Controller`.
Other web controllers should extend `App\Http\Controllers\Controller`.

Use `DynamicPagination.php` in your models to handle the page size if you intend to build get api endpoints that return paginated results.

General api response should be in the format of:
```ts
{
    message: string // "Reserved property for any message you want to send",
    data: YOUR_DATA // The actual data you want to return, i.e. an newly created model, a updated model, or boolean value for success or failure,
}
```

Paginated api should always return `LengthAwarePaginator` that is returned by a `$query->paginate()` call.

When you work with an API controller, make sure you create a request class in `App\Http\Requests\APIv1` directory.

I encourage you to explore the existing codebase to understand how things are structured and how to implement new features.
