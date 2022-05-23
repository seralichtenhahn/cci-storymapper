import csv
import os
from nltk.tokenize import sent_tokenize
import en_core_web_md
import requests
import urllib
from flask import current_app
import sys

nlp = en_core_web_md.load()

csv_path = os.getcwd() + "/api/data/cities.csv"
cities = []
coutries = []

with open(csv_path, 'r') as csv_file:
  csv_reader = csv.DictReader(csv_file)

  cities = list(csv_reader)
  coutries = list(set(map(lambda city: city["country_name"], cities)))

  # sort list by length of city name
  cities.sort(key=lambda city: len(city["city_name"]), reverse=True)


def parse_query(query, excluded=[]):
  results = []
  sentences = sent_tokenize(query)
  for sentence in sentences:
    parsed_entities = set()
    doc = nlp(sentence)

    # get all named entities
    for entity in doc.ents:
      # if entity is a city
      print(entity.text, entity.label_, file=sys.stderr)
      if entity.label_ == 'GPE':
        # check if is country
        country = _find_country(entity.text)
        if country:
          parsed_entities.add(country)
          results.append({
            "type": "country",
            "name": country,
            "query": entity.text
          })
          continue

        # check if is city
        city = _find_city(entity.text)
        if city:
          parsed_entities.add(city["city_name"])
          results.append({
            "type": "city",
            "name": city["city_name"],
            "country_code": city["country_iso_code"],
            "query": entity.text
          })
          continue

        # not a city or country
        results.append({
          "type": "unknown",
          "name": entity.text,
          "query": entity.text
        })

      # if entity is a location
      elif entity.label_ == 'LOC':
        parsed_entities.add(entity.text)
        results.append({
          "type": "location",
          "name": entity.text
        })
      # if entity is a facility or landmark
      elif entity.label_ == 'FAC':
        parsed_entities.add(entity.text)
        results.append({
          "type": "facility",
          "name": entity.text,
          "query": entity.text
        })

    # get all nouns
    for token in doc:
      if token.tag_ == "NNP":
        # check if already parsed
        if _search_set(parsed_entities, token.text):
          continue

        city = _find_city(token.text)
        if city is not None:
          results.append({
            "type": "city",
            "name": city["city_name"],
            "country_code": city["country_iso_code"],
            "query": token.text
          })
    
  if len(results) == 0:
    return []

  # filter excluded entities
  filtered_results = filter(lambda entity: entity["name"] not in excluded, results)

  geocoded_entities = list(map(_fetch_details, filtered_results))

  return geocoded_entities

def _fetch_details(entity):
  base_url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
  query = urllib.parse.quote(entity["name"])

  types_map = {
    "country": "country",
    "city": "place,locality",
    "location": "place",
    "facility": "poi",
    "unknown": "country,place,locality,region,district" 
  }

  options = {
    "access_token": current_app.config["MAPBOX_ACCESS_TOKEN"],
    "types": types_map[entity["type"]],
    "language": "en",
    "limit": 1
  }

  if entity["type"] == "city":
    options["country"] = entity["country_code"]

  res = requests.get(base_url + query + ".json", params=options)
  data = res.json()
  if res.status_code != 200 or len(data['features']) == 0:
    print("Error: " + str(data))
    return entity
  
  feature = data['features'][0]

  if entity["type"] == "unknown":
    entity["type"] = feature["place_type"][0]
    entity["name"] = feature["text"]

  return {
    "type": entity['type'],
    "name": entity['name'],
    "query": entity['query'],
    "lat": feature['center'][1],
    "lng": feature['center'][0],
    "country": entity['name'] if entity["type"] == "country" else feature['context'][-1]['text'],
    "properties": feature['properties']
  }

def _find_city(query):
  for city in cities:
    if city["city_name"].lower() == query.lower():
      return city
  return None

def _find_country(query):
  for country in coutries:
    if country.lower() == query.lower():
      return country
  return None

def _search_set(set, query):
  for set_item in set:
    if query.lower() in set_item.lower():
      return True
  return False