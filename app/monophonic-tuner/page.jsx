'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Script from 'next/script';
import Tuner from '@/Tuner/tuner';
import Countdown from '@/components/monophonicTuner/Counter';
import Highlight from '@/components/monophonicTuner/Highlight';
import chromaticNotesDefault from '@/static/chromaticNotes';
import shuffleArray from '@/utils/shuffleArray';
import Result from '@/components/monophonicTuner/Result';
import blobtoBase64 from '@/utils/blobtoBase64';



const uploadAudio = async (blob, fileName = "defaultFileName") => {
  try {
    const base64Data = await blobtoBase64(blob);

    const response = await fetch('/api/process_realtime_audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fileName,
        audioData: base64Data,
      }),
    });


    if (response.ok) {
      return Promise.resolve();
    } else {
      return Promise.reject(`Failed to upload audio. Status: ${response.status}`);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};


const timeGivenToPlay = 30000
const loadingTime = 3000

const Page = () => {
  // State variables
  const [a4, setA4] = useState(440); // Initialize A4 frequency
  const [tuner, setTuner] = useState(null); // Store the tuner instance
  const [currIndex, setCurrIndex] = useState(0); // Current index for the target note
  const [score, setScore] = useState(0); // Initialize the player's score
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [won, setWon] = useState(false); // Check If Correct Note Played
  const [timeTaken, setTimeTaken] = useState(0) // Measure the time taken by user
  const [result, setResult] = useState([]) //store the complete result || each step
  const [resultShown, setResultShown] = useState(false) //store the complete result || each step



  // Array of chromatic notes
  const [chromaticNotes, setChromaticNotes] = useState(chromaticNotesDefault);


  // Get the target note based on the current index
  const targetNote = chromaticNotes[currIndex];


  // function to reset the game
  const resetGame = () => {
    setResultShown(false)
    setCurrIndex(0);
    setScore(0);
  }



  // Function to start listening to the user's note input
  const startListening = () => {
    try {
      let startTime = new Date();
      const newTuner = new Tuner(a4);
      newTuner.init();
      let startGameTimeout;
      newTuner.onNoteDetected = (note) => {

        // // If audio not is in between 65 to 95, do nothing 
        // if (note.decibel < 65 || note.decibel > 95) {
        //   console.log(note);
        //   return
        // }


        // Check for winning
        if (note.name.split('/').includes(targetNote)) {
          setWon(true)
          setScore((prevScore) => prevScore + 1); // Increment the score on correct note
        } else {
          setWon(false)
        }


        setTimeTaken(new Date() - startTime)

        setResult((prev) => [...prev,
        {
          targetNote: chromaticNotes[currIndex],
          playedNote: note.name,
          timeTaken: new Date() - startTime,
          won: note.name.split('/').includes(targetNote),
          // requiredFreq: newTuner.getStandardFrequency(newTuner.noteStrings.indexOf(targetNote)),
          playedFreq: note.frequency.toFixed(2)
        }
        ])

        console.log(result);

        // Store the audio in database
        newTuner.stop().then((blob) => {
          uploadAudio(blob, (new Date().toISOString().replace(/[-:.]/g, '')))
        }).catch(err => console.log(err))

        setTuner(null);
        setCurrIndex((curr) => curr + 1);
        clearInterval(startGameTimeout);
      };

      startGameTimeout = setTimeout(() => {
        // Store the audio in database
        newTuner.stop().then((blob) => {
          uploadAudio(blob, (new Date().toISOString().replace(/[-:.]/g, '')))
        }).catch(err => console.log(err))


        setTuner(null);
        setWon(false)
        setCurrIndex((curr) => curr + 1);
        setResult((prev) => [...prev,
        {
          targetNote: chromaticNotes[currIndex],
          playedNote: 'Null',
          timeTaken: timeGivenToPlay,
          won: false,
          // requiredFreq: newTuner.getStandardFrequency(newTuner.noteStrings.indexOf(targetNote)),
          playedFreq: note.frequency.toFixed(2)
        }])
        setTimeTaken(timeGivenToPlay)
      }, timeGivenToPlay);
      setTuner(newTuner); // Store the tuner instance in state
    } catch (error) {
      window.alert('Something went wrong');
      console.log(error);
    }
  };





  useEffect(() => {

    navigator.mediaDevices.getUserMedia({ audio: true })

    // Check if the game is not in a loading state
    if (!isLoading && !resultShown) {
      if (currIndex === 0) {

        // Shuffle the chromaticNotes array at the beginning of the game
        setResult([])
        setChromaticNotes(shuffleArray(chromaticNotes));
        Swal.fire({
          title: 'Are You Ready ?',
          icon: 'question',
          confirmButtonText: 'Start',
        }).then(() => {
          setIsLoading(true);
          setTimeout(() => {
            if (currIndex < chromaticNotes.length) {
              setIsLoading(false);
              startListening();
            }
          }, loadingTime); // Show the "Loading"  for 3 seconds
        });

      } else if (currIndex === chromaticNotes.length) {

        // Display the score and restart the game when all notes have been played
        Swal.fire({
          showDenyButton: true,
          title: `You scored ${score} out of ${chromaticNotes.length}`,
          text: 'Click To Restart',
          icon: 'success',
          denyButtonText: 'Detailed Result',
          confirmButtonColor: '#34c76b',
          confirmButtonText: 'Restart',
        }).then((result) => {
          if (result.isDenied) {    // RESULT bTN iS cLICKED
            setResultShown(true)
          } else {
            setCurrIndex(0);
            setScore(0);
          }
        });

      } else {
        setIsLoading(true);
        setTimeout(() => {
          if (currIndex < chromaticNotes.length) {
            setIsLoading(false);
            startListening();
          }
        }, loadingTime);
      }
    }
  }, [currIndex, targetNote]);




  // Render the Result component if the game is Completed 
  if (resultShown) {
    return (
      <div>
        <Result list={result} score={score} resetGame={resetGame} />
      </div>
    )
  }

  // Render the countdown component if the game is loading
  if (isLoading) {
    return (
      <div>
        <Countdown won={won} currentIndex={currIndex} timeTaken={timeTaken} loadingTime={loadingTime} />
      </div>
    );
  }



  // Render the game interface
  return (
    <div className='h-screen flex flex-col justify-evenly items-center py-8 md:py-18 text-3xl md:text-5xl'>
      <Script src='https://cdn.jsdelivr.net/npm/aubiojs@0.1.1/build/aubio.min.js' />
      <p>Level : <Highlight text={`#${currIndex + 1}`} /></p>
      <p>Target Note: <Highlight text={targetNote} fontSize={'7rem'} /></p>
      <p>Score: <Highlight text={score} /></p>
    </div>
  );
};

export default Page;
