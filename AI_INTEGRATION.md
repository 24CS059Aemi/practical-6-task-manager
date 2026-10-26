# Practical 13: AI API Integration

## Feature and security

The task form can request an AI-generated description from the task title. The React app sends the authenticated request to `POST /api/ai/generate-description`; only the Express backend calls OpenAI. The API key is read from backend environment configuration and is never sent to the browser. The endpoint validates the title, limits each user's request for the same title to once per minute, and times out provider requests after 15 seconds.

The suggestion is inserted into the editable description field. The user decides whether to keep, change, or remove it. The UI discloses that the suggestion is AI-generated and advises against sending sensitive information. If the provider is not configured, times out, or fails, the UI displays a clear message and the user can still create tasks manually.

## Configure a key locally

1. Use an institution-provided OpenAI API key or create one through your authorized OpenAI account. API access may be billable; follow your institution's instructions and usage limits.
2. Copy `TaskManagerAPI/.env.example` to `TaskManagerAPI/.env`.
3. Set `OPENAI_API_KEY` to your private key in `TaskManagerAPI/.env`. Keep the existing MongoDB and JWT settings valid.
4. Start the backend with `npm start` from `TaskManagerAPI`, then start the frontend with `npm run dev` from `task-manager-frontend`.
5. Log in, enter a task title, click **Generate description**, review/edit the suggestion, and then create the task.

The root `.gitignore` excludes `.env`; never put an API key into frontend source, browser code, screenshots, chat, or Git. Only send task titles that are safe to share with the external provider. Do not send passwords, personal data, confidential work, or secrets.

## Docker Compose configuration

For Compose, put `OPENAI_API_KEY=your-private-key` in the ignored root `.env` file. Compose passes it only to the backend container. Rebuild/recreate the backend after changing environment configuration with `docker compose up --build`.

## Failure-path test

To demonstrate graceful degradation, temporarily unset or use an invalid `OPENAI_API_KEY`, restart the backend, and request a suggestion. The frontend should show an error message while leaving the editable description and normal **Add task** flow available. Restore the valid key afterward. Do not capture or commit the key.

## Suggested screenshots

Use **Win + Shift + S** and ensure no API key, password, or JWT is visible.

1. Logged-in task form with a title and **Generate description** control.

   *Figure 1: Task form offers an AI-generated description suggestion.*
2. Generated suggestion visible in the editable description field, along with the AI disclaimer.

   *Figure 2: AI-generated task description is presented for review and editing.*
3. Backend terminal or frontend message showing the provider-unavailable fallback while the rest of the form remains usable.

   *Figure 3: AI failure is handled gracefully while manual task entry remains available.*
4. Optional Postman request to the authenticated endpoint with the suggestion response; hide the bearer token.

   *Figure 4: Backend AI endpoint returns a task description suggestion.*

## Conclusion

In this practical, I added an AI-assisted task-description feature through a protected Express endpoint. The OpenAI key remains server-side, and only the task title is sent to the provider. The React form shows a loading state, displays the generated text as an editable suggestion, and explains that users should review it. Provider failures and timeouts show a helpful message without preventing manual task entry. This demonstrates secure API integration and graceful degradation while highlighting the need to avoid sending sensitive data to an external AI service.
