self.addEventListener("push", function (event) {
    const data = event.data?.json() || {};
    const title = data.title || "New notification";
    const body = data.body || "notification";
    let iconUrl = data.icon || "/user.png";

    // 🔐 Force HTTPS
    // if (iconUrl.startsWith("http://")) {
    //     iconUrl = iconUrl.replace("http://", "https://");
    // }

    const badgeUrl = "/icons/logo-small.png";

    async function preloadAndNotify() {

        console.log(iconUrl)

        return self.registration.showNotification(title, {
            body,
            icon: iconUrl,
            badge: badgeUrl,
            actions: [
                { action: "open", title: "Open" },
                { action: "dismiss", title: "Dismiss" },
            ],
            tag: data.chatId,
            renotify: true,
            silent: false,
        });
    }

    event.waitUntil(preloadAndNotify());
});

self.addEventListener("notificationclick", function (event) {
    const action = event.action;
    const chatId = event.notification.tag;

    if (action === "open") {
        event.notification.close();
        event.waitUntil(
            clients.openWindow(`https://chat.tungstenz.online/chat/${chatId}`)
        );
    } else if (action === "dismiss") {
        event.notification.close();
    } else {
        event.notification.close();
        event.waitUntil(
            clients.openWindow(`https://chat.tungstenz.online/chat/${chatId}`)
        );
    }
});
