import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatTags } from '../../utils/posts'
import AIAssistant from '../AIAssistant'

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
            tags: formatTags(post?.tags),
            isPublic: Boolean(post?.isPublic),
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const currentTitle = watch("title");

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file && post.featuredImage) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
                isPublic: Boolean(data.isPublic),
                userId: userData?.$id,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                data.featuredImage = file.$id;
            }

            const dbPost = await appwriteService.createPost({ ...data, userId: userData?.$id, isPublic: Boolean(data.isPublic) });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const useSuggestedTitle = (title) => {
        setValue("title", title, { shouldValidate: true });
        setValue("slug", slugTransform(title), { shouldValidate: true });
    };

    const appendAiContent = (html) => {
        const currentContent = getValues("content") || "";
        const nextContent = `${currentContent}${currentContent ? "<p></p>" : ""}${html}`;
        setValue("content", nextContent, { shouldDirty: true, shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="animate-fade-up grid gap-6 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/40 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:p-6">
            <div>
                <AIAssistant
                    title={currentTitle}
                    getContent={() => getValues("content")}
                    onUseTitle={useSuggestedTitle}
                    onInsertContent={appendAiContent}
                />
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <Input
                    label="Tags :"
                    placeholder="work, ideas, personal"
                    className="mb-4"
                    {...register("tags")}
                />
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image")}
                />
                {post?.featuredImage && (
                    <div className="w-full mb-4 overflow-hidden rounded-lg">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="w-full rounded-lg object-cover transition duration-500 hover:scale-105"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <label className="mb-4 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 transition duration-200 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <span>
                        Make public
                        <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">Allow this note to be opened from a share link.</span>
                    </span>
                    <input
                        type="checkbox"
                        className="h-5 w-5 accent-blue-600"
                        {...register("isPublic")}
                    />
                </label>
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
