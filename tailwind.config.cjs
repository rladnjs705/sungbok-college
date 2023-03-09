/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        // custom animation 이름과 keyframes 이름을 매칭합니다.
        'slide-in': 'slide-in .5s ease-in-out',
        'slide-out': 'slide-out .5s ease-in-out',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}