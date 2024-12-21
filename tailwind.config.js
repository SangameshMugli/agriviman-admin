/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        'custom-blue':'#0F2946',
        'custom-button':'#0D6EFD',
        'adv-blue':'#113564',
        "card":'#6C757D40',
        "dashboard":"#ebe9e9",
        "icons":"#f0f5ff",
        "light-green":"#1da256",
        "green":"#48d483",
        "light-pink":"#c012e2",
        "pink":"#eb64fe",
        "light-blue":"#2c78e5",
        "blue":"#60aff5",
        "light-yellow":"#e1950e",
        "yellow":"#f3cd29"
        
      },
      fontFamily: {
        para: [ 'Open Sans', 'sans-serif'],
        


        
      },
      },
    },
 
  plugins: [],
}

