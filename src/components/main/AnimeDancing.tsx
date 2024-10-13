import React from 'react';

interface AnimeDancingProps {
    text: string;
}

const AnimeDancing: React.FC<AnimeDancingProps> = ({ text }) => {
    return (
        <div
            style={{
                width: '100%',
                height: 0,
                paddingBottom: '56%',
                position: 'relative',
                pointerEvents: 'none',
            }}
        >
            <iframe
                src="https://giphy.com/embed/PPgZCwZPKrLcw75EG1"
                width="100%"
                height="100%"
                style={{ position: 'absolute' }}
                frameBorder="0"
                className="giphy-embed"
                allowFullScreen
                title="Chubbicorns Giphy"
            ></iframe>
            <div
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '2%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
                    padding: '10px',
                    fontSize: '2.4vw', // Responsive font size
                    fontFamily: 'Satisfy, cursive', // Font family with a fallback
                    pointerEvents: 'none', // Ensure the text itself is not interactive
                }}
            >
                {text}
            </div>
        </div>
    );
};

export default AnimeDancing;
