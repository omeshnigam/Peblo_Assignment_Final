# AI Note Assistant Appwrite Function

Deploy this code to the Appwrite Function ID used by `VITE_APPWRITE_AI_FUNCTION_ID`.

Set these Appwrite Function variables:

```env
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-4o-mini
APP_URL=http://localhost:5173
```

The function returns:

```json
{ "content": "generated model text" }
```

If your frontend shows the default Appwrite starter response with `motto`, `learn`, `connect`, and `getInspired`, this function code has not been deployed to the selected function ID yet.
