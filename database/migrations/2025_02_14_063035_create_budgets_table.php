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
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->string('rate_code')->index();
            $table->foreignId('purchase_order_id')->index()->constrained();
            $table->foreignId('assignment_type_id')->index()->constrained();
            $table->decimal('hourly_rate', 10);
            $table->decimal('budgeted_hours', 10);
            $table->decimal('travel_rate', 10)->default(0.5);
            $table->decimal('budgeted_mileage', 10)->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['purchase_order_id', 'assignment_type_id']);
        });

        \Illuminate\Support\Facades\DB::unprepared('
            CREATE PROCEDURE IF NOT EXISTS calculate_budget_by_id(IN purchase_order_id BIGINT)
            BEGIN
                DECLARE total_budgeted_hours, total_budgeted_mileage DECIMAL(10, 2);
                SELECT SUM(budgeted_hours), SUM(budgeted_mileage)
                INTO total_budgeted_hours, total_budgeted_mileage
                FROM budgets
                WHERE
                    purchase_order_id = purchase_order_id
                    AND deleted_at IS NULL;

                UPDATE purchase_orders
                    SET
                        budgeted_hours = IFNULL(total_budgeted_hours, 0),
                        budgeted_mileage = IFNULL(total_budgeted_mileage, 0)
                WHERE id = purchase_order_id;
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
        Schema::dropIfExists('purchase_orders');
    }
};
