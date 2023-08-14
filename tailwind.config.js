/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}'
  ],
  // future: {
  //   hoverOnlyWhenSupported: true,
  // },
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        current: 'var(--text-color)',
        light: 'var(--bg-color)',
        lightPrimary: '#505054',
        dark: 'var()',
        darkGreen: '#222325',
        iridium: '#3C3C3D',
        gunmetal: '#2F3033',
        santaGrey: '#98A2B3',
        lightGray: '#919EAB',
        dodgerBlue: '#43CAE9',
        paleRed: '#DF4F45',
        riverBed: '#475467',
        dodgeBlue: '#43CAE9',
        night: '#0B0B0B',
        thunder: '#2F2F2F',
        mistBlue: '#667085',
        neutralLight: '#F1F4F9',
        paperLight: '#FCFCFC',
        primary100: '#EFF4FF',
        buttonLight: '#eef2f4',
        primary500: '#43CAE9',
        primary400: '#709FFF',
        grey800: '#1D2939',
        lightLine: '#EAEAEA',
        grey: 'rgba(145, 158, 171, 0.16)',
        gey100: '#EFF2F5',
        grey500: '#84848480',
        lightSecondary: '#949494',
        green: '#0F6444',
        greenLight: '#89D9BB',
        yellow: '#E37318',
        yellowLight: '#FFB98C',
        red: '#CE170A',
        redLight: '#F4AAA5',
        warning: '#FFD666',
        reddishOrange: '#FFAC82',
        tealishGreen: '#5BE584',
        tealishBlue: '#D0D5DD',
        warningLight: 'rgba(255, 171, 0, 0.16)',
        primaryLight: 'rgba(0, 171, 85, 0.16)',
        ErrorLight: 'rgba(255, 86, 48, 0.16)',
        secondary: '#84A9FF',
        secondaryLight: 'rgba(51, 102, 255, 0.16)',
        info: '#61F3F3',
        infoLight: 'rgba(0, 184, 217, 0.16)'
      },
      textColor: {
        skin: {
          base: 'var(--text-color)'
        }
      },
      backgroundColor: {
        skin: {
          base: 'var(--bg-color)'
        }
      },
      animation: {
        slideInLeft: 'slideIn .3s ease'
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(calc(100% + 32px))', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 }
        }
      },
      maxWidth: {
        50: '50%',
        60: '60%',
        70: '70%',
        80: '80%',
        90: '90%'
      },
      minWidth: {
        50: '50%',
        60: '60%',
        70: '70%',
        80: '80%',
        90: '90%'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};
