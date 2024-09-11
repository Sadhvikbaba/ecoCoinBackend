import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Your function using the imported modules
export const uploadImageToImagga = async (imagePath) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await fetch(process.env.IMAGGA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${process.env.IMAGGA_API_KEY}:${process.env.IMAGGA_API_SECRET}`)}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};


