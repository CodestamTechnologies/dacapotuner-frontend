const Highlight = ({ text, fontSize = '3rem' }) => (
    <span
        style={{
            fontSize
        }}
        className={`px-4 py-2 bg-slate-800 text-white rounded-lg font-semibold aspect-square`}
    >
        {text}
    </span>
);

export default Highlight;
