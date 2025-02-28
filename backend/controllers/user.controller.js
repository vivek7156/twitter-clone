import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await User.findOne({userName}).select("-password");
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in getUserProfile: ", error.message);
    }
};

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()){
            return res.status(400).json({error: "You cannot follow yourself"});
        }
        if(!userToModify || !currentUser) {
            return res.status(404).json({error: "User not found"});
        }
        const isFollowing = currentUser.following.includes(id);
        if(isFollowing) {
            await User.findByIdAndUpdate(id, {
                $pull: {followers: req.user._id}
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: {following: id}
            });
            res.status(200).json({message: "User unfollowed successfully"});
        } else {
            await User.findByIdAndUpdate(id, {
                $push: {followers: req.user._id}
            });
            await User.findByIdAndUpdate(req.user._id, {
                $push: {following: id}
            });
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify.id,
            });
            await newNotification.save();
            res.status(200).json({message: "User followed successfully"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in followUnfollowUser: ", error.message);
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            { $match: { _id: { $ne: userId } } },
            { $sample: { size: 5 } },
        ]);
        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0,4);

        suggestedUsers.forEach(user => user.password = null);
        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in getSuggestedUsers: ", error.message);
    }
}

export const updateUserProfile = async (req, res) => {
    const { fullName, email, userName, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }
        if((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({error: "Please provide both current and new password"});
        }
        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) {
                return res.status(400).json({error: "Invalid password"});
            }
            if(newPassword.length < 6) {
                return res.status(400).json({error: "Password must be atleast 6 characters long"});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        if(profileImg) {
            if(user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadResponse.secure_url;
        }
        if(coverImg) {
            if(user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadResponse.secure_url;
        }
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.userName = userName || user.userName;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        await user.save();
        user.password = null;
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in updateUserProfile: ", error.message);
    }
}