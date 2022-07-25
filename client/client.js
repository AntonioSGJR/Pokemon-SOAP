const soap = require('soap')
const asciify = require("asciify-image");
const prompt = require('prompt-sync')();
const url = 'http://localhost:8000/?wsdl'

const options = 
{
  fit: "box",
  width: 100,
  height: 50
}

function showPokemons(pokemons, contadorDePokemons)
{
  for (i in pokemons)
  {
    if(parseInt(i) === 10)
    {
      break
    }
    i = (parseInt(i) === 0) ? 0 : parseInt(i)+ 2*parseInt(i);
    switch ((parseInt(i) + contadorDePokemons).toString().length) {
      case 1:
        if(parseInt(i) + contadorDePokemons === 9) console.log(`N° 10 ─ ${pokemons[i]['name']} \tN° 11 ─ ${pokemons[i+1]['name']} \tN° 12 ─ ${pokemons[i+2]['name']}`);
        else console.log(`N° 0${parseInt(i) + contadorDePokemons + 1} ─ ${pokemons[i]['name']} \tN° 0${parseInt(i) + contadorDePokemons + 2} ─ ${pokemons[parseInt(i)+1]['name']} \tN° 0${parseInt(i) + contadorDePokemons + 3} ─ ${pokemons[parseInt(i)+2]['name']}`);
        break;
      default:
        console.log(`N° ${parseInt(i) + contadorDePokemons + 1} ─ ${pokemons[i]['name']}     \tN° ${parseInt(i) + contadorDePokemons + 2} ─ ${pokemons[i+1]['name']}     \tN° ${parseInt(i) + contadorDePokemons + 3} ─ ${pokemons[i+2]['name']}`);
        break;
    }
  }
}

function getLogo()
{
  soap.createClient(url, (err, client) => {
    if(err) console.log(err);

    client.logo((err, result) => {
      if(err) console.log(err);

      result = result.logoResult;
      console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" + result + "\n");
    });
  });
}

function getPokemon(id, fc)
{
  soap.createClient(url, {}, (err, client) => {
    if(err) return console.log(err);
  
    client.getPokemon(id, (err, result) => {
      if(err) console.log(err);
      result = JSON.parse(result.getPokemonResult);
      showPokemons(result, parseInt(id["id"]))  
      
      fc();
    });
    
  });
}

function getPokemonById(id)
{
  soap.createClient(url,{}, (err, client) => {
    if(err) return console.log(err);

    client.getPokemonById(id, (err, result) => {
      if(err) return console.log(err);
    
      result = JSON.parse(result.getPokemonByIdResult);
      showPokemon(result);
    });
  });
  
}

function showPokemon(pokemon)
{
  asciify(pokemon['sprites']['front_default'], options, (err, asciiImage) => {
    if (err) throw err;

    console.log(asciiImage);

    const details = 
    {
      name: pokemon['name'],
      hp: pokemon['stats'][0]['base_stat'],
      attack: pokemon['stats'][1]['base_stat'],
      defense: pokemon['stats'][2]['base_stat'],
      special_attack: pokemon['stats'][3]['base_stat'],
      special_defense: pokemon['stats'][4]['base_stat'],
      speed: pokemon['stats'][5]['base_stat']
    };

    if(pokemon['types'].length === 2)
    {
      details['types'] = `${pokemon['types'][0]['type']['name']}/${pokemon['types'][1]['type']['name']}`;
    }
    else
    {
      details['types'] = `${pokemon['types'][0]['type']['name']}`;
    }

    switch (pokemon['abilities'].length) {
      case 1:
        details['abilities'] = pokemon['abilities'][0]['ability']['name'];
        break;
      case 2:
        details['abilities'] = `${pokemon['abilities'][0]['ability']['name']} e ${pokemon['abilities'][1]['ability']['name']}`;
        break;
      case 3:
        details['abilities'] = `${pokemon['abilities'][0]['ability']['name']}, ${pokemon['abilities'][1]['ability']['name']} e ${pokemon['abilities'][2]['ability']['name']}`;
        break;
      case 4:
        details['abilities'] = `${pokemon['abilities'][0]['ability']['name']}, ${pokemon['abilities'][1]['ability']['name']}, ${pokemon['abilities'][2]['ability']['name']} e ${pokemon['abilities'][3]['ability']['name']}`;
        break;
    }
    
    console.log(`Nome: ${details['name']}       \tTipo(s): ${details['types']} \tHabilidades: ${details['abilities']} \nVida: ${details['hp']}        \tAtaque: ${details['attack']}         \tDefesa: ${details['defense']}\nAtaque especial: ${details['special_attack']} \tDefesa especial: ${details['special_defense']} \tVelocidade: ${details['speed']}`);

    console.log("\n\nENTER ─ Sair");
    let input = prompt();
    start(-30);
  });
  

}


function start(num)
{
  getLogo();

  getPokemon({id: parseInt(num)+ 30}, () => {
    console.log("\nENTER ─ Mais\nNUMERO/NOME ─ Detalhes\nP ─ Pesquisa\nS ─ Sair\n");
    let input = prompt(">>> ");
    console.log(input);

    if(input.toLowerCase() == "s")
    {
      return;
    }
    else if(input === "")
    {
      start(num + 30)
    }
    else if(input.toLowerCase() === "p")
    {
      input = prompt("Digite um numero para fazer a pesquisa: ");
      num = parseInt(input) - 30;
      start(num)
    }
    else
    {
      getPokemonById({id: input});

    }


  });
  

}





start(-30);