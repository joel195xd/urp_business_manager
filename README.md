# 💎 URP - Business Administration Panel

A high-fidelity, glassmorphism-based dashboard designed specifically for the `origen_masterjob` system in FiveM. This interface provides administrators with a powerful tool to oversee, rename, and manage businesses within the server economy.

## 📜 Legal Notice & Distribution
> [!WARNING]
> **RESTRICTED DISTRIBUTION**: This software is licensed for exclusive use within the **URP** community and designated servers. 
> 
> - **Redistribution**: Prohibited. You may not re-upload, share, or sell this code in any marketplace or public forum.
> - **Modification**: Allowed for internal server use only.
> - **Reverse Engineering**: Prohibited for the purpose of cloning or reselling.
> 
> Failure to comply with these terms may result in legal action or restriction of services.

## 🚀 Key Features
- **URP Exact Design System**: High-end visuals using `backdrop-filter` and premium color palettes.
- **Magenta Grid System**: Visual grid alignment for that signature URP aesthetic.
- **Multi-Language Support**: Fully localized in **English** and **Spanish**.
- **Real-Time Integration**: Designed to work with NUI messages and FiveM exports.
- **Search & Filtering**: Instantly find any business by label or unique ID.
- **Administrative Actions**: Quick Edit and Permanent Delete functionalities with safety confirmations.

## 🛠️ Installation & Setup
1. Download or clone this repository into your `resources/` folder.
2. Rename the folder to `urp_business_manager` (optional but recommended).
3. Add the following to your `server.cfg`:
   ```cfg
   ensure urp_business_manager
   ```
4. Configure the settings in `config.lua` to match your server needs.

## ⚙️ Configuration
The system uses a centralized Lua configuration file (`config.lua`) for server-side control:

```lua
Config.Locale = 'es' -- 'en' or 'es'
Config.Visuals = {
    ShowGrid = true,
    BlurIntensity = '10px'
}
```

## 👨‍💻 For Developers
The codebase is documented professionally to allow easy modification:
- `ui/script.js`: Core interaction logic. Handles NUI messages and DOM manipulation.
- `ui/style.css`: The "URP Exact Design System". Edit CSS variables here.
- `ui/locales/`: Contains translation JSON-like objects for easy language additions.

### Integration with `origen_masterjob`
This panel is designed to bridge with `origen_masterjob` exports. Example trigger:
```lua
-- How to send data to UI
SendNUIMessage({
    action = 'setBusinesses',
    list = businesses_data -- Array of objects matching sql schema
})
```

---
*Created for the URP ecosystem. Design and Logic by Antigravity.*
