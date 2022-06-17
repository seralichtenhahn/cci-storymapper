import json
from ._parser import parse_query

test_results = []

def test(query, print_output = False, expected=None):
  value = parse_query(query)
  if print_output:
    print(value)

  if expected is not None:
    if json.dumps(value) == json.dumps(expected):
      test_results.append({
        "success": True,
        "query": query,
      })
    else:
      print(f"FAILED TEST: {query}")
      print(f"Expected: {expected}")
      print(f"Got: {value}")
      print("\n")
      test_results.append({
        "success": False,
        "query": query,
        "expected": expected,
      })
  return value

def print_output():
  passed_tests = list(filter(lambda x: x["success"], test_results))
  failed_tests = list(filter(lambda x: not x["success"], test_results))

  print("\n")
  print(f"{len(passed_tests)} Passed test(s)")
  print(f"{len(failed_tests)} Failed test(s)")
  print(f"{len(test_results)} Total test(s)")

# Test empty query
test("", expected=[])

# Test single city
test("Basel", expected=[{'type': 'city', 'name': 'Basel', 'country': 'Switzerland'}])

# Test two word city
test("New york", expected=[{'type': 'city', 'name': 'New York', 'country': 'United States'}])
test("This is Fort William", expected=[{'type': 'city', 'name': 'Fort William', 'country': 'United Kingdom'}])

# Test string with no places
test("No place in this string", expected=[])

# Test string with no places
test("If you ever want to come and visit us in Berlin, we will gladly show you around the Brandenburg Gate, the Reichstag Building, and the famous Alexanderplatz square. For some classic dancing and dining, we recommend you go to the Clärchens Ballroom in Mitte. There is no place cooler than Berlin, so you have to stay at the hippest part of town at the Soho House Berlin", print_output=True)

# print test results
print_output()