Config = {}

-- [[ URP Business Manager - Configuración ]] --

-- Idioma por defecto ('en' o 'es')
Config.Locale = 'es'

-- Ajustes de moneda
Config.Currency = {
    Symbol = '$',
    Code = 'USD',
    Format = 'es-ES'
}

-- Preferencias visuales
Config.Visuals = {
    ShowGrid = true,       -- Activar cuadrícula magenta
    LoadingTimeout = 800,  -- Tiempo de carga simulado (ms)
    BlurIntensity = '10px' -- Intensidad de desenfoque
}

-- Permisos (Grupo de ACE o Framework)
Config.AdminGroup = 'admin'

-- Modo depuración
Config.Debug = false
