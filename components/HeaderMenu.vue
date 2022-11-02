<template>
    <header v-if="pages" class="c-header-menu fixed w-full top-0 left-0">
        <ul
            class="c-header-menu__container flex items-center justify-center pt-5"
        >
            <li
                v-for="page in pages"
                :key="page.name"
                class="relative text-3xl mx-2 p-4 text-white capitalize leading-none after:transition-all after:ease-in-out after:duration-300 after:content-[''] after:w-0 after:h-2 after:rounded-full after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 hover:after:bg-white hover:after:w-3/4"
            >
                <nuxt-link :to="`/${page.link}`" class="p-4">
                    {{ page.name }}
                </nuxt-link>
            </li>
        </ul>
    </header>
</template>

<script>
export default {
    data() {
        return {
            // Array of page objects, matching the files in pages folder
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
