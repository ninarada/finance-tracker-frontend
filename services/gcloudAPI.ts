import axios from 'axios';

const API_URL = `http://${process.env.EXPO_PUBLIC_IP}:5001/api/gcloud/process`;

export async function processReceiptImage(photo: { uri: string; type: string; name: string }) {
  const formData = new FormData();

  formData.append('file', {
    uri: photo.uri,
    type: photo.type || 'image/jpeg',
    name: photo.name || 'receipt.jpg',
  } as any);

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; 
  } catch (error: any) {
    console.error('Error processing receipt:', error.response?.data || error.message);
    throw new Error('Receipt processing failed.');
  }
}
