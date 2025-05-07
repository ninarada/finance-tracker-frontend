import axios from 'axios';

export async function detectText(base64Image: string): Promise<string> {
  const url = process.env.EXPO_PUBLIC_API_URL;

  const body = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [{ type: 'TEXT_DETECTION' }],
      },
    ],
  };
  if (url !== undefined) {
    try {
        const response = await axios.post(url, body);
        const detectedText = response.data.responses[0]?.textAnnotations?.[0]?.description || '';
        return detectedText;
    } catch (error) {
        console.error('Google Vision API Error:', error);
        throw error;
    }
  } else {
    return " ";
  }
  
}
