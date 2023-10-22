var = (4,5,9)
var[2] = 8
print(var)

colors = {
    "white" : (255,255,255),
    "grey" : (128,128,128),
    "red" : (255,0,0),
    "green" : (0,128,0)
}
for col, rgb in colors.items():
    print(col, ":", rgb)
    break


# d1 = {"Adam Smith": 'A', "Judy Paxton": 'B+'}
# d2 = {"Mary Louis": 'A', "Patrick White": 'C'}
# d3 = {}

# for item in (d1, d2):
#     d3.update(item)
# print(d3)

colors = (("green", "#008000"), ("blue", "#0000FF"))
colDict = {color_name: color_code for color_name, color_code in colors}
print(colDict)

# var = 1,2,3
# a,b,c = var
# print(str(a*b*c)*(a*b*c) )
# 666666

# var = 1,
# print(type(var))
# <class 'tuple'>

# var = 1,
# print(var)

myDict = {"A":1, "B":2}
copMyDict = myDict.copy()
myDict.clear()
print(copMyDict)
# {'A': 1, 'B': 2}

# l = ["car", "Ford", "flower", "Tulip"]
# t = tuple(l)
# print(t)

var = 1,2,3,4,5,6,7,8,9
duplicates = var.count(2)
print(duplicates)
