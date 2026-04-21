/** @type {import('tailwindcss').Config} */
module.exports = {
  important: 'html',
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./stories/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'elevance': ['ElevanceSans', 'system-ui', 'sans-serif'],
        'elevance-light': ['ElevanceSans-Light', 'system-ui', 'sans-serif'],
        'elevance-regular': ['ElevanceSans-Regular', 'system-ui', 'sans-serif'],
        'elevance-medium': ['ElevanceSans-Medium', 'system-ui', 'sans-serif'],
        'elevance-semibold': ['ElevanceSans-Semibold', 'system-ui', 'sans-serif'],
        'elevance-bold': ['ElevanceSans-Bold', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
        popover: 'hsl(var(--popover) / <alpha-value>)',
        'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
        destructive: 'hsl(var(--destructive) / <alpha-value>)',
        'destructive-foreground': 'hsl(var(--destructive-foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',

        primary: {
          1: '#fcfdfe',
          2: '#f6faff',
          3: '#ebf2ff',
          4: '#dceaff',
          5: '#cae0ff',
          6: '#b5d2ff',
          7: '#9dc0ff',
          8: '#7aa6fc',
          9: '#1355e9',
          10: '#114aca',
          11: '#1f59d9',
          12: '#132d64',
          13: '#1355e9',
          14: '#1355e9',
          DEFAULT: '#1355e9',
          foreground: '#f5f9ff',
        },

        secondary1: {
          1: '#fefcfc', 2: '#fff6f4', 3: '#ffeae6', 4: '#ffd7ce', 5: '#ffc8bd',
          6: '#ffbaaf', 7: '#f6a89c', 8: '#eb9083', 9: '#f2695a', 10: '#e65c4d',
          11: '#cd493c', 12: '#572c27',
        },
        secondary2: {
          1: '#fcfdfe', 2: '#f7f9fe', 3: '#ecf2fc', 4: '#dfebfd', 5: '#e1edff',
          6: '#c2d3ee', 7: '#b0c1db', 8: '#98a9c3', 9: '#697890', 10: '#5c6b83',
          11: '#5b6a82', 12: '#253247',
        },
        secondary3: {
          1: '#fbfdff', 2: '#f5f9ff', 3: '#eaf2ff', 4: '#dcebff', 5: '#cbe1ff',
          6: '#b8d3ff', 7: '#9ec1ff', 8: '#7ba7ff', 9: '#1a3673', 10: '#2b4988',
          11: '#4770c4', 12: '#142f6b',
        },
        secondary4: {
          1: '#fbfdff', 2: '#f2faff', 3: '#e4f5ff', 4: '#d1efff', 5: '#bbe7ff',
          6: '#a2dbfd', 7: '#80cbf6', 8: '#41b5f0', 9: '#44b8f3', 10: '#35ade7',
          11: '#007db5', 12: '#003a5d',
        },
        secondary5: {
          1: '#fefdfb', 2: '#fffae9', 3: '#fff3c2', 4: '#ffe99d', 5: '#ffde7a',
          6: '#fcd277', 7: '#e9c169', 8: '#d7aa3d', 9: '#ffc81d', 10: '#f8bf29',
          11: '#9b6f00', 12: '#46391e',
        },
        secondary6: {
          1: '#fcfdfa', 2: '#f7fbf3', 3: '#e8f9d5', 4: '#d9f3bb', 5: '#caeaa3',
          6: '#b9dd8b', 7: '#a4cc70', 8: '#89b742', 9: '#9ee110', 10: '#94d600',
          11: '#597d1d', 12: '#31421a',
        },

        'tertiary-foreground': '#ffffff',

        success: {
          1: '#fafefa', 2: '#f4fbf4', 3: '#e6f8e4', 4: '#d6f3d3', 5: '#c3ecbf',
          6: '#abe1a5', 7: '#8ad383', 8: '#55bf4d', 9: '#108808', 10: '#007a00',
          11: '#018200', 12: '#1b3e18',
        },
        error: {
          1: '#fffcfe', 2: '#fff7f7', 3: '#ffeae9', 4: '#ffdbd9', 5: '#ffcccb',
          6: '#ffbcbb', 7: '#f7a8a7', 8: '#ef8d8d', 9: '#d20a36', 10: '#c10028',
          11: '#d40f37', 12: '#68111c',
        },
        warning: {
          1: '#fefdfb', 2: '#fffaea', 3: '#fff3c4', 4: '#ffe9a2', 5: '#ffdf81',
          6: '#fad27d', 7: '#e7c270', 8: '#d5aa48', 9: '#ffcb37', 10: '#f8c23d',
          11: '#997000', 12: '#453a21',
        },
        gray: {
          1: '#fcfcfc', 2: '#f9f9f9', 3: '#f5f5f5', 4: '#eeeeee', 5: '#e0e0e0',
          6: '#d8d8d8', 7: '#cccccc', 8: '#949494', 9: '#666666', 10: '#585858',
          11: '#646464', 12: '#131331',
        },
      },
      rotate: {
        '293': '293deg',
        '302': '302deg',
      },
      animation: {
        'rotation': 'rotation 20s infinite cubic-bezier(0.785, 0.135, 0.15, 0.86)',
      },
      keyframes: {
        rotation: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'scale(2)' },
          '100%': { transform: 'rotate(359deg) scale(1)' },
        },
      },
      outlineColor: {
        primary: '#1355e9',
        'primary-12': '#132d64',
        'primary-14': '#1355e9',
        white: '#ffffff',
        'secondary-9': '#f2695a',
        'secondary1-9': '#f2695a',
        'secondary6-9': '#9ee110',
      },
    },
  },
  plugins: [],
}
