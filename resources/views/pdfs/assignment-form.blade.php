<x-pdf.layout>
    <x-pdf.header>
        <table style="width: 100%; margin: 0; padding: 0; border: none; border-collapse: collapse;">
            <tr>
                <td style="height: 100%; vertical-align: bottom;" class="left">Assignment Form #{{$assignment->id}}</td>
                <td style="height: 100%; vertical-align: bottom; position: relative" class="right">
                    <img style="position: absolute; right: -4px; bottom: 8px; height: 48px; width: auto" src="{{ public_path('logo.png') }}"/>
                </td>
            </tr>
        </table>
    </x-pdf.header>
    <x-pdf.footer/>
    <x-pdf.title>Assignment Form</x-pdf.title>
    <x-pdf.alert>Assignment requirements MUST be adhered to.  Any changes MUST be referred to your coordinating office for APPROVAL</x-pdf.alert>
    <table class="table">
        <tr>
            <td colspan="4" class="head">
                Assignment Details
            </td>
        </tr>
        <tr>
            <td class="title">Assignment:</td>
            <td>#{{$assignment->id}}</td>
            <td class="title">Project Name:</td>
            <td>{{ $assignment->project->title }}</td>
        </tr>
        <tr>
            <td class="title">Inspector:</td>
            <td>{{$assignment->inspector?->name ?? 'N/A'}}</td>
            <td class="title">Assignment Date:</td>
            <td>{{ $assignment->created_at->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td class="title">Client:</td>
            <td>{{ $assignment->project->client->business_name }}</td>
            <td class="title">PO:</td>
            <td>{{ $assignment->purchase_order->title }}</td>
        </tr>
        <tr>
            <td class="title">Technical Reviewer:</td>
            <td>TODO</td>
            <td class="title">Product:</td>
            <td>TODO</td>
        </tr>
        <tr>
            <td class="title">Location:</td>
            <td colspan="3">{{ $assignment->project->client->address->full_address }}</td>
        </tr>
        <tr>
            <td class="title">Contracting Office:</td>
            <td>{{ $assignment->org->name }}</td>
            <td class="title">Operating Office:</td>
            <td>{{ $assignment->operation_org?->name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="title">Coordinator:</td>
            <td>TODO</td>
            <td class="title">Coordinator:</td>
            <td>TODO</td>
        </tr>
        <tr>
            <td colspan="4" class="head">
                Client Contact Details
            </td>
        </tr>
        <tr>
            <td class="title">Name:</td>
            <td>{{$assignment->project->client->user->name ?? 'N/A'}}</td>
            <td class="title">Email:</td>
            <td>{{ $assignment->project->client->user->email ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="title">Tel No:</td>
            <td>{{$assignment->visit_contact?->phone ?? 'N/A'}}</td>
            <td class="title">Mobile No:</td>
            <td>{{ $assignment->visit_contact?->mobile ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td colspan="4" class="head">
                Vendor Information
            </td>
        </tr>
        <tr>
            <td class="title">Main Vendor:</td>
            <td>{{$assignment->vendor?->name ?? 'N/A'}}</td>
            <td class="title">Inspection at:</td>
            <td>TODO</td>
        </tr>
        <tr>
            <td colspan="4" class="head">
                Visit Contact Details
            </td>
        </tr>
        <tr>
            <td class="title">Name:</td>
            <td>{{$assignment->visit_contact?->name ?? 'N/A'}}</td>
            <td class="title">Email:</td>
            <td>{{$assignment->visit_contact?->email}}</td>
        </tr>
        <tr>
            <td class="title">Tel No:</td>
            <td>{{$assignment->visit_contact?->phone ?? 'N/A'}}</td>
            <td class="title">Mobile No:</td>
            <td>{{$assignment->visit_contact?->mobile ?? 'N/A'}}</td>
        </tr>
    </table>
    <table class="table">
        <tr>
            <td colspan="2" class="head">
                Visit Frequency
            </td>
            <td colspan="4" class="head">
                Scope of assignment
            </td>
        </tr>
        <tr>
            <td class="title">Date of first visit if known:</td>
            <td>{{$assignment->first_visit_date?->format('d/m/Y') ?? 'N/A'}}</td>
            <td class="title">Pre-inspection meeting</td>
            <td>{{$assignment->pre_inspection_meeting ? 'YES' : 'NO'}}</td>
            <td class="title">Audit</td>
            <td>{{$assignment->audit ? 'YES' : 'NO'}}</td>
        </tr>
        <tr>
            <td class="title">Frequency:</td>
            <td>{{$assignment->visit_frequency}}</td>
            <td class="title">Final inspection</td>
            <td>{{$assignment->final_inspection ? 'YES' : 'NO'}}</td>
            <td class="title">Monitoring</td>
            <td>{{$assignment->monitoring ? 'YES' : 'NO'}}</td>
        </tr>
        <tr>
            <td class="title">Number of hours:</td>
            <td>{{$assignment->hours_per_visit}}</td>
            <td class="title">Visual / dimensional</td>
            <td>{{$assignment->dimensional ? 'YES' : 'NO'}}</td>
            <td class="title">Expediting</td>
            <td>{{$assignment->expediting ? 'YES' : 'NO'}}</td>
        </tr>
        <tr>
            <td class="title">Days:</td>
            <td>{{$assignment->total_visits}}</td>
            <td class="title">Packing / pre shipment</td>
            <td>{{$assignment->packing ? 'YES' : 'NO'}}</td>
            <td class="title">Witness of tests</td>
            <td>{{$assignment->witness_of_tests ? 'YES' : 'NO'}}</td>
        </tr>
        <tr>
            <td colspan="2"></td>
            <td class="title">Sample inspection</td>
            <td>{{$assignment->sample_inspection ? 'YES' : 'NO'}}</td>
            <td class="title">Document review</td>
            <td>{{$assignment->document_review ? 'YES' : 'NO'}}</td>
        </tr>
    </table>
    <table class="table">
        <tr>
            <td colspan="4" class="head">Reporting</td>
            <td colspan="2" class="head">Status/flash report or exit call</td>
        </tr>
        <tr>
            <td class="title">Report format:</td>
            <td>{{$assignment->report_format}}</td>
            <td class="title">Reporting frequency:</td>
            <td>{{$assignment->reporting_frequency}}</td>
            <td class="title">Exit Call:</td>
            <td>{{$assignment->exit_call ? 'YES' : 'NO'}}</td>
        </tr>
        <tr>
            <td class="title">Send report to:</td>
            <td>{{$assignment->report_format}}</td>
            <td class="title">Timesheet:</td>
            <td>{{$assignment->timesheet}}</td>
            <td class="title">Status/Flash Report:</td>
            <td>{{$assignment->flash_report ? 'YES' : 'NO'}}</td>
        </tr>
        <tr>
            <td class="title">NCR format:</td>
            <td>{{$assignment->ncr_format}}</td>
            <td class="title">Punch list format:</td>
            <td>{{$assignment->punch_list_format}}</td>
            <td class="title">Contact Detail:</td>
            <td>TODO</td>
        </tr>
        <tr>
            <td class="title">IRN format:</td>
            <td>{{$assignment->irn_format}}</td>
            <td class="title">Issue IRN to vendor:</td>
            <td>TODO</td>
            <td class="title">Email:</td>
            <td>{{$assignment->report_email}}</td>
        </tr>
        <tr>
            <td class="title">Document stamp:</td>
            <td>TODO</td>
            <td colspan="4"></td>
        </tr>
    </table>
    <table class="table">
        <tr>
            <td class="head">Special Notes</td>
        </tr>
    </table>
    <div class="content" style="border-top: none; white-space: preserve;">
        Report (in sentence case lettering) must be submitted to the BIE office by 10:00 hrs on the day following the visit with all relevant documents attached. A flash email must be sent, and an exit call made if required. <br/>
        Continued <br/>
        <br/>
        Inspections in accordance with: <br/>
        Specifications / Drawings & Data Sheets: <br/>
        Rev No: <br/>
        image003.png <br/>
        Notes: <br/>
        1.                   With each visit an inspection report shall be sent within 48 hours. If there is more than one visit in a week on the same inspection assignment a single report at the end of the week will suffice for each assignment, provided flash report for each visit at the end of the day. <br/>
        2.                   Problems arising from Inspection visits that require urgent resolution shall be reported immediately via telephone or e-mail to Wood from Suppliers works at each visit. <br/>
        3.                   Inspection and test records shall be progressively signed off and following with ITP sign off (No separate visit for MDR review) prior to release. <br/>
        4.                   The ITP should be signed off against all R, W and H points, where the inspector visited to monitor an activity these should also be signed off. <br/>
        5.                   Inspection Release Note shall only be issued directly to Wood unless specific instruction given for the package. Inspector must report to Wood before leaving the premises if any issues have been identified which could potentially impact the release. <br/>
        6.                   Final Inspection release certificate will only be issued to Supplier, after confirming by Wood Quality Advisor that all SDRL documents are approved. <br/>
        7.                   The final signed off ITP should be submitted along with the release note. <br/>
        <br/>
        Comments: <br/>
        Weekly inspection of one day a week progressing to two days once testing starts <br/>
        Review material certificates and accept on Woods behalf <br/>
        Review test certificates and accept on Woods behalf <br/>
        Witness testing <br/>
        Inspect Modules for compliance with Woodside specifications and Australian regulations <br/>
        Progressively sign ITP <br/>
        Monitor MDR is being compiled progressively <br/>
        Inspect packaging in in compliance with Woodside specifications <br/>
        Issue weekly reports and flash reports when required <br/>
        Issue IRN to release equipment <br/>
        Attend weekly meeting with Wood/client <br/>
        <br/>
        Start Date : <br/>
        Pre-Inspection Meeting before start date TBC with inspector for their availability <br/>
        TBA – October <br/>
        <br/>
        Client Requirements: <br/>
        Subject in Emails must contain the BIE and Client inspection assignment numbers, client PO Number, Vendor Details and equipment description. example: WOOD_W97330_ABB_BIE_13146 <br/>
        Flash Report to be sent after each visit by inspector via email directly to Client CC. report.au@biegroup.com <br/>
        BIE Flash Report, BIE Template format to be used. <br/>
        Formal Client Inspection Report and Release forms are to be used and are to be sent to client by BIE. <br/>
        Report Numbering Format & File Name of report must be in accordance with client requirements: <br/>
        <br/>
        EXAMPLES for reports. flash reports / release notes: <br/>
        Flash report: WOOD_W97330_ABB_BIE_13146_FR-01… 02… etc <br/>
        Inspection Report: WOOD_W97330_ABB_BIE_13146_IR-01… 02… etc <br/>
        Release: WOOD_W97330_ABB_BIE_13146_IRC-01… 02… etc <br/>
        <br/>
        FLASH REPORTS to be Transmitted Direct to Client - Recipients: <br/>
        Martin Shaw: martin.shaw@woodplc.com <br/>
        cc. Hoascar, Bianca <bianca.hoascar@woodplc.com  / reports.au@biegroup.com <br/>
        <br/>
        The Flash Email Report must take the following format: <br/>
        <br/>
        CLIENT P.O. NO:………………………………………. <br/>
        BIE REFERENCE NO: …………………………………. <br/>
        VENDOR NAME:…………………………………… <br/>
        INSPECTION LOCATION:………………………… <br/>
        INSPECTOR NAME:……………………………… <br/>
        DATE OF INSPECTION:…………………………… <br/>
        P.O. ITEM NO. & BRIEF DESCRIPTION:……. <br/>
        ITP ACTIVITY NO.: …………………………………………. <br/>
        INSPECTION RESULT ACCEPTABLE:       YES/NO <br/>
        REASON NOT ACCEPTABLE: <br/>
        Note: This must be in the body of the email and NOT in the form of an email attachment.
    </div>
    <table class="table">
        <tr>
            <td colspan="4" class="head">Assignee Declaration</td>
        </tr>
        <tr>
            <td colspan="4">
                The assignment must be carried out in accordance with the BIE Code of Conduct and the BIE Health & Safety System which are available on the BIE Group Extranet. <br> The assignee signs for receipt of assignment and understands the scope of assignment based on full review of critical documents listed in Special Notes section.  <br>Please notify the BIE Coordinator immediately if any documents have not been received or if you are unable to perform this assignment.
            </td>
        </tr>
        <tr>
            <td colspan="4" class="head">Assignment Acknowledgment</td>
        </tr>
        <tr>
            <td colspan="4">
                Please acknowledge this assignment package with of the below methods: <br>
                1. Scan the below QR Code and sign, system will then post your signature on the document and forward it to BIE Coordinator. <br>
                <img style="height: 100px; width: auto" src="@qr(route('assignments.ack', ['id' => $assignment->id]))"/> <br>
                2. Print out this Assignment Form, sign and send back to BIE Coordinator manually <br>
            </td>
        </tr>
        <tr>
            <td class="title">Signature:</td>
            <td></td>
            <td class="title">Date:</td>
            <td></td>
        </tr>
    </table>
</x-pdf.layout>
