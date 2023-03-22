import axios from 'axios';

const genShortUrl = async (term) => {

  return await axios.get('http://localhost:8080/s/' + encodeURIComponent(term), {
    headers: {},
    params: {},
  });
};

export default genShortUrl;