import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import darktheme from './assets/components/theme';
import { ThemeProvider } from '@mui/material/styles';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={darktheme}>
            <App />
        </ThemeProvider>
    </StrictMode>,
)
