import {useState, useEffect} from 'react'
import "./pokedex.css"
import  pokedexImg  from "../assets/poke-dex copy.webp"

const Pokedex = () => {
    const [pokemon, setPokemon] = useState({})
    const [inputValue, setInputValue] =useState("")
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState({msg:"", err: false})
    const enterBtn = document.querySelector('.start')
    const [allPokemon, setAllPokemon] = useState([])

    const getAllPokemon = async() => {
        try{
            const resp = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1500")
             const {results} = await resp.json()
            setAllPokemon(results)
        } catch(e) {
            console.log(e)
        }
    }

    const getPokemon = async(input) => {
        try{
            setLoading(true)
            const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
            const data = await resp.json()
            
            const { name, stats, moves: abilities,  sprites: {  front_default : img }, types:[{type: {name: pokeType}}]} = data
            setPokemon({ name, stats, abilities, img, pokeType })
            setInputValue("")
            setLoading(false)
        } catch(err){
            setLoading(false)
            setPokemon({})
            setError({msg:err, err:err})
            
            setTimeout(() => {
                setError({msg:"", err:false})
            }, 3000)
        }
    }

    const handleChange = (e) => {
        setInputValue(e.target.value.toLowerCase())
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

document.addEventListener('click', (e) => {
const searchInput = document.querySelector('.search')
if(e.target !== searchInput){
    setInputValue("")
}
})

    useEffect(() => {
        getPokemon("charmander")
        getAllPokemon()
      
    }, [])


    const filteredPokemonList = allPokemon.filter(poke => poke.name.includes(inputValue))

  return (
      <div className="pokedex-container">
          <img src={pokedexImg} alt="Pokedex" />
          <div className="pokedex-left">
              { pokemon.img && <img className="pokemon-sprite" src={pokemon?.img} alt="Pokemon" /> }
              <div className="search-container">
                  <input id='pokemonSearchInput'  className="search" type="text" onKeyPress={handleKeyChange}onChange={handleChange} placeholder='Search for Pokemon' value={inputValue} />
                  <ul className={inputValue ? "search-dropdown" : "hide"} >
                    { inputValue && filteredPokemonList.map(item => {
                        return <li onClick={() => {getPokemon(item.name)}}>{item.name}</li>
                    })}
                  </ul>
                  <button onClick={handleSearch} className="start btn">Search</button><button onClick={handleClear} className="clear btn">Clear</button>
              </div>
          </div>
          <div className="pokedex-right">
        <div className="screen">
              {error.err && <div>The Pokemon you searched for doesn't exist, Check your spelling</div>}
           {isLoading ? <div className="loading"></div> : <> <div className="header">
                  {pokemon.name && <p><b>Name:</b>{pokemon.name}</p>} {pokemon.pokeType && <p><b>type:</b> {pokemon.pokeType}</p>}
            </div>
                 
             {pokemon.stats && <div className="stats">
                  <h4>Base Stats:</h4>
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
              </>}
        </div>
          </div>
    </div>
  )
}

export default Pokedex