# Chat de Soporte en Tiempo Real con WebSockets

![Demo del Chat](http://localhost:3000) <!-- Reemplaza con una imagen real de tu proyecto -->
![Demo del Chat Soporte](http://localhost:3000/agent.html) <!-- Reemplaza con una imagen real de tu proyecto -->
Un sistema de chat de soporte en tiempo real implementado con Node.js y WebSockets, con interfaz responsive que funciona en todos los dispositivos.

## Características principales

- 💬 **Chat en tiempo real** entre clientes y agentes de soporte
- ✉️ **Mensajes individuales** a clientes específicos
- 📢 **Mensajes broadcast** a todos los clientes conectados
- 📱 **Diseño completamente responsive** para móviles, tablets y desktop
- 🟢 **Indicador de conexión** en tiempo real
- 👥 **Lista de clientes conectados** para agentes
- 🎨 **Interfaz intuitiva** con estilos diferenciados para mensajes

## Tecnologías utilizadas

- **Backend**:
  - Node.js
  - Express
  - WebSocket (biblioteca `ws`)

- **Frontend**:
  - HTML5
  - CSS3 (con diseño responsive)
  - JavaScript vanilla

## Instalación y configuración

1. Clona el repositorio:
```bash
git clone https://github.com/carlosmundaray/support-chat.git
cd support-chat
npm i
npm run dev