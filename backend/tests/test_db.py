from backend.database import db

print(db.list_collection_names())   
db.scenarios.insert_one({"hello": "world"})
print(list(db.scenarios.find({}))) 
