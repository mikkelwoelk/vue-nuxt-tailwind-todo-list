/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: [
        './components/**/*.{js,vue}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.js',
        './nuxt.config.js',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
