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
            <td>{{$assignment_inspector?->user?->name ?? 'N/A'}}</td>
            <td class="title">Assignment Type:</td>
            <td>{{ $assignment_inspector->assignment_type->name }}</td>
        </tr>
        <tr>
            <td class="title">Client:</td>
            <td>{{ $assignment->project->client->business_name }}</td>
            <td class="title">PO:</td>
            <td>{{ $assignment->purchase_order->title }}</td>
        </tr>
        <tr>
            <td class="title">Coordinator</td>
            <td>{{ $assignment->project->client->coordinator?->name ?? 'N/A' }}</td>
            <td class="title">Technical Reviewer:</td>
            <td>{{ $assignment->project->client->reviewer?->name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="title">Approved by:</td>
            <td>TODO</td>
            <td class="title">Date:</td>
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
    <x-pdf.page-break/>

    @if($assignment->special_notes)
    <table class="table">
        <tr>
            <td class="head">Special Notes</td>
        </tr>
    </table>
    <div class="content" style="border-top: none; white-space: preserve;">
        {{ $assignment->special_notes }}
    </div>
    @endif

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
                <img style="height: 100px; width: auto" src="@qr(route('assignments.record', ['id' => $assignment->id]))"/> <br>
                2. Print out this Assignment Form, sign and send back to BIE Coordinator manually <br>
            </td>
        </tr>
        <tr>
            <td class="title">Signature:</td>
            <td>@if(! empty($assignment_inspector->signature_base64)) <img style="height: 100px; width: auto" src="{{ $assignment_inspector->signature_base64 }}"/> @endif</td>
            <td class="title">Date:</td>
            <td>{{ $assignment_inspector->acked_at?->format('d/m/Y H:i:s T') ?? 'N/A' }}</td>
        </tr>
    </table>
</x-pdf.layout>
