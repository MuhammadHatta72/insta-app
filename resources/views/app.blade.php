<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/img/logo-insta.svg" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])

    <script>
        // Prevent theme flashing by applying theme before React renders
        if (window.__INERTIA_INITIAL_PAGE__) {
            const theme = window.__INERTIA_INITIAL_PAGE__.props.auth?.user?.theme || 'light';
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    </script>
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
