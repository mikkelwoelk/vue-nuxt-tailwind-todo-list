<template>
    <header class="c-header-menu fixed w-full p-4 top-0 left-0 z-50">
        <ul
            class="c-header-menu__container h-full flex items-center justify-center"
        >
            <li
                v-for="page in pages"
                :key="page.name"
                class="p-4 mx-4 text-3xl text-white capitalize"
            >
                <nuxt-link :to="`/${page.link}`"> {{ page.name }} </nuxt-link>
            </li>
        </ul>
    </header>
</template>

<script>
export default {
    data() {
        return {
            pages: [
                { name: 'home', link: '' },
                { name: 'archive', link: 'archive' },
                { name: 'more', link: 'more' },
            ],
        }
    },
}
</script>

<style scoped>
.c-header-menu {
    background-color: var(--clr-secondary);
}
</style>
