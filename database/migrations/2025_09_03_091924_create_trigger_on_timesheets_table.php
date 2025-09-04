<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->down();

        \Illuminate\Support\Facades\DB::unprepared('
            CREATE PROCEDURE IF NOT EXISTS update_purchase_order_usage_by_timesheet_id(IN $assignment_id BIGINT)
            BEGIN
                DECLARE $purchase_order_id BIGINT;
                DECLARE $hours, $mileage, $cost DECIMAL(10, 2);

                SELECT purchase_order_id INTO $purchase_order_id FROM assignments WHERE id = $assignment_id;

                SELECT
                    SUM(hours),
                    SUM(travel_distance),
                    SUM(cost)
                INTO
                    $hours,
                    $mileage,
                    $cost
                FROM timesheets
                WHERE
                    timesheets.assignment_id in (
                        SELECT id
                        FROM assignments
                        WHERE assignments.purchase_order_id = $purchase_order_id AND deleted_at IS NULL
                    )
                    AND deleted_at IS NULL;

                UPDATE purchase_orders
                    SET
                        total_hours = IFNULL($hours, 0),
                        total_mileage = IFNULL($mileage, 0),
                        total_cost = IFNULL($cost, 0)
                WHERE id = $purchase_order_id;
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheets_update
            AFTER UPDATE ON timesheets
            FOR EACH ROW
            BEGIN
                CALL update_purchase_order_usage_by_timesheet_id(NEW.assignment_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheets_delete
            AFTER DELETE ON timesheets
            FOR EACH ROW
            BEGIN
                CALL update_purchase_order_usage_by_timesheet_id(OLD.assignment_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_timesheets_insert
            AFTER INSERT ON timesheets
            FOR EACH ROW
            BEGIN
                CALL update_purchase_order_usage_by_timesheet_id(NEW.assignment_id);
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared('
            DROP TRIGGER IF EXISTS after_timesheets_update;
            DROP TRIGGER IF EXISTS after_timesheets_delete;
            DROP TRIGGER IF EXISTS after_timesheets_insert;
            DROP PROCEDURE IF EXISTS update_purchase_order_usage_by_timesheet_id;
        ');
    }
};
