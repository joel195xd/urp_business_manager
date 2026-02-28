fx_version 'cerulean'
game 'gta5'

author 'Dark'
description 'Origen Masterjob Snippet'
version '1.0.0'

ui_page 'ui/index.html'

client_scripts {
    'config.lua',
    'locales.lua',
    'client/main.lua'
}

server_scripts {
    'config.lua',
    'locales.lua',
    'server/main.lua'
}

files {
    'ui/index.html',
    'ui/style.css',
    'ui/script.js',
    'config.lua',
    'locales.lua'
}
