import * as signalR from "@microsoft/signalr";

let connection = null;

export const startSignalRConnection = (jwtToken) => {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.viecvat247.com/notificationHub", {
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => `${jwtToken}`,
            })
            .build();

        connection
            .start()
            .then(() => {
                console.log("Connected to SignalR Hub");
            })
            .catch((err) => console.error(err));

        connection.onclose((error) => {
            console.log("Connection closed with error:", error);
        });
    }

    return connection;
};

export const stopSignalRConnection = () => {
    if (connection) {
        connection.stop();
        connection = null;
    }
};

export const getConnection = () => connection;
