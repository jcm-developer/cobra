<template>
    <nav>
        <RouterLink to="/" class="navbar-button">Listados</RouterLink>
        <RouterLink to="/crear" class="navbar-button">Crear</RouterLink>
    </nav>
</template>

<style scoped>
    nav {
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        background-color: rgb(56, 52, 52);
        padding: 5px;
        gap: 50px;
    }

    .navbar-button {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: grey;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        border: none;
        margin-right: 0.5rem;
        transition: background-color 0.2s ease;
    }

    .navbar-button:hover {
        background-color: #5a5a5a;
    }
</style>