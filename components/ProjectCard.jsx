import React from 'react';
import styles from '@/styles/ProjectCard.module.css'


const ProjectCard = ({ project }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <p className={styles.city}>{project.name}</p>
        <p className={styles.weather}>
          {project.description}
        </p>

        <a href={project.link} className={styles.temp}>
          <button
            className="cursor-pointer flex items-center fill-purple-400 bg-purple-100 hover:bg-purple-600 active:border active:border-purple-400 rounded-md duration-100 px-14 py-3 w-full group"
            title="Try Out Button"
          >
            <span className="text-base text-purple-900 group-hover:text-purple-50 font-black w-full text-center">Try Out</span>
          </button>


        </a>

      </div>
    </div>
  );
};

export default ProjectCard;
