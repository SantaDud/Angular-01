from flask import Flask, Response, request, session
import pymongo
import bcrypt
import json
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
# CORS is used to avoid connection issues when communicating with different applications
# running on different ports
CORS(app)
app.secret_key = "so-secret-omg"
# Set the MongoDB client URL
client = pymongo.MongoClient("mongodb://localhost:27017/")
# Get the MongoDB database
db = client.get_database('Project')


@app.route("/signup", methods=["POST"])
def signup():
    message = ''
    if request.method == "POST":
        # Get the username and password from the json of the request
        username = request.json['username']
        password1 = request.json['password']
        password2 = request.json['confirmPassword']

        
        user_found = db.Users.find_one({"name": username})
        
        # if a user already exists
        if user_found or username == "admin":
            message = 'There already is a user by that name'
            return Response(
                response=json.dumps({"message": message, }),
                status=400,
                mimetype="application/json",)

        # If both passwords match, then
        if password1 == password2:
            hashed = bcrypt.hashpw(password2.encode('utf-8'), bcrypt.gensalt())
            user_input = {'username': username, 'password': hashed}
            # Create a new user
            db.Users.insert_one(user_input)

            return Response(
                response=json.dumps({"message": "Sign up successful.",
                                    "status": 200, "username": username, "password": password1}),
                status=200,
                mimetype="application/json")

        else:
            message = 'Passwords should match!'
            return Response(
                response=json.dumps({"message": message, }),
                status=400,
                mimetype="application/json",)


@app.route("/signin", methods=["POST"])
def signin():
    message = 'Please login to your account'
    if request.method == "POST":
        # Get the username and password from the json of the request
        username = request.json['username']
        password = request.json['password']

        # if user exists in database
        if user_found := db.Users.find_one({"username": username}):
            user_val = user_found['username']
            passwordcheck = user_found['password']

            # if the password entered is valid
            if bcrypt.checkpw(password.encode('utf-8'), passwordcheck):
                session["username"] = user_val
                # Return successful response
                return Response(
                    response=json.dumps(
                        {"message": "Sign In Successful.", "status": 200, "username": username, "password": password}),
                    status=200,
                    mimetype="application/json",)
            else:
                # If password is incorrect
                if "username" in session:
                    message = 'Wrong password'
                    return Response(
                        response=json.dumps({"message": message, }),
                        status=400,
                        mimetype="application/json",)
        else:
            # If no such user exists
            message = 'User not found.'
            return Response(
                response=json.dumps({"message": message, }),
                status=400,
                mimetype="application/json",)


@app.route('/dashboard', methods=["GET"])
def dashboard():
    try:
        # Find all the games in the Collection SteamGames
        data = list(db.SteamGames.find())

        # Convert the _id from ObjectID to a string
        for value in data:
            value["_id"] = str(value["_id"])

        return Response(
            response=json.dumps(data),
            status=200,
            mimetype="application/json")

    except Exception as ex:
        print(ex)

        return Response(
            response=json.dumps({"message": "Error reading data.", }),
            status=500,
            mimetype="application/json",)


@app.route("/dashboard", methods=["POST"])
def add_data():
    # Find if the user trying to create the data exists in database
    user_found = db.Users.find_one({"username": request.json['username']})["username"]
    try:
        data = {
            "Name": request.json["Name"],
            "Release": request.json["Release"],
            "TotalRating": request.json["TotalRating"],
            "Rating": request.json["Rating"],
            "User": user_found
        }

        # Add entry in database
        dbResponse = db.SteamGames.insert_one(data)

        return Response(
            response=json.dumps(
                {"message": "Data added successfully.",
                 "id": f"{dbResponse.inserted_id}"}
            ),
            status=200,
            mimetype="application/json",)
    except Exception as ex:
        return Response(
            response=json.dumps({"message": "Error adding data.", }),
            status=500,
            mimetype="application/json",)


@app.route("/dashboard/<id>", methods=["PATCH", "POST"])
def update_data(id):

    try:
        # Find the entry using the id and update it
        dbResponse = db.SteamGames.update_one(
            {"_id": ObjectId(id)},
            {"$set":
                {
                    "Name": request.json["Name"],
                    "Release": request.json["Release"],
                    "TotalRating": request.json["TotalRating"],
                    "Rating": request.json["Rating"]
                }
             }
        )

        # If modified count is greater than zero, then update successful
        if dbResponse.modified_count != 0:
            return Response(
                response=json.dumps({"message": "Data updated."}),
                status=200,
                mimetype="application/json",)

        return Response(
            response=json.dumps({"message": "No updates made."}),
            status=200,
            mimetype="application/json",)

    except Exception as ex:
        print(ex)

        return Response(
            response=json.dumps({"message": "Can not update data."}),
            status=500,
            mimetype="application/json",)


@app.route("/dashboard/<id>", methods=["DELETE"])
def delete_data(id):
    try:
        # Find the entry using the id and delete it
        dbResponse = db.SteamGames.delete_one({"_id": ObjectId(id)})

        # If deleted count is equal to 1, then delete successful
        if dbResponse.deleted_count == 1:
            return Response(
                response=json.dumps(
                    {"message": "Data deleted", "id": f"{id}"}),
                status=200,
                mimetype="application/json",)

        return Response(
            response=json.dumps({"message": "Data Not Found", "id": f"{id}"}),
            status=500,
            mimetype="application/json",)

    except Exception as ex:
        print(ex)

        return Response(
            response=json.dumps({"message": "Can not delete data."}),
            status=500,
            mimetype="application/json",)

# RUN THE APP ON PORT 3000
if __name__ == "__main__":
    app.run(port=3000, debug=True)