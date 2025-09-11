<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property Client $client
 * @property mixed  $timesheet
 */
class ClientTimesheetReminder extends Model
{
    use DynamicPagination, BelongsToClient, BelongsToTimesheet;
}
