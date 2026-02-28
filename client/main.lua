local QBCore = exports['qb-core']:GetCoreObject()
local isMenuOpen = false

-- Comando para abrir el panel
RegisterCommand(Config.OpenCommand, function()
    TriggerServerEvent('URP_Masterjob:RequestBusinesses')
end)

-- Abre el menú NUI con los datos
RegisterNetEvent('URP_Masterjob:OpenMenu', function(businesses)
    if isMenuOpen then return end

    isMenuOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = 'URP_OPEN_DASHBOARD',
        businesses = businesses,
        translations = Locales[Config.Locale]
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
            translations = Locales[Config.Locale]
        })
    end
end)
