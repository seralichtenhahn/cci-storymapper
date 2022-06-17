from re import sub

def kebab(s):
  return '-'.join(
    sub(r"(\s|_|-)+"," ",
    sub(r"[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+",
    lambda mo: ' ' + mo.group(0).lower(), s)).split())

def search_set(set, query):
  for set_item in set:
    if query.lower() in set_item.lower():
      return True
  return False

def get_center_point(entities):
  if len(entities) == 0:
    return None

  lats = []
  lngs = []

  for entity in entities:
    if "lat" in entity and "lng" in entity:
      lats.append(entity["lat"])
      lngs.append(entity["lng"])

  if len(lats) == 0 or len(lngs) == 0:
    return None

  return {
    "lat": sum(lats) / len(lats),
    "lng": sum(lngs) / len(lngs)
  }