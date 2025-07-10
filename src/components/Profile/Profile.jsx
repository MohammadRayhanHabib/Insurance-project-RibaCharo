import React, { useState } from "react";
import { BadgeCheck, Pencil, Save } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { saveImgCloud } from "../../api/utils";

const roleColors = {
    admin: "bg-red-500",
    agent: "bg-blue-500",
    customer: "bg-green-500",
};

export default function ProfileComponent() {
    const { user, updateUserProfile } = useAuth();

    // fallback value for displayName or photoURL
    const initialName = user?.displayName || "No Name";
    const initialPhoto = user?.photoURL || "/default-avatar.png";

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(initialName);
    const [photo, setPhoto] = useState(initialPhoto);
    const [imagePreview, setImagePreview] = useState(initialPhoto);
    const [loader, setLoader] = useState()

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const { imgUrl, isLoading } = await saveImgCloud(file)
        setLoader(isLoading)

        setImagePreview(imgUrl);
        setPhoto(imgUrl); // Optional: Upload logic

    };

    const handleSave = () => {
        // TODO: Save to backend or Firebase profile update
        updateUserProfile(name, photo)
        console.log("Saved:", { name, photo });

        setEditMode(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            <div className="flex flex-col items-center">
                <div className="relative">
                    {
                        loader ? (

                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
                            />
                        ) :
                            <img
                                src="https://media1.tenor.com/m/khzZ7-YSJW4AAAAC/cargando.gif"
                                alt="Loading"
                                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
                            />
                    }
                    {editMode && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    )}
                </div>

                {editMode ? (
                    <input
                        className="mt-4 text-center text-xl font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                ) : (
                    <h2 className="mt-4 text-2xl font-bold">{name}</h2>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>

                {user?.role && (
                    <div
                        className={`mt-2 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 ${roleColors[user.role] || "bg-gray-500"}`}
                    >
                        <BadgeCheck size={16} />
                        {user.role.toUpperCase()}
                    </div>
                )}

                {/* Optional Last Login */}
                {user?.metadata?.lastSignInTime && (
                    <p className="mt-2 text-xs text-gray-400">
                        Last login: {new Date(user.metadata.lastSignInTime).toLocaleString()}
                    </p>
                )}

                <div className="mt-5">
                    {editMode ? (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
                        >
                            <Save size={18} /> Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
                        >
                            <Pencil size={18} /> Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

