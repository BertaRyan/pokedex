import {useState, useEffect} from 'react'
import "./pokedex.css"
import  pokedexImg  from "../assets/poke-dex copy.webp"

const Pokedex = () => {
    const [pokemon, setPokemon] = useState({})
    const [inputValue, setInputValue] =useState("")
    const enterBtn = document.querySelector('.start')


    const getPokemon = async(input) => {
        try{
            const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
            const data = await resp.json()
            
            const { name, stats, moves: abilities,  sprites: {  front_default : img }, types:[{type: {name: pokeType}}]} = data
            setPokemon({ name, stats, abilities, img, pokeType })
        } catch(err){
            console.log(`Error Message: ${err}`)
        }
    }

    const handleChange = (e) => {
        
        setInputValue(e.target.value)
    }

    const handleKeyChange = (e) => {
        if(e.key === "Enter"){
            getPokemon(inputValue)
            setInputValue('')
            const enterBtn = document.querySelector('.start').disabled = true;
            setTimeout(() => {
                enterBtn.disabled = false;
            }, 500)
        }else{
            return;
        }
    }

    const handleSearch = () => {
        getPokemon(inputValue)
        setInputValue("")
    }

    const handleClear = () => {
        setInputValue('')
        setPokemon({})
        
    }

    
if(enterBtn?.disabled === true){
    setTimeout(() => {
        enterBtn.disabled = false
    }, 1000)
}

   

    useEffect(() => {
        getPokemon("charmander")
        
      
    }, [])

  return (
      <div className="pokedex-container">
          <img src={pokedexImg} alt="Pokedex" />
          <div className="pokedex-left">
              {pokemon.img && <img className="pokemon-sprite" src={pokemon?.img} alt="Pokemon" />}
              <div className="search-container">
                  <input className="search" type="text" onKeyPress={handleKeyChange}onChange={handleChange} placeholder='Search for Pokemon' value={inputValue} />
                  <button onClick={handleSearch} className="start btn">Search</button><button onClick={handleClear} className="clear btn">Clear</button>
              </div>
          </div>
          
        <div className="screen">
            <div className="header">
                  {pokemon.name && <p><b>Name:</b>{pokemon.name}</p>} {pokemon.pokeType && <p><b>type:</b> {pokemon.pokeType}</p>}
            </div>
              
             {pokemon.stats && <div className="stats">
                  <h4>Stats:</h4>
                  <ul className="stat-container">
                    {pokemon.stats.map(x => {
                        const {base_stat, stat: {name} } = x
                        return <li>{name}: {base_stat}</li>
                    })}
                  </ul>
              </div>} 
           {pokemon.abilities&& <div className="abilities">
                <h4>Abilities:</h4>
                <ul className="stat-container">
                      {pokemon.abilities.map(x => {
                        const {move:{name}} = x
                        return <li>{name}</li>
                      })}
                </ul>
              </div>}
        </div>
    </div>
  )
}

export default Pokedex