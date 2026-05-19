const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    apiKey: String(import.meta.env.VITE_API_KEY),
    openrouterApiKey: String(import.meta.env.VITE_OPENROUTER_API_KEY || ""),
    openrouterModel: String(import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini")
}

export default conf
