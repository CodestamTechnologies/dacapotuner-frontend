import React from 'react'

const Navbar = () => {
    return (
        <div>
            <div className="flex justify-between items-center py-4 font-sans" >
                <h1 className="text-4xl font-black">Dacapo</h1>
                <button className="text-lg px-4 py-1.5 font-bold bg-[#CB5CFF] text-white rounded-xl border-2 hover:ring hover:ring-purple-200 duration-300">
                    <a href="mailto:tbeliveau@dcapo.co">Contact Us</a>
                </button>
            </div>
        </div>
    )
}

export default Navbar
