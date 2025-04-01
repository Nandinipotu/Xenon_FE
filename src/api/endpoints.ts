import axiosInstance from './axiosInstance';

export const generateImage = async (prompt: string, isNewChat: boolean) => {
  try {
    const response = await axiosInstance.post(`/image-generation/generate?prompt=${encodeURIComponent(prompt)}&isNewChat=${isNewChat}`, '');

    const imageUrl = response.data?.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL found in response');
    }

    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};


export const generateQuestions = async (message: string, isNewChat: boolean) => {
  try {
    const response = await axiosInstance.post(`/chat/search?message=${encodeURIComponent(message)}&isNewChat=${isNewChat}`, null, {
      headers: {
        'Accept': 'application/json',
      },
    });

    // Log the parsed response directly (Axios does this automatically)
    console.log('Parsed API Response:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
};







