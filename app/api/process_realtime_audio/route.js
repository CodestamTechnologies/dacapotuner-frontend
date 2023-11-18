import Audio from '@/models/Audio';
import { connectToDB } from '@/utils/database';




export const POST = async (request) => {
  const {name, audioData} = await request.json()
  try {

    await connectToDB()

    // Read audio file as Buffer
    const audioBuffer = Buffer.from(audioData, 'base64');

    // Create a new audio document
    const newAudio = new Audio({
      name: name,
      audioData: audioBuffer,
    });

    // Save the document to the database
    await newAudio.save();

    return new Response(JSON.stringify(newAudio), { status: 201 })


  } catch (error) {

    console.error('Error saving audio file:', error);
    return new Response(`Failed To Save Audio`, { status: 500 })

  }
};


export const GET = async (request) => {
  try {
    await connectToDB();

    // Find a random audio or the latest added audio
    const audio = await Audio.findOne().sort({ _id: -1 });

    if (!audio) {
      return new Response(`No audio found`, { status: 404 });
    }

    // Convert the audioData buffer to base64 for sending in the response
    const audioDataBase64 = audio.audioData.toString('base64');

    // Set headers for the response
    const headers = new Headers();
    headers.set('Content-Type', 'audio/ogg'); // Set to 'audio/ogg' for OGG format
    headers.set('Content-Disposition', `inline; filename="${audio.name}.ogg"`);

    // Send the audio data in the response
    return new Response(audio.audioData, { status: 200, headers });
  } catch (error) {
    console.error('Error retrieving audio file:', error);
    return new Response(`Failed to retrieve audio`, { status: 500 });
  }
};
