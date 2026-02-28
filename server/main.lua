local QBCore = exports['qb-core']:GetCoreObject()
local MySQL = exports.oxmysql

-- Obtiene la lista de negocios formateada
-- Obtiene la lista de negocios formateada
local function URP_GetBusinessList(cb)
    local businesses = exports['origen_masterjob']:GetBusinesses()

    MySQL:query('SELECT id, money, label FROM origen_masterjob', {}, function(dbData)
        local formatted = {}
        local dbMap = {}

        if dbData then
            for _, row in ipairs(dbData) do
                dbMap[row.id] = row
            end
        end

        if businesses then
            for id, data in pairs(businesses) do
                local employeesOnDuty = exports['origen_masterjob']:GetEmployeesOnDuty(id) or 0
                local coords = data.coords or data.location

                local isOpen = false
                if data.open == 1 or data.open == true then
                    isOpen = true
                elseif type(employeesOnDuty) == 'table' then
                    isOpen = #employeesOnDuty > 0
                else
                    isOpen = (tonumber(employeesOnDuty) or 0) > 0
                end

                local dbBiz = dbMap[id]
                table.insert(formatted, {
                    id = id,
                    name = (dbBiz and dbBiz.label) or data.label or data.name or id,
                    isOpen = isOpen,
                    coords = coords,
                    money = (dbBiz and dbBiz.money) or 0
                })
            end
        end
        if cb then cb(formatted) end
    end)
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
RegisterNetEvent('URP_Masterjob:RequestBusinesses', function(isAdminRequest)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player then return end

    if isAdminRequest then
        if HasPermission(src) then
            URP_GetBusinessList(function(businesses)
                TriggerClientEvent('URP_Masterjob:OpenMenu', src, businesses)
            end)
        else
            TriggerClientEvent('URP_Masterjob:Notify', src, _U('no_permission'), "error")
        end
    else
        URP_GetBusinessList(function(businesses)
            TriggerClientEvent('URP_Masterjob:OpenMenu', src, businesses)
        end)
    end
end)

-- Actualizar nombre del negocio (Usa 'label' en DB)
RegisterNetEvent('URP_Masterjob:UpdateBusinessName', function(businessId, newName)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player or not HasPermission(src) then return end

    MySQL:update('UPDATE origen_masterjob SET label = ? WHERE id = ?', {
        newName, businessId
    }, function(rowsChanged)
        if (tonumber(rowsChanged) or 0) > 0 then
            TriggerClientEvent('URP_Masterjob:Notify', src, _U('name_updated'), "success")

            -- Refrescar lista para todos
            URP_GetBusinessList(function(businesses)
                TriggerClientEvent('URP_Masterjob:RefreshList', -1, businesses)
            end)
        else
            TriggerClientEvent('URP_Masterjob:Notify', src, _U('name_error'), "error")
        end
    end)
end)

-- Actualizar dinero del negocio (Añadir/Quitar)
RegisterNetEvent('URP_Masterjob:UpdateBusinessMoney', function(data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player or not HasPermission(src) or not data then return end

    local bizId = data.id
    local type = data.type
    local amount = tonumber(data.amount)

    if not bizId or not type or not amount or amount <= 0 then return end

    -- Obtenemos el dinero actual primero para operar
    MySQL:scalar('SELECT money FROM origen_masterjob WHERE id = ?', {
        bizId
    }, function(currentMoney)
        if currentMoney ~= nil then
            local newMoney = 0
            if type == 'add' then
                newMoney = currentMoney + amount
            elseif type == 'remove' then
                newMoney = math.max(0, currentMoney - amount)
            end

            MySQL:update('UPDATE origen_masterjob SET money = ? WHERE id = ?', {
                newMoney, bizId
            }, function(rowsChanged)
                if (tonumber(rowsChanged) or 0) > 0 then
                    TriggerClientEvent('URP_Masterjob:Notify', src, _U('money_updated'), "success")
                    URP_GetBusinessList(function(businesses)
                        TriggerClientEvent('URP_Masterjob:RefreshList', -1, businesses)
                    end)
                else
                    TriggerClientEvent('URP_Masterjob:Notify', src, _U('money_error'), "error")
                end
            end)
        end
    end)
end)

-- Eliminar negocio por completo
RegisterNetEvent('URP_Masterjob:DeleteBusiness', function(businessId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player or not HasPermission(src) then return end

    -- Usamos el comando de staff de origen_masterjob para asegurar limpieza total
    ExecuteCommand('deletebusiness ' .. businessId)

    TriggerClientEvent('URP_Masterjob:Notify', src, _U('biz_deleted'), "success")

    -- Refrescar lista
    SetTimeout(500, function()
        URP_GetBusinessList(function(businesses)
            TriggerClientEvent('URP_Masterjob:RefreshList', -1, businesses)
        end)
    end)
end)
