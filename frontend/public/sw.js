self.addEventListener("push", function (event) {
    const data = event.data?.json() || {};
    console.log(data);

    const promise = self.registration.showNotification(
        data.title || "New notification",
        {
            body: data.body || "notification",
            icon: data.icon || "/user.png",
            actions: [
                { action: "view", title: "View" },
                { action: "dismiss", title: "Dismiss" },
            ],
            requireInteraction: true,
            silent: false,
        }
    );

    event.waitUntil(promise);
});

self.addEventListener("notificationclick", function (event) {
    const action = event.action;

    if (action === "view") {
        event.waitUntil(clients.openWindow("https://chat.tungstenz.online"));
    } else if (action === "dismiss") {
        event.notification.close();
    } else {
        event.waitUntil(clients.openWindow("https://chat.tungstenz.online"));
    }
});
