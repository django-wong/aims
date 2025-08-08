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
        DB::unprepared('
            CREATE PROCEDURE IF NOT EXISTS update_timesheet_total(IN $timesheet_id BIGINT)
            BEGIN

                -- Compute the total hours, and cost

                DECLARE $hours, $km_traveled, $cost, $travel_cost DECIMAL(10, 2);
                DECLARE $expense_total DECIMAL(10, 2);

                SELECT SUM(hours), SUM(km_traveled), SUM(cost), SUM(travel_cost) INTO $hours, $km_traveled, $cost, $travel_cost
                    FROM timesheet_items
                    WHERE
                        timesheet_id = $timesheet_id
                        AND deleted_at IS NULL
                        AND approved = 1;
                UPDATE timesheets
                    SET
                        hours = IFNULL($hours, 0),
                        km_traveled = IFNULL($km_traveled, 0),
                        cost = IFNULL($cost, 0) + IFNULL($travel_cost, 0)
                    WHERE id = $timesheet_id;

                -- Compute the cost for additional expenses

                SELECT IFNULL(SUM(amount), 0) INTO $expense_total
                    FROM timesheet_expenses
                    WHERE timesheet_id = $timesheet_id AND deleted_at IS NULL;
                UPDATE timesheets
                    SET
                        cost = cost + $expense_total
                    WHERE id = $timesheet_id;
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheet_items_insert
            AFTER INSERT ON timesheet_items
            FOR EACH ROW
            BEGIN
                CALL update_timesheet_total(NEW.timesheet_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheet_items_update
            AFTER UPDATE ON timesheet_items
            FOR EACH ROW
            BEGIN
                CALL update_timesheet_total(NEW.timesheet_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheet_items_delete
            AFTER DELETE ON timesheet_items
            FOR EACH ROW
            BEGIN
                CALL update_timesheet_total(OLD.timesheet_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheet_expenses_insert
            AFTER INSERT ON timesheet_expenses
            FOR EACH ROW
            BEGIN
                CALL update_timesheet_total(NEW.timesheet_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheet_expenses_update
            AFTER UPDATE ON timesheet_expenses
            FOR EACH ROW
            BEGIN
                CALL update_timesheet_total(NEW.timesheet_id);
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
            DROP PROCEDURE IF EXISTS update_timesheet_total;
        ');
    }
};
