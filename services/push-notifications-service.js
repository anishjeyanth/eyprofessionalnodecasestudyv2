const socketIO = require('socket.io');
const { ErrorConstants } = require('../constants');
const { RandomGenerator } = require('../utilities');

class PushNotificationsService {
    constructor(httpServer) {
        if (!httpServer) {
            throw new Error(ErrorConstants.INVALID_ARGUMENTS);
        }

        this.httpServer = httpServer;
        this.initializeSocketServer();
    }

    initializeSocketServer() {
        this.socketIOServer = socketIO.listen(this.httpServer);
        this.socketIOServer.on('connection', socketClient => {
            socketClient.socketClientId = RandomGenerator.generate();

            console.log(`Socket Client ${socketClient.socketClientId} Connected ...`);

            socketClient.on('disconnect', () => {
                console.log(`Socket Client ${socketClient.socketClientId} Disconnected ...`);
            });
        });
    }

    notifySocketClients(eventName, notificationMessage) {
        let validation = eventName && notificationMessage;
        
        if (validation) {
            this.socketIOServer.emit(eventName, notificationMessage);
        }
    }
}

module.exports = PushNotificationsService;
