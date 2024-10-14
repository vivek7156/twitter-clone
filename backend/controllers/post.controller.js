import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { image } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if(!text && !image) {
            return res.status(400).json({ error: "Text or image is required" });
        }
        if(image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.url;
        }

        const newPost = new Post({
            user: userId,
            text,
            image,
        });

        newPost.save(); 
        return res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
        console.log("Error in createPost: ", error);
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
        console.log("Error in deletePost: ", error);
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const  userId = req.user._id;
        const  postId = req.params.id;
        if(!text) {
            return res.status(400).json({ error: "Text is required" });
        }
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const comment = {
            user: userId,
            text,
        };
        post.comments.push(comment);
        await post.save();
        return res.status(200).json(post);
    } catch (error) {
        console.log("Error in commentOnPost: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            await post.updateOne({ $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            res.status(200).json({ message: "Post unliked" });
        } else {
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            const notification = new Notification({
                sender: userId,
                to: post.user,
                type: "like",
            });

            await notification.save();
            res.status(200).json({ message: "Post liked" });
        }
    } catch (error) {
        console.log("Error in likeUnlikePost:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({path: "user", select: "-password"}).populate({path: "comments.user", select: "-password"});
        if(posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Post.find({ _id: { $in: user.likedPosts }}).populate({path: "user", select: "-password"}).populate({path: "comments.user", select: "-password"});
        if(posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getLikedPosts: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const following = user.following;
        const feedPosts = await Post.find({ user: { $in: following }}).sort({ createdAt: -1 }).populate({path: "user", select: "-password"}).populate({path: "comments.user", select: "-password"});

        if(feedPosts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userName } = req.params;
        const user = await User.findOne({ userName });
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({path: "user", select: "-password"}).populate({path: "comments.user", select: "-password"});
        if(posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getUserPosts: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}