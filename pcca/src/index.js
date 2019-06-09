// Import the React and ReactDOM libraries
import React from 'react';
import ReactDOM from 'react-dom';


// Create a React Component

const APP = () => {
	return <div>Hello</div>;
}

// Take a React Component and show it on screen
ReactDOM.render(
	<APP />,
	document.querySelector('#root')
);