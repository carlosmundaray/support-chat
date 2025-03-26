const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor HTTP
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Crear servidor WebSocket
const wss = new WebSocket.Server({ server });

// Almacén de conexiones
const clients = {
    users: new Map(),    // Clientes normales
    agents: new Map()    // Agentes de soporte
};

wss.on('connection', (ws) => {
    console.log('Nueva conexión establecida');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // Registrar tipo de cliente
            if (data.type === 'register') {
                if (data.role === 'agent') {
                    clients.agents.set(data.id, ws);
                    console.log(`Agente registrado: ${data.id}`);
                    // Enviar lista de usuarios al agente
                    sendUserListToAgents();
                } else {
                    clients.users.set(data.id, ws);
                    console.log(`Usuario registrado: ${data.id}`);
                    // Notificar a los agentes sobre nuevo usuario
                    broadcastToAgents({
                        type: 'new_user',
                        userId: data.id
                    });
                }
                return;
            }
            
            // Procesar mensajes
            if (data.type === 'message') {
                console.log(`Mensaje recibido: ${JSON.stringify(data)}`);
                
                if (data.recipientType === 'agent') {
                    // Mensaje de usuario a agente
                    const agent = getAvailableAgent();
                    if (agent) {
                        agent.send(JSON.stringify({
                            type: 'message',
                            from: data.from,
                            text: data.text,
                            timestamp: new Date().toISOString(),
                            isBroadcast: false
                        }));
                    }
                } 
                else if (data.recipientType === 'user' && data.to) {
                    // Mensaje de agente a usuario específico
                    const user = clients.users.get(data.to);
                    if (user) {
                        user.send(JSON.stringify({
                            type: 'message',
                            from: data.from,
                            text: data.text,
                            timestamp: new Date().toISOString(),
                            isBroadcast: false
                        }));
                    }
                }
                else if (data.recipientType === 'broadcast') {
                    // Mensaje broadcast a todos los usuarios
                    clients.users.forEach(user => {
                        user.send(JSON.stringify({
                            type: 'message',
                            from: data.from,
                            text: data.text,
                            timestamp: new Date().toISOString(),
                            isBroadcast: true
                        }));
                    });
                }
            }
        } catch (error) {
            console.error('Error procesando mensaje:', error);
        }
    });

    ws.on('close', () => {
        // Eliminar cliente desconectado
        removeDisconnectedClient(ws);
        // Actualizar lista de usuarios para agentes
        sendUserListToAgents();
    });
});

// Funciones auxiliares
function broadcastToAgents(message) {
    clients.agents.forEach(agent => {
        agent.send(JSON.stringify(message));
    });
}

function getAvailableAgent() {
    if (clients.agents.size > 0) {
        return clients.agents.values().next().value;
    }
    return null;
}

function removeDisconnectedClient(ws) {
    clients.users.forEach((value, key) => {
        if (value === ws) {
            clients.users.delete(key);
            console.log(`Usuario desconectado: ${key}`);
        }
    });
    
    clients.agents.forEach((value, key) => {
        if (value === ws) {
            clients.agents.delete(key);
            console.log(`Agente desconectado: ${key}`);
        }
    });
}

function sendUserListToAgents() {
    const userList = Array.from(clients.users.keys());
    broadcastToAgents({
        type: 'user_list',
        users: userList
    });
}