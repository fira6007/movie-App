import React, { useState,useEffect } from "react";
import Search from "./components/Search";
import Loading from "./components/Loading";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount , getTrendingMovies} from "./appwrite.js"

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
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading,setIsLoading]= useState(false);
  
  useDebounce(()=>setDebounceSearchTerm(searchTerm), 1000, [searchTerm]);

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

const loadTrendingMovies=async()=>{
  try{
const movies = await getTrendingMovies();
setTrendingMovies(movies);
  }catch(error){
    console.error("Error fetching trending movies:", error);
    
  }
}

  useEffect(()=>{
    loadTrendingMovies();
  },[]);
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
          {searchTerm.length ==0&& trendingMovies.length>0 && (<section className='trending'>
            <h2>Trending Movies</h2>
            <ul className="flex gap-4">
              {trendingMovies.map((movie,index)=>(<li key={movie.$id}>
                <p>{index+1}</p>
              <img src={movie.poster_url} alt={movie.title} />

              </li>))}
            </ul>

          </section>)}
          <section className='all-movies'>
            <h2 >All Movies</h2>
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
