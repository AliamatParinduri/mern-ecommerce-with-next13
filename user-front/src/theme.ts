import { createContext, useState, useMemo } from 'react'
import { createTheme } from '@mui/material/styles'

// color design tokens export
const darkTheme = {
  grey: {
    100: '#e0e0e0',
    200: '#c2c2c2',
    300: '#a3a3a3',
    400: '#858585',
    500: '#666666',
    600: '#525252',
    700: '#3d3d3d',
    800: '#292929',
    900: '#141414',
  },
  primary: {
    100: '#d0d1d5',
    200: '#a1a4ab',
    300: '#727681',
    400: '#1F2A40',
    500: '#141b2d',
    600: '#101624',
    700: '#0c101b',
    800: '#080b12',
    900: '#040509',
  },
  secondary: {
    100: '#d6d6dc',
    200: '#acadb8',
    300: '#838595',
    400: '#595c71',
    500: '#30334e',
    600: '#26293e',
    700: '#1d1f2f',
    800: '#13141f',
    900: '#0a0a10',
  },
  textColor: {
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#cccccc',
    700: '#999999',
    800: '#666666',
    900: '#333333',
  },
}

const lightTheme = {
  grey: {
    100: '#141414',
    200: '#292929',
    300: '#3d3d3d',
    400: '#525252',
    500: '#666666',
    600: '#858585',
    700: '#a3a3a3',
    800: '#c2c2c2',
    900: '#e0e0e0',
  },
  primary: {
    100: '#fdfdfe',
    200: '#fcfcfd',
    300: '#fafafb',
    400: '#f9f9fa',
    500: '#f7f7f9',
    600: '#c6c6c7',
    700: '#949495',
    800: '#636364',
    900: '#313132',
  },
  secondary: {
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#cccccc',
    700: '#999999',
    800: '#666666',
    900: '#333333',
  },
  textColor: {
    100: '#fdfdfe',
    200: '#fcfcfd',
    300: '#fafafb',
    400: '#f9f9fa',
    500: '#f7f7f9',
    600: '#c6c6c7',
    700: '#949495',
    800: '#636364',
    900: '#313132',
  },
}

export const tokens = (mode: string) => ({
  ...(mode === 'dark' ? { ...darkTheme } : { ...lightTheme }),
})

// mui theme settings
export const themeSettings = (mode: any) => {
  const colors = tokens(mode)
  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              dark: colors.secondary[700],
              main: colors.secondary[500],
              light: colors.secondary[100],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
            activeMenu: {
              default: '#787eff',
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
            activeMenu: {
              default: '#787eff',
            },
          }),
    },
    typography: {
      fontFamily: ['Inter', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 14,
      },
    },
  }
}

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
})

export const useMode = () => {
  const [mode, setMode] = useState('dark')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  )

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  return [theme, colorMode]
}
