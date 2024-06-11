/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blue: "#364D9D",
        "blue-light": "#647AC7",
        "red-light": "#EE7979",
        "gray-1": "#1A181B",
        "gray-2": "#3E3A40",
        "gray-3": "#5F5B62",
        "gray-4": "#9F9BA1",
        "gray-5": "#D9D8DA",
        "gray-6": "#EDECEE",
        "gray-7": "#F7F7F8",
      },
      fontFamily: {
        karlaRegular: ["Karla_400Regular"],
        karlaBold: ["Karla_700Bold"],
      },
    },
  },
  plugins: [],
};
