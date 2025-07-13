module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        global: {
          background1: "var(--global-bg-1)",
          background2: "var(--global-bg-2)",
          background3: "var(--global-bg-3)",
          background4: "var(--global-bg-4)",
          background5: "var(--global-bg-5)",
          background6: "var(--global-bg-6)",
          background7: "var(--global-bg-7)",
          background8: "var(--global-bg-8)",
          background9: "var(--global-bg-9)",
          text1: "var(--global-text-1)",
          text2: "var(--global-text-2)",
          text3: "var(--global-text-3)",
          text4: "var(--global-text-4)"
        },
        edittext: {
          background1: "var(--edittext-bg-1)",
          text1: "var(--edittext-text-1)"
        },
        button: {
          background1: "var(--button-bg-1)"
        },
        sidebar: {
          text1: "var(--sidebar-text-1)"
        }
      },
      fontFamily: {
        'ropa': ['Ropa Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};