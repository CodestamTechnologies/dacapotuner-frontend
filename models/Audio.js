
import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
  name: String,
  audioData: Buffer,
  time: { type: Date, default: Date.now },
});

const Audio = mongoose.models.Audio || mongoose.model('Audio', audioSchema);

export default Audio;
