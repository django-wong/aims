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

        DB::unprepared('
            CREATE PROCEDURE IF NOT EXISTS calculate_timesheet_item_by_id(IN $timesheet_item_id BIGINT)
            BEGIN
                DECLARE $total_expense DECIMAL(10, 2);

                SELECT SUM(amount) INTO $total_expense FROM expenses
                WHERE timesheet_item_id = $timesheet_item_id;

                UPDATE timesheet_items SET total_expense = IFNULL($total_expense, 0) WHERE id = $timesheet_item_id;
            END;

            CREATE TRIGGER IF NOT EXISTS after_expenses_insert
            AFTER INSERT ON expenses
            FOR EACH ROW
            BEGIN
                CALL calculate_timesheet_item_by_id(NEW.timesheet_item_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_expenses_update
            AFTER UPDATE ON expenses
            FOR EACH ROW
            BEGIN
                CALL calculate_timesheet_item_by_id(NEW.timesheet_item_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_expenses_delete
            AFTER DELETE ON expenses
            FOR EACH ROW
            BEGIN
                CALL calculate_timesheet_item_by_id(OLD.timesheet_item_id);
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('
            DROP TRIGGER IF EXISTS after_expenses_insert;
            DROP TRIGGER IF EXISTS after_expenses_update;
            DROP TRIGGER IF EXISTS after_expenses_delete;
            DROP PROCEDURE IF EXISTS calculate_timesheet_item_by_id;
        ');
    }
};
