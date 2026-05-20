import conf from '../components/conf/conf';
import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    getPostPermissions(userId, isPublic = false){
        if (!userId) {
            return isPublic ? [Permission.read(Role.any())] : []
        }

        const permissions = [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId)),
        ]

        if (isPublic) {
            permissions.push(Permission.read(Role.any()))
        }

        return permissions
    }

    async createPost({title, slug, content, featuredImage, status, userId, tags = "", isPublic = false}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    tags,
                    isPublic,
                },
                this.getPostPermissions(userId, isPublic)
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, featuredImage, status, tags, isPublic, userId}){
        try {
            const payload = {
                title,
                content,
                featuredImage,
                status,
                tags,
                isPublic,
            }

            Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key])

            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                payload,
                userId ? this.getPostPermissions(userId, Boolean(isPublic)) : undefined
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active"), Query.orderDesc("$updatedAt")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    async getPublicPosts(){
        return this.getPosts([
            Query.equal("status", "active"),
            Query.equal("isPublic", true),
            Query.orderDesc("$updatedAt"),
        ])
    }

    async updatePostVisibility(slug, isPublic, userId){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                { isPublic },
                this.getPostPermissions(userId, isPublic)
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePostVisibility :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        if (!fileId) return ""

        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        )
    }
}


const service = new Service()
export default service
