from flask import Flask, jsonify, request
from config.mongodb import reports,buses
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import google.generativeai as genai
import os
import requests
genai.configure(api_key=os.getenv("GEMINI_API"))

model = genai.GenerativeModel('gemini-2.0-flash')
chat = model.start_chat(history=[])


def serialize_docs(cursor):
    return [
        {**doc, "_id": str(doc["_id"])} for doc in cursor
    ]

app = Flask(__name__)
CORS(app,origins=["http://localhost:5173"])

@app.route("/report/accident",methods=['POST'])
def report_accident():
    data = request.get_json()
    print(data)
    reports.insert_one({
        "type":"Accident",
        "time":datetime.now(),
        "place":data['place']
    })
    return jsonify({"success":True})
    
@app.route("/report/event",methods=['POST'])
def report_event():
    data = request.get_json()
    reports.insert_one({
        "type":"Event",
        "name":data['name'],
        "time":data['date'],
        "place":data['place']
    })
    return jsonify({"success":True})

@app.route("/report/traffic",methods=['POST'])
def report_traffic():
    data = request.get_json()
    reports.insert_one({
        "type":"Traffic Jam",
        "time":datetime.now(),
        "place":data['place'],
    })
    return jsonify({"success":True})
@app.route("/reports",methods=['GET'])
def get_reports():
    thirty_minutes_ago = datetime.now(timezone.utc) - timedelta(minutes=30)
    cursor = reports.find({
    "time": {
        "$gte": thirty_minutes_ago
    }
    })
    return jsonify({"reports":serialize_docs(list(cursor))})

@app.route("/bus/<start>/<end>",methods=["GET"])
def get_bus(start,end):
    now = datetime.now().strftime("%H:%M")

    # Step 1: Find all buses where `start` comes before `end` in route
    matching_buses = buses.find({
        "route": {
            "$all": [start, end]
        }
    })

    # Step 2: Filter in Python to check correct order and next time
    def is_valid_order(route, start, end):
        try:
            return route.index(start) < route.index(end)
        except ValueError:
            return False

    def next_bus_time(times):
        for t in times:
            if t > now:
                return t
        return None

    next_buses = []

    for bus in matching_buses:
        if is_valid_order(bus['route'], start, end):
            next_time = next_bus_time(bus['time'])
            if next_time:
                next_buses.append({
                    "name": bus['name'],
                    "route": bus['route'],
                    "next_time": next_time
                })

    # Sort buses by next available time
    next_buses.sort(key=lambda x: x['next_time'])

    # Result: next upcoming bus
    if next_buses:
        print("Next bus:", next_buses[0])
        return jsonify({"bus":next_buses[0]})
    else:
        return jsonify({"bus":[]})
    
@app.route("/chat",methods=["POST"])
def assistance():
    data = request.get_json()
    genai.configure(api_key=os.getenv("GEMINI_API"))
    model = genai.GenerativeModel('gemini-1.5-flash')
    thirty_minutes_ago = datetime.now(timezone.utc) - timedelta(minutes=30)
    cursor = reports.find({
    "time": {
        "$gte": thirty_minutes_ago
    }
    })
    reports_ = list(cursor)
    log = "Recent reports from kottakkal \n"
    for report in reports_:
        log+= (report['type']+ " at "+ str(report['time']) + " \n ")
    print(log)
    response = model.generate_content("You are a helpful assitance for Kottakkal traffic controlling & managing ,responsive positivly. so generate not too long response for users prompt . use log data user requested any relevent data that in log log :"+log+". dont use any questions to users prompt"+data['prompt'])
    print(response.text)
    return jsonify({"response":response.text})


def assistance():
    print(os.getenv('OPENROUTER_API'))
    data = request.get_json()
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API')}",
        "Content-Type": "application/json"
    }
    thirty_minutes_ago = datetime.now(timezone.utc) - timedelta(minutes=30)
    cursor = reports.find({
    "time": {
        "$gte": thirty_minutes_ago
    }
    })
    reports_ = list(cursor)
    log = "Recent reports from kottakkal \n"
    for report in reports_:
        log+= (report['type']+ " at "+ str(report['time']) + " \n ")
    print(log)
        
    payload = {
        "model": "qwen/qwq-32b:free",
        "messages": [
            {"role": "system", "content": "You are a helpful assitance for Kottakkal traffic controlling & managing , so generate not too long response for users prompt . use log data user requested any relevent data that in log log :"+log+". dont use any questions to users prompt"+data['prompt']},
            {"role": "user", "content": data['prompt']}
        ]
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        print(data)
        return jsonify({"response":data["choices"][0]["message"]["content"]})
    else:
        print(response)
        return jsonify({"error":f"Error {response.status_code}: {response.text}"})


if __name__ == "__main__":
    app.run(debug=True)
