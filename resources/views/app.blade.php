<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M256 0C114.616 0 .001 114.615.001 255.999c0 50.147 14.421 96.924 39.339 136.413l472.599-141.118C509.429 112.083 395.812 0 256 0z' fill='%234a75c3'/%3E%3Cpath d='M511.999 255.999c0-1.573-.031-3.138-.06-4.705L320.93 60.286l-129.862 180.45 88.123 88.123-149.723 149.723C166.791 499.844 209.975 511.999 256 512c141.385-.001 255.999-114.615 255.999-256.001z' fill='%234f5aa8'/%3E%3Cpath d='M437.129 205.913c-11.951-11.951-31.337-11.951-43.287 0l-125.03 125.031L299.43 386.9l137.7-137.7c11.949-11.951 11.949-31.337-.001-43.287z' fill='%236faee8'/%3E%3Cpath d='M472.932 241.717c-11.951-11.951-31.335-11.951-43.287 0L328.564 342.798l-134.692-13.842L63.8 367.955l-24.451 24.451c22.466 35.607 53.458 65.29 90.121 86.176l23.414-23.414 163.217-30.874c12.013-2.365 28.925-11.384 37.582-20.041l119.25-119.25c11.951-11.951 11.951-31.336-.001-43.286z' fill='%23bcdef7'/%3E%3Ccircle cx='256' cy='125' r='92' fill='%23ffd652'/%3E%3C/svg%3E">

    <title inertia>{{ config('app.name', 'app-iuran-kas') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>