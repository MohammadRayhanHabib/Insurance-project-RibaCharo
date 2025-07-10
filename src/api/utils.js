// import axios from "axios"

// export const saveImgCloud = async (image) => {

//     const data = new FormData()

//     data.append('file', image)
//     data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//     data.append('cloud_name', `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`)

//     const { data: result } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, data)
//     const imgUrl = result?.url
//     return imgUrl;

// }

import axios from "axios";

export async function saveImgCloud(file) {
    const base64 = await fileToBase64(file);
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload-image`, {
        imageBase64: base64,
    });

    return data?.url;
}




function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

