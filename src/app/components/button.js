import {NavLink} from "react-router-dom";

function Button(props) {
    let defaultClassNames="focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
    let blueColourClasses="text-white dark:text-white bg-blue-700 hover:bg-blue-800 "
    let whiteColourClasses="text-gray-900 dark:text-gray-900 bg-white hover:bg-gray-100 "
    let redColourClasses="text-white dark:text-white bg-red-700 hover:bg-red-800 "

    //check props for colour and add the appropriate classes
    if (props.colour == 'red') {
        defaultClassNames = defaultClassNames + redColourClasses
    }
    else if (props.colour == 'white') {
        defaultClassNames = defaultClassNames + whiteColourClasses
    }
    else {
        defaultClassNames = defaultClassNames + blueColourClasses
    }
    //check props for width and add appropriate classes
    if (props.width == 'full') {
        defaultClassNames = defaultClassNames + 'w-full'
    }


    return <NavLink to={props.link}> <button type="button"
                   className={defaultClassNames}>{props.text}

    </button>
    </NavLink>
}

export default Button