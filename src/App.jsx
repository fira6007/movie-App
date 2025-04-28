import React, { useState } from "react";
import Search from "./components/Search";

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main>
      <div className="pattern">
        
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="hero banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
          </header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          <h1 className='text-white text-5xl'>{searchTerm}</h1>
        </div>
      </div>
    </main>
  );
};

export default App;
