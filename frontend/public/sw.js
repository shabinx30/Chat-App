self.addEventListener("push", async function (event) {
    const data = event.data?.json() || {};
    const title = data.title || "New notification";
    const body = data.body || "notification";
    const iconUrl = data.icon || "/user.png";
    const badgeUrl = "/icons/logo-small.png";

    const preloadIcon = async (url) => {
        try {
            const res = await fetch(url, { mode: "no-cors" });
            if (!res.ok) throw new Error("Image not fetched properly");
            
            return url;
        } catch (e) {
            console.warn("Failed to preload icon, fallback used:", e);
            return "/user.png";
        }
    };

    const show = async () => {
        const icon = await preloadIcon(iconUrl);

        return self.registration.showNotification(title, {
            body,
            icon,
            badge: badgeUrl,
            actions: [
                { action: "open", title: "Open" },
                { action: "dismiss", title: "Dismiss" },
            ],
            tag: data.chatId,
            renotify: true,
            silent: false,
        });
    };

    event.waitUntil(show());
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
