/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1E90FF', // Electric Blue
                    dark: '#1C86EE',
                },
                accent: {
                    DEFAULT: '#FFA500', // Orange
                    dark: '#FF8C00',
                },
            },
        },
    },
    plugins: [],
}
