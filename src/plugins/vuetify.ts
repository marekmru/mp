import {createVuetify} from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

const myCustomLightTheme = {
    dark: false,
    colors: {
        background: '#FFFFFF', // Keep these if you have specific background/surface needs
        surface: '#FFFFFF',
        primary: '#1C69D4', // Your blue
        'primary-darken-1': '#134b9a', // Good practice: darken variant for hover states etc.
        secondary: '#262626', // Your black (for the "Declined" button)
        'secondary-darken-1': '#1a1a1a', // Darker black
        error: '#B00020', // Keep these standard Vuetify colors, or customize
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    }
}

export default createVuetify({
    defaults: {
        VBtn: {
            rounded: 'xs',
        },
        VTextField: {
            clearable: true,
        },
        VCard: {}
        // Add defaults for other components as needed
    },
    theme: {
        options: {customProperties: true},
        defaultTheme: 'myCustomLightTheme',
        themes: {
            myCustomLightTheme,
        },
    },
    ssr: false,
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    }
})