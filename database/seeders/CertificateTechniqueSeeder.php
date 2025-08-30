<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CertificateTechniqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $techniques = [
            'Auditing',
            'Dye Penetrant Inspection',
            'Electrical Engineering',
            'Electrical Installations',
            'Engineering',
            'Fabrication and Welding Engineering',
            'Fixed Installations',
            'General Inspection',
            'Hazardous Area',
            'Health / Personal',
            'Insulation',
            'Insurance',
            'Light/Dense Metals',
            'Liquid Penetrant Examination',
            'Magnetic Particle Examination',
            'Mechanical Engineering',
            'Mechanical Maintenance',
            'Metallurgy',
            'NDE',
            'NDT',
            'Painting',
            'Pipe Mill',
            'Pipeline Welding Inspection',
            'Pipework',
            'Positive Material Identification (PMI)',
            'Pressure Vessel Inspection',
            'QM01  Electrical - General',
            'QM02 Instrumentation - General',
            'QM03  Mechanical-Gen',
            'QM04  Non-Destructive Examination',
            'QM05  Line Pipe',
            'QM06  Fabricated Piping',
            'QM07  Valves',
            'QM08  Fittings',
            'QM09  Gaskets',
            'QM10  Marine Hoses',
            'QM11  Coatings - Critical',
            'QM12  Coatings - Non-Critical',
            'QM13  Lumber',
            'QM14  Fasteners',
            'QM15  Structural Steels',
            'QM16  Transformers',
            'QM17  Cables',
            'QM18  Cables (Pantograph cables)',
            'QM19  Motor Control Center-MCC',
            'QM20  Switchgear',
            'QM21 Generators and Motors',
            'QM22  Diesel and Gas Engines',
            'QM23  Communication Systems',
            'QM24  Aircraft Re-fuelers & de-fuel',
            'QM25  Cranes',
            'QM26  Rotating Equip-Pumps',
            'QM27  Rotating Equip-Compressor',
            'QM28  Rotating Equip-Turbines',
            'QM29  Rotating Equip-Gears',
            'QM30  Pressure Vessels',
            'QM31 Heat Exchangers',
            'QM32  Boilers',
            'QM33  Heaters',
            'QM34  Tanks',
            'QM35  Skid Mounted Equip-Mech',
            'QM36  Skid Mounted Equip-Elect',
            'QM37  Relief Valve, Control Valve',
            'QM38  Meter Skid, Prover Loop',
            'QM39  Process Control System',
            'QM40  DCS-Distrib Control System',
            'QM41 OCTG-Oil Country Tub Gds',
            'QM42  Wellhead Equipment',
            'QM43  Quality System Assessor',
            'QM44  HVAC',
            'QM45  Vehicles & Accessories',
            'QM46  Switchrack',
            'QM47  Panel board',
            'QM48  Cathodic protection',
            'QM49  Remote Terminal Unit -RTU',
            'QM50  Emergency Shutdown Sys.ESD',
            'QM51  Compressor/Turbine Control Systems',
            'QM52  Vibration Monitoring -VMS',
            'QM53  Marshaling Cabinets',
            'Radiographic Examination',
            'Safety',
            'Structural',
            'Time Of Flight Diffraction',
            'Ultrasonic Testing',
            'Welding Inspection',
            'Welding Quality Control Co-ordinator',
        ];

        foreach ($techniques as $technique) {
            \App\Models\CertificateTechnique::create(['name' => $technique]);
        }
    }
}
