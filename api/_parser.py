import csv
import sys
import os
from nltk.tokenize import sent_tokenize, word_tokenize
import en_core_web_sm

nlp = en_core_web_sm.load()

csv_path = os.getcwd() + "/api/data/cities.csv"
cities = []

with open(csv_path, 'r') as csv_file:
  csv_reader = csv.reader(csv_file)
  cities = list(csv_reader)

  # sort list by length of city name
  cities.sort(key=lambda x: len(x[7]), reverse=True)

def parse_query(query):
  results = []
  sentences = sent_tokenize(query)
  for sentence in sentences:
    parsed_entities = set()
    doc = nlp(sentence)

    # get all named entities
    for entity in doc.ents:
      # if entity is a city
      if entity.label_ == 'GPE':
        city = _find_city(entity.text)
        if city is not None:
          parsed_entities.add(city[7])
          results.append({
            "type": "city",
            "name": city[7],
            "country": city[4]
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
          "name": entity.text
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
            "name": city[7],
            "country": city[4]
          })

  return results

def _find_city(query):
  for city in cities:
    if city[7].lower() == query.lower():
      return city
  return None

def _search_set(set, query):
  for set_item in set:
    if query.lower() in set_item.lower():
      return True
  return False