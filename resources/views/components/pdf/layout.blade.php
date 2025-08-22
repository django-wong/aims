@props([
    'title' => 'Document',
])

<html>
    <title>{{ $title }}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body {
            font-family: "DejaVu Sans", sans-serif; font-size: 12px;
        }
        section {
            border: 1px solid #000;
        }
        .left {
            text-align: left;
        }
        .right {
            text-align: right;
        }
        @page {
            margin-top: 100px;  margin-bottom: 80px;  margin-left: 50px;  margin-right: 50px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        .table td, .table th, .content {
            border: 1px solid #bbb;
            padding: 4px;
        }
        .table td.head {
            background-color: #eee; font-weight: bold;
        }
        .table td.title {
            background-color: #f7fafc;
        }
    </style>
    <body style="position: relative; padding-top: 20px; padding-bottom: 20px;">
        {{ $slot }}
    </body>
</html>

