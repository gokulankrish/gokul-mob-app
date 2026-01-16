// services/storageService.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

export const storageService = {
  async uploadImage(uri: string, path: string): Promise<string> {
    try {
      console.log('Starting image upload...', uri, path);
      
      // Convert local URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Create reference
      const storageRef = ref(storage, path);
      
      // Upload file
      console.log('Uploading to Firebase Storage...');
      await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Upload successful! URL:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error}`);
    }
  },
  
  async uploadImageFromChat(
    uri: string, 
    chatId: string, 
    userId: string, 
    fileName?: string
  ): Promise<string> {
    const timestamp = Date.now();
    const fileExtension = uri.split('.').pop() || 'jpg';
    const name = fileName || `image_${timestamp}.${fileExtension}`;
    const path = `chats/${chatId}/${userId}/${name}`;
    
    return this.uploadImage(uri, path);
  },
};