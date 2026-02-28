local QBCore = exports['qb-core']:GetCoreObject()
local isMenuOpen = false
local currentMode = 'admin'

-- Comando para abrir el panel administrativo
RegisterCommand(Config.OpenCommand, function()
    currentMode = 'admin'
    TriggerServerEvent('URP_Masterjob:RequestBusinesses', true)
end)

-- Comando para abrir el panel de jugadores
RegisterCommand(Config.PlayerCommand, function()
    currentMode = 'player'
    TriggerServerEvent('URP_Masterjob:RequestBusinesses', false)
end)

-- Keymapping para el panel de jugadores
RegisterKeyMapping(Config.PlayerCommand, 'Abrir Guía de Negocios', 'keyboard', Config.PlayerKey)

-- Abre el menú NUI con los datos
RegisterNetEvent('URP_Masterjob:OpenMenu', function(businesses)
    if isMenuOpen then return end

    isMenuOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = 'URP_OPEN_DASHBOARD',
        businesses = businesses,
        translations = Locales[Config.Locale],
        mode = currentMode
    })
end)

-- Cierre del menú
RegisterNUICallback('URP_CloseMenu', function(data, cb)
    isMenuOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        type = 'URP_CLOSE_DASHBOARD'
    })
    cb('ok')
end)

-- Actualizar nombre
RegisterNUICallback('URP_UpdateBusinessName', function(data, cb)
    TriggerServerEvent('URP_Masterjob:UpdateBusinessName', data.id, data.name)
    cb('ok')
end)

-- Eliminar negocio
RegisterNUICallback('URP_DeleteBusiness', function(data, cb)
    TriggerServerEvent('URP_Masterjob:DeleteBusiness', data.id)
    cb('ok')
end)

-- Callback para marcar GPS
RegisterNUICallback('URP_SetGPS', function(data, cb)
    if data.coords then
        SetNewWaypoint(data.coords.x, data.coords.y)
        QBCore.Functions.Notify(_U('gps_set'), "success")
    end
    cb('ok')
end)

-- Notificaciones del servidor
RegisterNetEvent('URP_Masterjob:Notify', function(msg, type)
    QBCore.Functions.Notify(msg, type)
end)

-- Refrescar lista de negocios
RegisterNetEvent('URP_Masterjob:RefreshList', function(businesses)
    if isMenuOpen then
        SendNUIMessage({
            type = 'URP_OPEN_DASHBOARD',
            businesses = businesses,
            translations = Locales[Config.Locale],
            mode = currentMode
        })
    end
end)
