local QBCore = exports['qb-core']:GetCoreObject()

-- Obtiene la lista de negocios formateada
local function URP_GetBusinessList()
    local businesses = exports['origen_masterjob']:GetBusinesses()
    local formatted = {}

    if businesses then
        for id, data in pairs(businesses) do
            local employeesOnDuty = exports['origen_masterjob']:GetEmployeesOnDuty(id) or 0
            table.insert(formatted, {
                id = id,
                name = data.name or id,
                isOpen = employeesOnDuty > 0
            })
        end
    end

    return formatted
end

-- Verifica permisos administrativa
local function HasPermission(src)
    for _, group in ipairs(Config.AdminGroups) do
        if QBCore.Functions.HasPermission(src, group) then
            return true
        end
    end
    return false
end

-- Petición de negocios desde el cliente
RegisterNetEvent('URP_Masterjob:RequestBusinesses', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player then return end

    if HasPermission(src) then
        local businesses = URP_GetBusinessList()
        TriggerClientEvent('URP_Masterjob:OpenMenu', src, businesses)
    else
        TriggerClientEvent('URP_Masterjob:Notify', src, _U('no_permission'), "error")
    end
end)

-- Actualizar nombre del negocio
RegisterNetEvent('URP_Masterjob:UpdateBusinessName', function(businessId, newName)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player or not HasPermission(src) then return end

    MySQL.Async.execute('UPDATE ' .. Config.BusinessTable .. ' SET name = @name WHERE business_id = @id', {
        ['@name'] = newName,
        ['@id'] = businessId
    }, function(rowsChanged)
        if rowsChanged > 0 then
            TriggerClientEvent('URP_Masterjob:Notify', src, _U('name_updated'), "success")

            -- Refrescar lista para administradores
            local businesses = URP_GetBusinessList()
            TriggerClientEvent('URP_Masterjob:RefreshList', -1, businesses)
        else
            TriggerClientEvent('URP_Masterjob:Notify', src, _U('name_error'), "error")
        end
    end)
end)

-- Eliminar negocio por completo
RegisterNetEvent('URP_Masterjob:DeleteBusiness', function(businessId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player or not HasPermission(src) then return end

    MySQL.Async.execute('DELETE FROM ' .. Config.BusinessTable .. ' WHERE business_id = @id', {
        ['@id'] = businessId
    }, function(rowsChanged)
        if rowsChanged > 0 then
            TriggerClientEvent('URP_Masterjob:Notify', src, _U('biz_deleted'), "success")

            -- Refrescar lista
            local businesses = URP_GetBusinessList()
            TriggerClientEvent('URP_Masterjob:RefreshList', -1, businesses)
        else
            TriggerClientEvent('URP_Masterjob:Notify', src, _U('delete_error'), "error")
        end
    end)
end)
