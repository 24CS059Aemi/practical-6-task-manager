# Practical 10: Asynchronous Processing with Event-Driven Architecture

## Implementation

- `events.js` exports one shared instance of Node.js's built-in `EventEmitter`.
- `listeners/taskListeners.js` registers listeners once at API startup.
- After a successful task creation response finishes, the API logs its response timestamp and emits `task-created`. The listener waits two seconds, then logs the task title, event timestamp, and assigned user.
- After a successful task deletion response finishes, the API emits `task-deleted`, which has a separate notification log.
- Task-created notification failures are forwarded to `task-notification-error` and logged. This avoids emitting EventEmitter's special `error` event without a listener.

## Run and capture evidence

1. Ensure MongoDB is running. In a terminal, go to `TaskManagerAPI` and run `npm start`; keep this terminal open.
2. In Postman, send `POST http://localhost:5000/auth/login` with your registered email and password as JSON. Copy the returned `token`; do not share or show it in screenshots.
3. Create a request for `POST http://localhost:5000/tasks`. Under **Authorization**, select **Bearer Token** and paste the token. Under **Body → raw → JSON**, send a valid task, for example:

   ```json
   {
     "title": "Practical 10 notification test",
     "description": "Verify the background event"
   }
   ```

4. Click **Send**. The Postman response should return `201 Created` before the delayed notification appears in the backend terminal.
5. Capture a screenshot showing the successful Postman response and a separate screenshot of the backend terminal showing `[API] Task-created response sent ...` before `[Notification] Task ...`. The notification log should appear about two seconds after the response log.
6. Optionally delete that task and capture the distinct `[Notification] Task ... deleted ...` log.

Use `Win + Shift + S` to capture screenshots. Keep the API terminal wide enough to show both timestamped lines, and hide the Postman bearer token and personal email before including screenshots in the report.

Suggested captions:

- *Figure 1: Postman returns HTTP 201 after a task is created.*
- *Figure 2: Backend log shows the API response timestamp before the delayed task-created notification.*
- *Figure 3: The task-deleted event produces a separate notification log.* (optional)

The automated test suite verifies that task-created notification work is deferred, deletion uses a distinct listener, and notification failures are logged via the custom error event.

## Conclusion

Node.js EventEmitter decouples task notifications from the main request flow. The API completes the create response first, then the delayed listener logs task information asynchronously. This keeps the notification delay out of the client's response wait, while demonstrating that EventEmitter remains an in-process mechanism and is not a durable queue for multi-instance production workloads.
