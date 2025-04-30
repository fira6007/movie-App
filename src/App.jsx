import React, { useState,useEffect } from "react";
import Search from "./components/Search";
import Loading from "./components/Loading";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite.js"

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY =import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS={
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading,setIsLoading]= useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  useDebounce(()=>setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query)=>{
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint=query? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      
      if(data.Response==='False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([])
      }
      setMovieList(data.results || [])
   
      if(query && data.results.length>0){
        const movie=data.results[0];
        await updateSearchCount(query,movie);
      }

  }catch (error){
    console.error("Error fetching movies:", error);
    setErrorMessage("Failed to fetch movies. Please try again later.");
  }finally{
    setIsLoading(false);
  }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  },[debounceSearchTerm]);

  return (
    <main>
      <div className="pattern w-[100%]">

        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="hero banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
          <section className='all-movies'>
            <h2 className="mt-[40px]">All Movies</h2>
            {isLoading ? <Loading/> :errorMessage? (<p className="text-red-500">{errorMessage}</p>):
            <ul>
              {movieList.map((movie)=>(<MovieCard key={movie.id} movie={movie}/> ))}
            </ul> }
            
          </section>
          
        </div>
      </div>
    </main>
  );
};

export default App;
