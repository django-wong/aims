<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Code, I/E/A, Description, Sort, Equipment, Equipment Group
        $skills = [
            ['AC', 'I', 'Heating, Ventilation & Air Conditioning Equipment', 28,'AC',],
            ['AU', 'I', 'Auditor Approval', 35,'AU',],
            ['CL', 'I', 'Coatings & Linings', 31,'CL',],
            ['CLA', 'I', 'Coatings & Linings Approval', 32,'CLA',],
            ['CP', 'I', 'Cathodic Protection / Anodes', 21,'CP',],
            ['CV', 'I', 'Civil', 19,'CV',],
            ['EC', 'I', 'Electric Cables & Accessories', 23,'EC',],
            ['EG', 'I', 'Generators, Transformers & Power Supplies', 24,'EG',],
            ['EH', 'I', 'Electrical Hardware', 25,'EH',],
            ['EL', 'I', 'Electronics & Communications Systems', 26,'EL',],
            ['EM', 'I', 'Electric Motors & Switchgear', 22,'EM',],
            ['ES', 'I', 'Instrumentation & Control Systems', 27,'ES',],
            ['EX', 'I', 'Hazardous Area Equipment', 33,'EX',],
            ['EXA', 'I', 'Hazardous Area Equipment Approval', 34,'EXA',],
            ['Exp1', 'E', 'Pressure Retaining Equipment', 36,'Exp1',],
            ['Exp2', 'E', 'Rotating Equipment', 37,'Exp2',],
            ['Exp3', 'E', 'Valves', 38,'Exp3',],
            ['Exp4', 'E', 'Pipe Fittings', 39,'Exp4',],
            ['Exp5', 'E', 'General Mechanical', 40,'Exp5',],
            ['Exp6', 'E', 'Electrical & Instrumentation Equipment', 41,'Exp6',],
            ['FF', 'I', 'Fire Fight & Safety Equipment', 12,'FF',],
            ['FL', 'I', 'Flexibles – Umbilicals, Risers, Hoses', 20,'FL',],
            ['FT', 'I', 'Flare Tips & Burners, Fired Heaters', 5,'FT',],
            ['HE', 'I', 'Heat Exchangers', 4,'HE',],
            ['LE', 'I', 'Cranes & Lifting Equipment', 16,'LE',],
            ['ME', 'I', 'Marine Equipment', 17,'ME',],
            ['NDE', 'I', 'Non Destructive Examination Approval', 30,'NDE',],
            ['NF', 'I', 'Non Pressure Fabrications', 11,'NF',],
            ['NM', 'I', 'Non-Metallic Fabrications', 18,'NM',],
            ['OC', 'I', 'Oil Country Tubular Goods', 6,'OC',],
            ['PFF', 'I', 'Pipe, Fittings, Flanges & Couplings', 8,'PFF',],
            ['PG', 'I', 'Pipeline Pigging Equipment', 9,'PG',],
            ['PL', 'I', 'Pipeline Offshore Installation', 10,'PL',],
            ['PS', 'I', 'Pipe Spools', 7,'PS',],
            ['PV', 'I', 'Pressure Vessels', 2,'PV',],
            ['RE', 'I', 'Mechanical Rotating Equipment', 15,'RE',],
            ['RR', 'I', 'Road & Rail Equipment', 13,'RR',],
            ['SM', 'I', 'Steel Mill Products', 1,'SM',],
            ['VA', 'I', 'Valves & Actuators', 3,'VA',],
            ['WC', 'I', 'Well & Control Equipment', 14,'WC',],
            ['WI', 'I', 'Welding Inspection Approval', 29,'WI',]
        ];

        foreach ($skills as $skill) {
            Skill::query()->create([
                'code' => $skill[0],
                'i_e_a' => $skill[1],
                'description' => $skill[2],
                'sort' => $skill[3],
                'report_code' => $skill[4],
            ]);
        }

        Skill::query()->where('skills.i_e_a', 'I')->update(['on_skill_matrix' => ['inspection', 'specialist']]);
        Skill::query()->where('skills.i_e_a', 'E')->update(['on_skill_matrix' => ['expedition']]);
    }
}
