import { jwtDecode } from "jwt-decode"; // Use named import instead of default import

interface TokenData {
  email: string;
  // Add other token fields if needed
}

// Function to extract user email from token in cookies
export const getSenderEmailFromToken = (): string => {
  try {
    // Get token from cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (!token) {
      throw new Error('Token not found in cookies');
    }
    
    // Decode the token
    const decodedToken = jwtDecode<TokenData>(token);
    
    // Return the email from the decoded token
    return decodedToken.email;
  } catch (error) {
    console.error('Error getting sender email:', error);
    // Return a default or empty email if there's an error
    return "";
  }
};