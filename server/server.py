from typing import List
from unittest import result
import requests
from pprint import pprint
import json
from spyne import Application, ServiceBase, Unicode, rpc, Integer
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

url = "https://pokeapi.co/api/v2/"


class pokemon(ServiceBase):
  @rpc(Unicode, _returns=Unicode)
  def logo(ctx, request_id):
    return """
                 ,'\
  _.----.        ____         ,'  _\   ___    ___     ____
_,-'       `.     |    |  /`.   \,-'    |   \  /   |   |    \  |`.
\      __    \    '-.  | /   `.  ___    |    \/    |   '-.   \ |  |
 \.    \ \   |  __  |  |/    ,','_  `.  |          | __  |    \|  |
   \    \/   /,' _`.|      ,' / / / /   |          ,' _`.|     |  |
    \     ,-'/  /   \    ,'   | \/ / ,`.|         /  /   \  |     |
     \    \ |   \_/  |   `-.  \    `'  /|  |    ||   \_/  | |\    |
      \    \ \      /       `-.`.___,-' |  |\  /| \      /  | |   |
       \    \ `.__,'|  |`-._    `|      |__| \/ |  `.__,'|  | |   |
        \_.-'       |__|    `-._ |              '-.|     '-.| |   |
                                `'                            '-._|

  """
  @rpc(Unicode, _returns=Unicode)
  def getPokemon(ctx, id):
    response = requests.get(url + f"pokemon?limit=30&offset={id}")
    print("\n\n\n\n"+url + f"pokemon?limit=40&offset={id}"+ "\n\n\n\n")
    pokemons = response.json().get('results')
    
    return json.dumps(pokemons)
  
  @rpc(Unicode, _returns=Unicode)
  def getPokemonById(ctx, id):
    response = requests.get(url + f"pokemon/{id}")
    pokemon = response.json()
    #stats, types, weight, height
    
    return json.dumps(pokemon)
  
  @rpc(Unicode, _returns=Unicode)
  def getTipo(ctx, request_id):
    response = requests.get(url + "type")
    tipos = response.json().get('results')
    
    return json.dumps(tipos)

  @rpc(Unicode, _returns=Unicode)
  def getTipoById(ctx, id):
    response = requests.get(url + f'type/{id}/')
    tipo = response.json()
    #double_damage_from, double_damage_to, half_damage_from, half_damage_from, no_damage_from, no_damage_to, moves
    return json.dumps(tipo)

  @rpc(Unicode, _returns=Unicode)
  def getHabilidade(ctx, id):
    response = requests.get(url + f"ability?offset={id}&limit=10")
    habilidades = response.json().get('results')
    
    return json.dumps(habilidades)

  @rpc(Unicode, _returns=Unicode)
  def getHabilidadeById(ctx, id):
    response = requests.get(url + f"ability/{id}/")
    habilidade = response.json()
    #generation, is_main_series
    return json.dumps(habilidade)
  
application = Application(
  services=[pokemon],
  tns='http://python-pokemon-api-soap.org/',
  in_protocol=Soap11(validator='lxml'),
  out_protocol=Soap11()
)

application = WsgiApplication(application)

if __name__ == '__main__':
  import logging
  
  from wsgiref.simple_server import make_server
  
  logging.basicConfig(level=logging.DEBUG)
  logging.getLogger('spyne.protocol.xml').setLevel(logging.DEBUG)
  
  logging.info("listening to http://127.0.0.1:8000")
  logging.info("wsdl is at: http://localhost:8000/?wsdl")
  
  server = make_server('127.0.0.1', 8000, application)
  server.serve_forever()