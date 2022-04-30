import json
from _parser import parse_query

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