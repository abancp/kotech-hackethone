from flask import Flask, jsonify, request
from config.mongodb import reports
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app,origins=["http://localhost:5173"])

@app.route("/report/accident",methods=['POST'])
def report_accident():
    data = request.get_json()
    print(data)
    reports.insert_one({
        "type":"accident",
        "time":datetime.datetime.now(),
        "place":data['place']
    })
    return jsonify({"success":True})
    
@app.route("/report/event",methods=['POST'])
def report_event():
    data = request.get_json()
    reports.insert_one({
        "type":"event",
        "time":datetime.datetime.now(),
        "name":data['name'],
        "date":data['date'],
        "place":data['place']
    })
    return jsonify({"success":True})

@app.route("/report/traffic",methods=['POST'])
def report_traffic():
    data = request.get_json()
    reports.insert_one({
        "type":"event",
        "time":datetime.datetime.now(),
        "place":data['place'],
    })
    return jsonify({"success":True})
@app.route("/reports",methods=['GET'])
def get_reports():
    reports.find({""})

if __name__ == "__main__":
    app.run(debug=True)
