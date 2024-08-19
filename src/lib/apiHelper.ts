// Define the types for the contact form data and response
interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  }
  
  interface ApiResponse {
    success?: boolean;
    message?: string;
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
  