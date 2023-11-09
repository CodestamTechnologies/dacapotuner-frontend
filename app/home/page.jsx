import WeatherCard from '@/components/ProjectCard'
import Navbar from '@/components/Navbar'
import React from 'react'

const projects = [
  {
    name: 'Monophonic Tuner',
    description: 'A monophonic tuner application that helps musicians tune their instruments accurately. It provides real-time feedback on the pitch of a single note, ensuring precision in tuning.',
    link: 'https://dacapotuner.vercel.app/',
  },
  {
    name: 'Chord Recognition',
    description: 'Chord recognition application designed for musicians and music enthusiasts. It analyzes audio input and identifies the chords being played, making it a handy tool for learning, practicing, and analyzing musical compositions.',
    link: 'https://dacapotuner.gouravmishra1.repl.co/',
  },
  {
    name: 'Rhythmic Score',
    description: 'Rhythmic score comparison application that allows users to compare and analyze different rhythmic scores. It aids in understanding and visualizing the nuances of various rhythmic patterns, making it a valuable resource for music education and composition.',
    link: 'https://beatcomparison-r.streamlit.app/',
  },
];


const page = () => {
  return (
    <div>
      <Navbar />
      <div className='flex flex-wrap items-center justify-evenly gap-8 my-24'>
        {
          projects.map((project, i) => {
            return (
              <WeatherCard project={project} key={i}/>
            )
          })
        }
      </div>
    </div>
  )
}

export default page
