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
            CREATE PROCEDURE IF NOT EXISTS calculate_budget_by_id(IN $purchase_order_id BIGINT)
            BEGIN
                DECLARE $total_budgeted_hours, $total_budgeted_mileage DECIMAL(10, 2);
                SELECT
                    SUM(budgeted_hours),
                    SUM(budgeted_mileage)
                INTO
                    $total_budgeted_hours,
                    $total_budgeted_mileage
                FROM budgets
                WHERE
                    budgets.purchase_order_id = $purchase_order_id AND deleted_at IS NULL;

                UPDATE purchase_orders
                    SET
                        budgeted_hours = IFNULL($total_budgeted_hours, 0),
                        budgeted_mileage = IFNULL($total_budgeted_mileage, 0)
                WHERE id = $purchase_order_id;
            END;


            CREATE TRIGGER IF NOT EXISTS after_budgets_update
            AFTER UPDATE ON budgets
            FOR EACH ROW
            BEGIN
                CALL calculate_budget_by_id(NEW.purchase_order_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_budgets_delete
            AFTER DELETE ON budgets
            FOR EACH ROW
            BEGIN
                CALL calculate_budget_by_id(OLD.purchase_order_id);
            END;

            CREATE TRIGGER IF NOT EXISTS after_budgets_insert
            AFTER INSERT ON budgets
            FOR EACH ROW
            BEGIN
                CALL calculate_budget_by_id(NEW.purchase_order_id);
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('
            DROP PROCEDURE IF EXISTS calculate_budget_by_id;
            DROP TRIGGER IF EXISTS after_budgets_update;
            DROP TRIGGER IF EXISTS after_budgets_delete;
            DROP TRIGGER IF EXISTS after_budgets_insert;
        ');
    }
};
