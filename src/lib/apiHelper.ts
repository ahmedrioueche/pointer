// Define the types for the contact form data and response
interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  }
  
  interface ApiResponse {
    status: string; // 'success', 'failed', or 'error'
    message?: string; // Optional message
  }
  
  
  // Convert the function to TypeScript
  export const sendContactForm = async (data: ContactFormData): Promise<ApiResponse> => {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
  
    if (!response.ok) {
      throw new Error("Failed to send message");
    }
  
    return response.json();
  };
  
  export const apiUpdateParent = async (parentId: Number | null, updateData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/update-parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, updateData }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update parent');
      }
  
      // Parse the response JSON
      const responseData: ApiResponse = await response.json();
      
      return responseData;
  
    } catch (error) {
      console.error('Update failed:', error);
      
      // Return a default error response
      return { status: 'error', message: 'An error occurred' };
    }
  };
  