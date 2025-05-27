module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '32px', 
        '5xl': '40px',
        '6xl' : '50px',
        '10xl' : '100px',
        '20xl' : '200px',
      },
      fontFamily: {
        'silkscreen': ['"Silkscreen"', 'cursive'],
        'charm': ['Charm', 'sans-serif'],
        'pridi': ['Pridi', 'serif'],
        'delius': ['Delius', 'cursive'],
      },
      keyframes: {
        pushup: {
          "0%": { transform: "translateY(50px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        pushup: "pushup 0.7s ease-out",
      },
    },
  },
  plugins: [],
};
