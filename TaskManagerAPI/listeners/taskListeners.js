function registerTaskListeners(taskEvents, options = {}) {
    const delayMs = options.delayMs ?? 2000;
    const log = options.log ?? console.log;
    const logError = options.logError ?? console.error;

    taskEvents.on("task-created", (task) => {
        setImmediate(() => {
            setTimeout(() => {
                try {
                    log(
                        `[Notification] Task "${task.title}" created at ${task.timestamp}; assigned user ${task.userId}`
                    );
                } catch (error) {
                    taskEvents.emit("task-notification-error", error);
                }
            }, delayMs);
        });
    });

    taskEvents.on("task-deleted", (task) => {
        setImmediate(() => {
            log(`[Notification] Task "${task.title}" deleted; assigned user ${task.userId}`);
        });
    });

    taskEvents.on("task-notification-error", (error) => {
        logError(`[Notification Error] ${error.message}`);
    });
}

module.exports = registerTaskListeners;
