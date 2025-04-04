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
 
export const fetchTeamMember = async () => {
  try {
    const response = await axiosInstance.get('http://localhost:8090/team/fetchTeam');
    return response;
  } catch (error) {
    console.error('Error fetching team member:', error);
    throw error;
  }
};
export const sendAppreciationMail = async (receiverEmail: string, senderEmail: string) => {
  try {
    const response = await axiosInstance.post(
      `http://localhost:8090/api/mail/send?receiver=${encodeURIComponent(receiverEmail)}&sender=${encodeURIComponent(senderEmail)}`,
      ''
    );
    return response.data;
  } catch (error) {
    console.error('Error sending appreciation email:', error);
    throw error;
  }
};
// In api/endpoints.ts - Add this function
 
export const editUserQuestion = async (sessionId: string, newQuestion: string) => {
  try {
    const response = await axiosInstance.put(
      `/history/edit-question?sessionId=${encodeURIComponent(sessionId)}&newQuestion=${encodeURIComponent(newQuestion)}`
    );
   
    console.log('Edit question API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error editing question:', error);
    throw error;
  }
};
 
 
 
 