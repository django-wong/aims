<?php

use App\Http\Controllers\APIv1\AssignmentController;
use App\Http\Controllers\APIv1\AssignmentInspectorController;
use App\Http\Controllers\APIv1\AssignmentTypeController;
use App\Http\Controllers\APIv1\AttachmentController;
use App\Http\Controllers\APIv1\BudgetController;
use App\Http\Controllers\APIv1\CertificateController;
use App\Http\Controllers\APIv1\CertificateLevelController;
use App\Http\Controllers\APIv1\CertificateTechniqueController;
use App\Http\Controllers\APIv1\CertificateTypeController;
use App\Http\Controllers\APIv1\ClientController;
use App\Http\Controllers\APIv1\CommentController;
use App\Http\Controllers\APIv1\ContactController;
use App\Http\Controllers\APIv1\InspectorController;
use App\Http\Controllers\APIv1\MenuController;
use App\Http\Controllers\APIv1\OrgController;
use App\Http\Controllers\APIv1\ProjectController;
use App\Http\Controllers\APIv1\ProjectTypeController;
use App\Http\Controllers\APIv1\PurchaseOrderController;
use App\Http\Controllers\APIv1\ReportController;
use App\Http\Controllers\APIv1\Reports\ManHoursByYearController;
use App\Http\Controllers\APIv1\SkillController;
use App\Http\Controllers\APIv1\TimesheetController;
use App\Http\Controllers\APIv1\TimesheetItemController;
use App\Http\Controllers\APIv1\TimesheetReportController;
use App\Http\Controllers\APIv1\UserController;
use App\Http\Controllers\APIv1\UserSkillController;
use App\Http\Controllers\APIv1\VendorController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('menus', [MenuController::class, 'index']);
    Route::get('menus/reports', [MenuController::class, 'reports']);

    Route::get('assignments/next-assignment-number', [AssignmentController::class, 'next_assignment_number']);

    Route::apiResources([
        'purchase-orders' => PurchaseOrderController::class,
        'projects' => ProjectController::class,
        'clients' => ClientController::class,
        'orgs' => OrgController::class,
        'users' => UserController::class,
        'contacts' => ContactController::class,
        'vendors' => VendorController::class,
        'attachments' => AttachmentController::class,
        'project-types' => ProjectTypeController::class,
        'certificates' => CertificateController::class,
        'certificate-types' => CertificateTypeController::class,
        'certificate-techniques' => CertificateTechniqueController::class,
        'certificate-levels' => CertificateLevelController::class,
        'comments' => CommentController::class,
        'inspectors' => InspectorController::class,
        'assignments' => AssignmentController::class,
        'assignment-types' => AssignmentTypeController::class,
        'assignment-inspectors' => AssignmentInspectorController::class,
        'timesheets' => TimesheetController::class,
        'timesheet-reports' => TimesheetReportController::class,
        'timesheet-items' => TimesheetItemController::class,
        'budgets' => BudgetController::class,
        'skills' => SkillController::class,
        'user-skills' => UserSkillController::class,
    ]);

    // Users
    Route::post('users/{id}/update-role', [UserController::class, 'updateRole'])->name('users.update_role');

    // Assignments
    Route::post('assignments/{id}/notify-inspector', [AssignmentController::class, 'notify'])->name('assignments.notify_inspector');
    Route::get('assignments/{assignment}/pdf', [AssignmentController::class, 'pdf']);
    Route::get('assignments/{assignment}/timesheet-reports', [AssignmentController::class, 'timesheet_reports']);
    Route::post('assignments/{assignment}/send-to-operation-office', [AssignmentController::class, 'send']);
    Route::post('assignments/{assignment}/accept', [AssignmentController::class, 'accept']);
    Route::post('assignments/{assignment}/reject', [AssignmentController::class, 'reject']);
    Route::get('assignments/{assignment}/daily-usage', [AssignmentController::class, 'daily_usage']);

    // Timesheets
    Route::post('timesheets/{timesheet}/sign-off', [TimesheetController::class, 'sign_off']);
    Route::post('timesheets/{timesheet}/approve', [TimesheetController::class, 'approve']);
    Route::post('timesheets/{timesheet}/reject', [TimesheetController::class, 'reject']);


    // Reports
    Route::get('reports/hours-entry', [ReportController::class, 'hours_entry']);
    Route::get('reports/hours-log', [ReportController::class, 'hours_log']);
    Route::get('reports/man-hours-by-year', ManHoursByYearController::class);

    // Assignment inspectors
    Route::post('assignment-inspectors/{assignment_inspector}/acknowledge', [AssignmentInspectorController::class, 'acknowledge']);

    // Purchase Orders
    Route::get('purchase-orders/{purchase_order}/calculate-gross-margins', [PurchaseOrderController::class, 'calculate_gross_margins']);
    Route::get('purchase-orders/{purchase_order}/overview', [PurchaseOrderController::class, 'overview']);
    Route::get('purchase-orders/{purchase_order}/daily-usage', [PurchaseOrderController::class, 'daily_usage']);
});
