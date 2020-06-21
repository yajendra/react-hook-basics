import React, { Fragment, useState, useEffect, useReducer } from 'react';
import axios from 'axios';

const dataFetchReducer = (state, action) => {
    switch(action.type){
        case 'FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            }; 
        break;
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data:action.payload,
            };
        break;
        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        break;
        default:
            throw new Error();
    }
};


const useHackerNewsApi = (initialUrl, initialData) => {
    const [url, setUrl]             = useState(initialUrl);
    const [combinedstate, dispatch] = useReducer(dataFetchReducer,{isLoading :false,isError:false,data: initialData });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' });

            try{
                const result = await axios(url);
                dispatch({ type: 'FETCH_SUCCESS' , payload : result.data });
            }catch(error){
                dispatch({ type: 'FETCH_FAILURE' });
            }            
            
        };
 
        fetchData();    
    },[url]);

    return [combinedstate, setUrl];
}
 
function App(){
    const [query, setQuery] = useState('redux');
    const [{ data, isLoading, isError }, setUrl ] = useHackerNewsApi('https://hn.algolia.com/api/v1/search?query=redux', { hits: [] } );

    return(
        <Fragment>
            <form onSubmit={(event) => {setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`); event.preventDefault(); } } >
            <input
                type="text"
                value={query}
                onChange={event => setQuery(event.target.value)}
            />
            <button type="submit">
                Search
            </button>
            </form>

            {isError && <div>Something went wrong ...</div>}

            {isLoading 
                ? 
                    <div>Loading ...</div>
                : 
                    <ul>
                        {data.hits.map(item => (
                            <li key={item.objectID}>
                                <a href={item.url}>{item.title}</a>
                            </li>
                        ))}
                    </ul>
            }
        </Fragment>
    );
}
 
export default App;