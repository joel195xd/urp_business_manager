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
    ['confirm_delete'] = "Are you sure you want to delete the business \"%s\"? This action cannot be undone."
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
    ['confirm_delete'] = "¿Estás seguro de que deseas eliminar el negocio \"%s\"? Esta acción no se puede deshacer."
}

function _U(str, ...)
    if Locales[Config.Locale] and Locales[Config.Locale][str] then
        return string.format(Locales[Config.Locale][str], ...)
    else
        return 'Translation [' .. Config.Locale .. '][' .. str .. '] not found'
    end
end
