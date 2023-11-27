import React, { useState } from 'react'
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Result = ({ list, score, resetGame }) => {
    const [result, setList] = useState(list)

    const downloadPdfDocument = () => {
        const input = document.getElementById('divToPrint');
        const pdf = new jsPDF();

        html2canvas(input, {
            scale: 0.75,
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'JPEG', 0, 0);
                pdf.save(new Date().toLocaleString());
            });
    };


    if (!result.length) {
        return (<div className='text-4xl font-mono'>Error</div>)
    }


    return (

        <div className="relative overflow-x-auto max-w-6xl mx-auto px-2 sm:px-4 md:px-8 lg:px-16 py-8  overflow-hidden font-mono bg-black/50">
            <div className='flex w-full justify-between items-center px-2 pb-4'>
                <button onClick={resetGame} className="cursor-pointer duration-200 hover:scale-105 active:scale-100 flex items-center space-x-2 pb-4 font-semibold" title="Go Back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" className="stroke-blue-300">
                        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M11 6L5 12M5 12L11 18M5 12H19"></path>
                    </svg>
                    <span className='text-xl'>Back</span>
                </button>
                <button onClick={downloadPdfDocument} className="bg-neutral-950 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                    <span className="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Download
                </button>
            </div>
            <table id='divToPrint' className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                <thead className="text-sm font-semibold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                    <tr>
                        <th scope="col" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            S No.
                        </th>
                        <th scope="col" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            Target Note
                        </th>
                        {/* <th scope="col" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            Required Freq
                        </th> */}
                        <th scope="col" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            Played Note
                        </th>
                        <th scope="col" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            Played Freq
                        </th>
                        <th scope="col" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            Time Taken
                        </th>
                        <th scope="col" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        result.map((item, index) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {index + 1}.
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item['targetNote']}
                                </th>
                                {/* <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item['requiredFreq']}
                                </th> */}
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item['playedNote']}
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item['playedFreq']} Hz
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item['timeTaken']} ms
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item['won'] ? (<span className='bg-green-100 text-green-800 px-4 py-1 font-semibold'>Won</span>)
                                        : (<span className='bg-red-100 text-red-800 px-4 py-1 font-semibold'>Lost</span>)}
                                </th>
                            </tr>
                        ))
                    }
                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                        <th className="px-6 py-4 text-3xl font-medium text-gray-900 whitespace-nowrap  text-right dark:text-white" colSpan={5}>Total Score:</th>
                        <th className="px-6 py-4 text-3xl font-medium   text-gray-900 whitespace-nowrap dark:text-white" colSpan={1}><span className='px-4 py-2 bg-slate-400 text-black rounded-lg font-bold'>{score || 0}</span></th>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default Result
