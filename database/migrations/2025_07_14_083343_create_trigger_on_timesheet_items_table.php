<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->down();

        DB::unprepared('
            CREATE PROCEDURE IF NOT EXISTS calculate_timesheet_by_id(IN $timesheet_id BIGINT)
            BEGIN

                DECLARE $hours, $travel_distance, $cost, $travel_cost, $total_expense DECIMAL(10, 2);
                SELECT
                    SUM(hours),
                    SUM(travel_distance),
                    SUM(cost),
                    SUM(travel_cost),
                    SUM(total_expense)
                INTO
                    $hours,
                    $travel_distance,
                    $cost,
                    $travel_cost,
                    $total_expense
                FROM timesheet_items
                WHERE
                    timesheet_id = $timesheet_id AND deleted_at IS NULL;

                UPDATE timesheets
                    SET
                        hours = IFNULL($hours, 0),
                        travel_distance = IFNULL($travel_distance, 0),
                        expenses = IFNULL($total_expense, 0),
                        cost = IFNULL($cost, 0) + IFNULL($travel_cost, 0) + IFNULL($total_expense, 0)
                    WHERE id = $timesheet_id;
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheet_items_insert
            AFTER INSERT ON timesheet_items
            FOR EACH ROW
            BEGIN
                CALL calculate_timesheet_by_id(NEW.timesheet_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheet_items_update
            AFTER UPDATE ON timesheet_items
            FOR EACH ROW
            BEGIN
                CALL calculate_timesheet_by_id(NEW.timesheet_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheet_items_delete
            AFTER DELETE ON timesheet_items
            FOR EACH ROW
            BEGIN
                CALL calculate_timesheet_by_id(OLD.timesheet_id);
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('
            DROP TRIGGER IF EXISTS after_timesheet_items_insert;
            DROP TRIGGER IF EXISTS after_timesheet_items_update;
            DROP TRIGGER IF EXISTS after_timesheet_items_delete;
            DROP PROCEDURE IF EXISTS calculate_timesheet_by_id;
        ');
    }
};
