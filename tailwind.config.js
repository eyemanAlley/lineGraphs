/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // or 'media' or 'class
  theme: {
    extend: {
      backgroundColor: ['hover'],
      textColor: ['hover'],
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'login-img': "url('https://images.unsplash.com/photo-1452179535021-368bb0edc3a8?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        'landing-img': "url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        'content-img': "url('https://images.unsplash.com/photo-1508791290064-c27cc1ef7a9a?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        'visualisations-img': "url('https://images.unsplash.com/photo-1417144527634-653e3dec77b2?q=80&w=2883&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        'landing-img2': "url('/forest-bg.jpg')",
        'admin-img': "url('/admin-bg.jpg')",
      },
      fontFamily:{
        sans : ['var(--font-montserrat)'],
        serif: ['var(--font-balthazar)'],
      },
      colors: {
        customgreen: '#DDFEBC',
      },
    },
  },
  plugins: [],
}
