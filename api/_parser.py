import csv
import os
from nltk.tokenize import sent_tokenize
import en_core_web_md
import requests
import urllib
from flask import current_app
import sys
from ._utils import kebab, search_set, get_center_point

nlp = en_core_web_md.load()

csv_path = os.getcwd() + "/api/data/cities.csv"
cities = []
coutries = []

# handle prefixes:
# 1. St -> Saint-
# 2. San -> San 
prefixes = {
  "St": "Saint-",
  "St-": "Saint-",
  "San": "San ",
}

with open(csv_path, 'r') as csv_file:
  csv_reader = csv.DictReader(csv_file)

  cities = list(csv_reader)
  coutries = list(set(map(lambda city: city["country_name"], cities)))

  # sort list by length of city name
  cities.sort(key=lambda city: len(city["city_name"]), reverse=True)


def parse_query(query, excluded=[]):
  results = []
  parsed_entities = set()

  sentences = sent_tokenize(query)
  for sentence in sentences:
    doc = nlp(sentence)

    # get all named entities
    for entity in doc.ents:
      # check if already parsed
      if search_set(parsed_entities, entity.text):
        continue

      # if entity is a geographical entity
      if entity.label_ == 'GPE':
        # check if is a country
        country = _find_country(entity.text)
        if country:
          parsed_entities.add(country)
          results.append({
            "type": "country",
            "name": country,
            "query": entity.text
          })
          continue

        # check if is a city
        city = _find_city(entity.text)
        if city:
          parsed_entities.add(city["city_name"])
          results.append({
            "type": "city",
            "name": city["city_name"],
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
          "name": entity.text,
          "query": entity.text
        })

      # if entity is a facility or landmark
      elif entity.label_ == 'FAC':
        parsed_entities.add(entity.text)
        results.append({
          "type": "facility",
          "name": entity.text,
          "query": entity.text
        })

      # if entity is a person or organisation
      # (sometimes spacy returns a person as a location or organisation)
      elif entity.label_ == 'PERSON' or entity.label_ == 'ORG':
        city = _find_city(entity.text)
        if city:
          parsed_entities.add(city["city_name"])
          results.append({
            "type": "city",
            "name": city["city_name"],
            "query": entity.text
          })

    # get all nouns
    for token in doc:
      if token.tag_ == "NNP":

        # check if already parsed
        if search_set(parsed_entities, token.text):
          continue

        search_query = token.text
        original_query = token.text

        lefts = [t.text for t in token.lefts]

        if len(lefts) > 0:
          prefix = lefts[0]
          # check if token has prefix
          if prefix in prefixes:
            search_query = prefixes[prefix] + token.text
            original_query = f"{prefix} {token.text}"
        
        city = _find_city(search_query)
        if city is not None:
          results.append({
            "type": "city",
            "name": city["city_name"],
            "query": original_query
          })

  if len(results) == 0:
    return []

  # filter excluded entities
  filtered_results = filter(lambda entity: entity["query"] not in excluded, results)

  # sort results by appearance in query
  def sort_by_index(entity):
    return query.find(entity["query"])

  filtered_results = sorted(filtered_results, key=sort_by_index)

  geocoded_entities = []
  for entity in filtered_results:
    # get center point of all parsed entities
    proximity = get_center_point(geocoded_entities)
    geocoded_entities.append(_fetch_details(entity, proximity))

  return geocoded_entities

def _fetch_details(entity, proximity=None):
  base_url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
  query = urllib.parse.quote(entity["name"])

  types_map = {
    "country": "country",
    "city": "place,locality",
    "location": "place",
    "facility": "poi",
    "unknown": "country,place,locality,region,district,poi" 
  }

  options = {
    "access_token": current_app.config["MAPBOX_ACCESS_TOKEN"],
    "types": types_map[entity["type"]],
    "language": "en",
    "autocomplete": "false",
    "limit": 1
  }

  if proximity:
    options["proximity"] =  str(proximity["lng"]) + "," + str(proximity["lat"])

  res = requests.get(base_url + query + ".json", params=options)
  data = res.json()
  if res.status_code != 200 or len(data['features']) == 0:
    print("Error: " + str(data), file=sys.stderr)
    return entity
  
  feature = data['features'][0]

  # filter out not relevant entries
  if feature["relevance"] < 0.8:
    return entity

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
    cityname_lower = city["city_name"].lower()
    if cityname_lower == kebab(query):
      return city
    if cityname_lower == query.lower():
      return city
    for prefix in prefixes:
      if prefix in query:
        query_with_prefix = query.replace(prefix, prefixes[prefix])
        if cityname_lower == kebab(query_with_prefix):
          return city
        if cityname_lower == query_with_prefix.lower():
          return city
  return None

def _find_country(query):
  for country in coutries:
    if country.lower() == query.lower():
      return country
  return None
