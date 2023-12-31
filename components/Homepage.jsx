import React from "react";
import { luckyGuy } from "@/fonts/fonts";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";


const Button = ({ text }) => {
    return (
        <button
            className="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-purple-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-purple-300 ring-offset-purple-200 hover:ring-offset-purple-500 ease focus:outline-none"
        >
            <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
            <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
            <span className="relative z-20 flex items-center text-sm">
                <svg className="relative w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {text}
            </span>
        </button>
    );
};





export default function Homepage() {
    return (
        <section className="h-screen">
            {/* <Navbar /> */}
            <div className="flex justify-between items-center ">
                <div className="flex flex-col justify-between lg:w-1/2 py-24 md:py-0 ">
                    <h2 className={`${luckyGuy.className} bg-[url(/gifs/textBgHome.gif)] text-transparent bg-clip-text text-7xl md:text-8xl lg:text-9xl font-black`}>MUSIC <br /> REDEFINED</h2>
                    <p className=" text-xl lg:text-2xl font-sans py-8 font-medium tracking-wider">DaCapo is the first vetted and gamified AI music education platform designed to connect young musicians based on their abilities, while also endeavouring to better prepare them on their instruments within a band setting.</p>
                    {/* <Link href={'/home'} className="w-fit">
                        <Button text={'Start Vetting Process'} />
                    </Link> */}
                </div>
                <div className="hidden lg:flex flex-col justify-center items-center space-y-8">
                    <div className="flex ">
                        <Image className='aspect-video object-cover rounded-lg' src={'/gifs/Sound - Animated Icon.gif'} width={300} height={300} alt="headPhone" />
                    </div>
                    <div className="flex space-x-8">
                        <Image className='aspect-video object-cover rounded-lg ' src={'/gifs/Audio Mix.gif'} width={300} height={300} alt="headPhone" />
                        <Image className='aspect-video object-cover rounded-lg' src={'/gifs/Search Projects.gif'} width={300} height={300} alt="headPhone" />
                    </div>
                    <div className="flex ">
                        <Image className='aspect-video object-cover rounded-lg' src={'/gifs/Coffee Stain Preloader.gif'} width={300} height={300} alt="headPhone" />
                    </div>
                </div>
            </div>
        </section>
    );
}