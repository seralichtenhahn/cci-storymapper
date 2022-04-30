from _utils import test, print_output

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