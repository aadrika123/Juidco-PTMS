/* eslint-disable no-useless-catch */
import crypto from 'crypto';
import axios from 'axios';
import FormData from 'form-data';

interface FileData {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export const imageUploaderV2 = async (files: FileData[]): Promise<string[]> => {
  const toReturn: string[] = [];

  const token = '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0'; // Replace with your actual token

  if (!files || files.length === 0) {
    throw new Error('No files provided for upload.');
  }

  try {

    for (const item of files) {
      if (!item.buffer || !item.originalname || !item.mimetype) {
        throw new Error('Invalid file structure.');
      }

      const hashed = crypto.createHash('SHA256').update(item.buffer).digest('hex');


      const formData = new FormData();
      formData.append('file', item.buffer, item.originalname); 
      formData.append('tags', item.originalname.substring(0, 7)); 

      const headers = {
        'x-digest': hashed,
        token: token, 
        folderPathId: 1,
        ...formData.getHeaders(),
      };

      try {
        const uploadResponse = await axios.post(process.env.DMS_UPLOAD || '', formData, { headers });

        if (uploadResponse?.data?.data?.ReferenceNo) {
          const referenceNo = uploadResponse.data.data.ReferenceNo;

          const fileResponse = await axios.post(
            process.env.DMS_GET || '',
            { referenceNo },
            {
              headers: {
                'token': token, 
              },
            }
          );

          const fullPath = fileResponse?.data?.data?.fullPath;
          if (fullPath) {
            toReturn.push(fullPath);
          } else {
            console.error('Failed to retrieve the file path.');
          }
        } else {
          console.error('Failed to upload the file, missing ReferenceNo.');
        }
      } catch (err) {
        console.error('Error during file upload or retrieval:', err);
        throw new Error('Error uploading file');
      }
    }

    return toReturn; 
  } catch (err) {
    console.error('Error in imageUploaderV2 function:', err);
    throw err;
  }
};
