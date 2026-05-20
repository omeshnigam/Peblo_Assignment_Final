import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import Button from "../Button";
import Container from "../container/Container";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { parseTags } from "../../utils/posts";

export default function Post() {
    const [post, setPost] = useState(null);
    const [shareStatus, setShareStatus] = useState("");
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);

    const isAuthor = post && userData ? post.userId === userData.$id : false;
    const tags = parseTags(post?.tags);
    const shareUrl = post ? `${window.location.origin}/share/${post.$id}` : "";

//     console.log("post.userId:", post?.userId);
// console.log("userData.$id:", userData?.$id);
// console.log("isAuthor:", isAuthor);

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    if (!authStatus && !post.isPublic) {
                        navigate("/login");
                        return;
                    }

                    setPost(post);
                }
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate, userData, authStatus]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                if (post.featuredImage) {
                    appwriteService.deleteFile(post.featuredImage);
                }
                navigate("/");
            }
        });
    };

    const togglePublicShare = async () => {
        const updatedPost = await appwriteService.updatePostVisibility(post.$id, !post.isPublic, userData?.$id);

        if (updatedPost) {
            setPost(updatedPost);
            setShareStatus(updatedPost.isPublic ? "Public share link enabled." : "Public share link disabled.")
        }
    }

    const copyShareLink = async () => {
        if (!post?.isPublic) {
            setShareStatus("Make this note public before copying a link.")
            return
        }

        await navigator.clipboard.writeText(shareUrl)
        setShareStatus("Public link copied.")
    }

    return post ? (
        <div className="py-10">
            <Container>
                <div className="w-full flex justify-center mb-4 relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                    {post.featuredImage ? (
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-xl"
                        />
                    ) : (
                        <div className="flex min-h-56 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-white to-cyan-100 p-8 text-center text-lg font-black text-blue-700 dark:from-blue-950 dark:via-slate-900 dark:to-cyan-950 dark:text-blue-300">
                            No featured image
                        </div>
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6 flex flex-wrap justify-end gap-3">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="mb-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/30">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-3 flex flex-wrap gap-2">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${post.isPublic ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                                    {post.isPublic ? "Public" : "Private"}
                                </span>
                                {tags.map((tag) => (
                                    <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl font-black text-slate-950 dark:text-slate-100">{post.title}</h1>
                            {post.$updatedAt && (
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Updated {new Date(post.$updatedAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                        {isAuthor && (
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    bgColor={post.isPublic ? "bg-slate-700" : "bg-blue-600"}
                                    onClick={togglePublicShare}
                                >
                                    {post.isPublic ? "Make Private" : "Make Public"}
                                </Button>
                                <Button bgColor="bg-cyan-600" onClick={copyShareLink}>
                                    Copy Share Link
                                </Button>
                            </div>
                        )}
                    </div>
                    {isAuthor && (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                            <p className="break-all">{shareUrl}</p>
                            {shareStatus && <p className="mt-2 font-semibold text-blue-700 dark:text-blue-300">{shareStatus}</p>}
                        </div>
                    )}
                </div>
                <div className="browser-css text-slate-900 dark:text-slate-200">
                    {parse(post.content)}
                    </div>
            </Container>
        </div>
    ) : null;
}
