import React, { useState, useEffect } from "react";
import { BadgeCheck, Pencil, Save, User, Mail } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { saveImgCloud } from "../../api/utils";

const roleColors = {
    admin: "bg-red-500",
    agent: "bg-blue-500",
    customer: "bg-green-500",
};

const ProfileField = ({ icon: Icon, label, value, isEditing, onChange, type = "text" }) => {
    return (
        <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <Icon size={16} />
                {label}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    placeholder={`Enter ${label.toLowerCase()}`}
                />
            ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-all duration-300 min-h-[48px] flex items-center">
                    <span className="text-gray-800 dark:text-white">
                        {value || `No ${label.toLowerCase()}`}
                    </span>
                </div>
            )}
        </div>
    );
};

export default function Profile() {
    const { user, updateUserProfile } = useAuth();

    // Initialize with user data and handle updates with fallbacks
    const [name, setName] = useState(user?.displayName || "No Name");
    const [photo, setPhoto] = useState(user?.photoURL || "/default-avatar.png");
    const [imagePreview, setImagePreview] = useState(user?.photoURL || "/default-avatar.png");
    const [editMode, setEditMode] = useState(false);
    const [loader, setLoader] = useState(false);

    // Sync with auth state changes
    useEffect(() => {
        setName(user?.displayName || "No Name");
        setPhoto(user?.photoURL || "/default-avatar.png");
        setImagePreview(user?.photoURL || "/default-avatar.png");
    }, [user]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setLoader(true);
            const imgUrl = await saveImgCloud(file);
            setImagePreview(imgUrl);
            setPhoto(imgUrl);
        } catch (err) {
            console.error("Image upload error:", err);
        } finally {
            setLoader(false);
        }
    };

    const handleSave = () => {
        if (updateUserProfile) {
            updateUserProfile(name, photo);
        } else {
            console.error("updateUserProfile function is not available");
        }
        setEditMode(false);
    };

    const handleCancel = () => {
        // Reset to original values
        setName(user?.displayName || "No Name");
        setImagePreview(user?.photoURL || "/default-avatar.png");
        setPhoto(user?.photoURL || "/default-avatar.png");
        setEditMode(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 rounded-3xl shadow-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    {loader ? (
                        <img
                            src="https://cdn.dribbble.com/userupload/21183802/file/original-80d7cf1f35a06cfd4d1226b6005026c1.gif"
                            alt="Loading"
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 animate-pulse"
                        />
                    ) : (
                        <div className="relative">
                            <img
                                src={imagePreview || "/default-avatar.png"}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 group-hover:border-teal-500 transition-all duration-300 shadow-lg"
                            />
                            {editMode && (
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                    <Pencil size={24} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                    {name}
                </h1>

                {user?.role && (
                    <div className={`mt-2 px-4 py-2 rounded-full text-white text-sm flex items-center gap-2 ${roleColors[user.role] || "bg-gray-500"} shadow-lg`}>
                        <BadgeCheck size={16} />
                        {user.role.toUpperCase()}
                    </div>
                )}
            </div>

            {/* Profile Fields */}
            <div className="space-y-6">
                <ProfileField
                    icon={User}
                    label="Full Name"
                    value={name}
                    isEditing={editMode}
                    onChange={setName}
                />

                <ProfileField
                    icon={Mail}
                    label="Email"
                    value={user?.email}
                    isEditing={false}
                    onChange={() => { }}
                    type="email"
                />

                {/* Read-only Information */}
                {user?.metadata?.lastSignInTime && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <BadgeCheck size={16} />
                            <span>Last login: {new Date(user.metadata.lastSignInTime).toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
                {editMode ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                    >
                        <Pencil size={18} /> Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
}