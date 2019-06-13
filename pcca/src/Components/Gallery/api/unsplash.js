import axios from 'axios';

export default axios.create({
	baseURL : 'https://api.unsplash.com',
	headers : {
      		Authorization : 'Client-ID 75a83c4320c0c37df7de36de2277fa95257ae72532947fc0e54efc93112e5d17'
    }
})