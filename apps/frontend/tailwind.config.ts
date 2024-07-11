import type { Config } from 'tailwindcss';

export default <Config>{
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        syncopate: ['Syncopate', 'Inter', 'sans-serif'],
      },
      spacing: {
        128: '32rem',
      },
    },
    colors: {
      transparent: '#00000000',
      'semi-transparent': 'rgba(0, 0, 0, 0.5)',
      black: '#202323',
      'black-2': '#454F50',
      white: '#ffffff',
      text: '#454F50',
      'grey-1': '#707D7E',
      'grey-2': '#899596',
      'grey-3': '#AFBCBD',
      'grey-4': '#CAD7D9',
      'grey-5': '#E5EBEC',
      'middle-grey': '#B0B0B0',
      'dark-grey': '#454950',
      background: '#F1F6F9',
      main: '#089BAB',
      'main-medium': '#6BC3CD',
      'main-light': '#D9F0F2',
      'main-dark': '#057D8A',
      'main-darker': '#05616B',
      orange: '#F2A450',
      'orange-light': '#FDF4E7',
      error: '#ED5252',
      'error-light': '#FCF0ED',
      green: '#64C68D',
      'green-2': '#ACE9C5',
      'green-dark': '#35995F',
      'green-light': '#EFFAF4',
      'green-border': '#6BC3CD',
    },
    backgroundImage: {
      'greeting-bg': "url('/assets/images/greeting-bg.svg')",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
