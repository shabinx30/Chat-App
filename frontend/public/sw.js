self.addEventListener("push", function (event) {
    const data = event.data?.json() || {};
    console.log(data);

    const promise = self.registration.showNotification(
        data.title || "New notification",
        {
            body: data.body || "notification",
            icon: data.icon || "/user.png",
            badge: "/icons/logo-small.png",
            actions: [
                { action: "open", title: "Open" },
                { action: "dismiss", title: "Dismiss" },
            ],
            tag: data.chatId,
            renotify: true,
            silent: false,
        }
    );

    event.waitUntil(promise);
});

self.addEventListener("notificationclick", function (event) {
    const action = event.action;
    const chatId = event.notification.tag

    if (action === "open") {
        event.notification.close();
        event.waitUntil(clients.openWindow(`https://chat.tungstenz.online/chat/${chatId}`));
    } else if (action === "dismiss") {
        event.notification.close();
    } else {
        event.notification.close();
        event.waitUntil(clients.openWindow(`https://chat.tungstenz.online/chat/${chatId}`));
    }
});
