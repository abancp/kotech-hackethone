from flask import Blueprint, jsonify, request

report_bp = Blueprint('report',__name__)

@report_bp.route('/accident',methods=['POST'])
def report_accident():
    data = request.get_json()
    