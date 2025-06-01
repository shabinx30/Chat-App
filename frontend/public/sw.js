self.addEventListener("push", function (event) {
    const data = event.data.json();
    self.registration.showNotification(data.title || 'New notification', {
        body: data.body || 'notification',
        icon: data.icon || "/user.png",
        actions: [
            { action: "view", title: "View" },
            { action: "dismiss", title: "Dismiss" },
        ],
        renotify: true,
        requireInteraction: true,
        silent: false,
    });
});
