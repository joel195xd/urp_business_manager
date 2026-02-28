Locales = {}

Locales['en'] = {
    ['no_permission'] = "You do not have permission to use this.",
    ['name_updated'] = "Name updated successfully.",
    ['name_error'] = "Error updating name.",
    ['biz_deleted'] = "Business deleted successfully.",
    ['delete_error'] = "Error deleting business.",
    -- UI Strings
    ['panel_title'] = "Business Dashboard",
    ['search_placeholder'] = "Search business...",
    ['status_open'] = "OPEN",
    ['status_closed'] = "CLOSED",
    ['edit_btn'] = "Edit",
    ['delete_btn'] = "Delete",
    ['prompt_new_name'] = "Enter new name for %s:",
    ['confirm_delete'] = "Are you sure you want to delete the business \"%s\"? This action cannot be undone.",
    ['gps_btn'] = "GPS",
    ['player_panel_title'] = "Business List",
    ['gps_set'] = "Waypoint set to business location.",
    ['cancel_btn'] = "Cancel",
    ['confirm_btn'] = "Confirm",
    ['balance_label'] = "Balance",
    ['manage_btn'] = "Manage",
    ['manage_title'] = "Business Management",
    ['money_updated'] = "Money updated successfully.",
    ['money_error'] = "Error updating money."
}

Locales['es'] = {
    ['no_permission'] = "No tienes permisos para usar esto.",
    ['name_updated'] = "Nombre actualizado correctamente.",
    ['name_error'] = "Error al actualizar el nombre.",
    ['biz_deleted'] = "Negocio eliminado correctamente.",
    ['delete_error'] = "Error al eliminar el negocio.",
    -- UI Strings
    ['panel_title'] = "Panel de Negocios",
    ['search_placeholder'] = "Buscar negocio...",
    ['status_open'] = "ABIERTO",
    ['status_closed'] = "CERRADO",
    ['edit_btn'] = "Editar",
    ['delete_btn'] = "Eliminar",
    ['prompt_new_name'] = "Introduce el nuevo nombre para %s:",
    ['confirm_delete'] = "¿Estás seguro de que deseas eliminar el negocio \"%s\"? Esta acción no se puede deshacer.",
    ['gps_btn'] = "GPS",
    ['player_panel_title'] = "Guía de Negocios",
    ['gps_set'] = "Ubicación del negocio marcada en el GPS.",
    ['cancel_btn'] = "Cancelar",
    ['confirm_btn'] = "Confirmar",
    ['balance_label'] = "Capital",
    ['manage_btn'] = "Gestionar",
    ['manage_title'] = "Gestión de Negocio",
    ['money_updated'] = "Dinero actualizado correctamente.",
    ['money_error'] = "Error al actualizar el dinero."
}

function _U(str, ...)
    if Locales[Config.Locale] and Locales[Config.Locale][str] then
        return string.format(Locales[Config.Locale][str], ...)
    else
        return 'Translation [' .. Config.Locale .. '][' .. str .. '] not found'
    end
end
