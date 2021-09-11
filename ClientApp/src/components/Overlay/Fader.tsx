import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

interface Props {
    text: string
}

function Fader(text : Props) {

    const [fadeProp, setFadeProp] = useState({
        fade: 'fadeIn',
    });

    useEffect(() => {
        const timeout = setInterval(() => {
            if (fadeProp.fade === 'fadeIn') {
                setFadeProp({
                    fade: 'fadeOut'
                })
            } else {
                setFadeProp({
                    fade: 'fadeIn'
                })
            }
        }, 2000);

        return () => clearInterval(timeout)

    }, [fadeProp])

    return (
        <div>
            <p className={fadeProp.fade}>{text}</p>
        </div>
    )
}

Fader.defaultProps = {
    text: 'hello World'
}

Fader.propTypes = {
    text: PropTypes.string
}

export default Fader