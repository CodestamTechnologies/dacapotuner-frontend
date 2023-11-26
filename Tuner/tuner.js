

const Tuner = function (a4) {
    this.middleA = a4 || 440;
    this.semitone = 69;
    this.bufferSize = 4096;
    this.noteStrings = [
        "C",
        "C♯/D♭",
        "D",
        "D♯/E♭",
        "E",
        "F",
        "F♯/G♭",
        "G",
        "G♯/A♭",
        "A",
        "A♯/b♭",
        "B",
    ];

    this.audioBlobs = [];
    this.mediaRecorder = null;
    this.streamBeingCaptured = null;


    this.initGetUserMedia();
};

Tuner.prototype.initGetUserMedia = function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!window.AudioContext) {
        return alert("AudioContext not supported");
    }

    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            // First get ahold of the legacy getUserMedia, if present
            const getUserMedia =
                navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
                alert("getUserMedia is not implemented in this browser");
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        };
    }
};




Tuner.prototype.startRecord = function () {
    const self = this;

    // Check for getUserMedia support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("getUserMedia is not supported in this browser");
        return;
    }

    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {

            self.streamBeingCaptured = stream;
            self.mediaRecorder = new MediaRecorder(stream)
            self.audioBlobs = [];

            self.mediaRecorder.addEventListener('dataavailable', (e) => {
                self.audioBlobs.push(e.data);
            })

            self.mediaRecorder.start()

            self.audioContext.createMediaStreamSource(stream).connect(self.analyser);
            self.analyser.connect(self.scriptProcessor);
            self.scriptProcessor.connect(self.audioContext.destination);
            self.scriptProcessor.addEventListener("audioprocess", function (event) {
                const inputData = event.inputBuffer.getChannelData(0);
                const frequency = self.pitchDetector.do(inputData);

                if (frequency && self.onNoteDetected) {
                    const note = self.getNote(frequency);
                    const decibel = calculateDecibels(self.analyser); // Calculate decibels here
                    // console.log({ decibel });
                    self.onNoteDetected({
                        name: self.noteStrings[note % 12],
                        value: note,
                        cents: self.getCents(frequency, note),
                        octave: parseInt(note / 12) - 1,
                        frequency: frequency,
                        decibel: decibel, // Include decibels in the detected note object
                    });
                }
            });
        })
        .catch(function (error) {
            alert(error.name + ": " + error.message);
        });
};


function calculateDecibels(analyser) {
    let data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let rms = 0;

    for (var i = 0; i < data.length; i++) {
        if (data[i] > 120) data[i] = 120;
        rms += data[i] * data[i];
    }
    rms = Math.sqrt(rms / data.length);
    return rms;
}



Tuner.prototype.init = function () {
    this.audioContext = new window.AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.scriptProcessor = this.audioContext.createScriptProcessor(
        this.bufferSize,
        1,
        1
    );

    const self = this;

    aubio().then(function (aubio) {
        self.pitchDetector = new aubio.Pitch(
            "default",
            self.bufferSize,
            1,
            self.audioContext.sampleRate
        );
        self.startRecord();
    });
};

/**
 * get musical note from frequency
 *
 * @param {number} frequency
 * @returns {number}
 */
Tuner.prototype.getNote = function (frequency) {
    const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
    return Math.round(note) + this.semitone;
};

/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */
Tuner.prototype.getStandardFrequency = function (note) {
    return this.middleA * Math.pow(2, (note - this.semitone) / 12);
};

/**
 * get cents difference between given frequency and musical note's standard frequency
 *
 * @param {number} frequency
 * @param {number} note
 * @returns {number}
 */
Tuner.prototype.getCents = function (frequency, note) {
    return Math.floor(
        (1200 * Math.log(frequency / this.getStandardFrequency(note))) / Math.log(2)
    );
};

/**
 * play the musical note
 *
 * @param {number} frequency
 */
Tuner.prototype.play = function (frequency) {
    if (!this.oscillator) {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.connect(this.audioContext.destination);
        this.oscillator.start();
    }
    this.oscillator.frequency.value = frequency;
};

Tuner.prototype.stopOscillator = function () {
    if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator = null;
    }
};


Tuner.prototype.stop = function () {
    return new Promise((resolve, reject) => {
        let mimeType = this.mediaRecorder.mimeType;

        // Listen to the stop event to create & return a single Blob object
        this.mediaRecorder.addEventListener("stop", () => {
            // Create a single blob object by joining multiple Blob objects
            let audioBlob = new Blob(this.audioBlobs, { type: mimeType });

            // Resolve the promise with the single audio blob representing the recorded audio
            resolve(audioBlob);
        });

        // Stop the recording feature
        this.mediaRecorder.stop();

        // Stop all the tracks on the active stream to stop the stream
        this.stopStream();

        // Reset API properties for the next recording
        this.resetRecordingProperties();

        if (this.audioContext) {
            this.audioContext.close(); // Close the audio context to stop audio processing
        }

        // Disconnect any audio nodes or sources as needed
        if (this.analyser) {
            this.analyser.disconnect();
        }

        if (this.scriptProcessor) {
            this.scriptProcessor.disconnect();
        }

        // Perform additional cleanup if necessary
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
        }

        // Reset any relevant properties or state
        this.audioContext = null;
        this.analyser = null;
        this.scriptProcessor = null;
        this.oscillator = null;

        // Add any other cleanup steps specific to your tuner

        // Optionally, you can also remove event listeners or do additional cleanup here

        // Finally, set the tuner instance to null to indicate it's stopped
        this.isStopped = true;
    });
};




Tuner.prototype.stopStream = function () {
    //stopping the capturing request by stopping all the tracks on the active stream
    this.streamBeingCaptured.getTracks() //get all tracks from the stream
        .forEach(track /*of type MediaStreamTrack*/ => track.stop()); //stop each one
};



Tuner.prototype.resetRecordingProperties = function () {
    this.mediaRecorder = null;
    this.streamBeingCaptured = null;

    /*No need to remove event listeners attached to mediaRecorder as
    If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
    up by the garbage collector as well as any event handlers/listeners associated with it.
    getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
}


export default Tuner