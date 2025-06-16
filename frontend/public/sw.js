self.addEventListener("push", function (event) {
    const data = event.data?.json() || {};
    const title = data.title || "New notification";
    const body = data.body || "notification";
    const iconUrl = data.icon || "/user.png";
    const badgeUrl = "/icons/logo-small.png";

    async function preloadAndNotify() {
        let icon = "/user.png";

        try {
            const response = await fetch(iconUrl, { mode: "cors" }); // must be cors!
            const blob = await response.blob();
            icon = URL.createObjectURL(blob); // convert to blob URL
        } catch (err) {
            console.warn("Failed to preload icon, using fallback:", err);
        }

        return self.registration.showNotification(title, {
            body,
            icon, // now this is a blob URL
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
