import pylogix
import csv
from datetime import datetime
from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
import seaborn as sns
import warnings
from plc_scripts import *

matplotlib.use('Agg')


from pylogix import PLC


get_counter = 0
post_counter = 0




# Blueprints
main_bp = Blueprint('main', __name__)


@main_bp.route('/', methods=['GET', 'POST'])
def index():
    global get_counter, post_counter
    if request.method == 'GET':
        get_counter += 1
    elif request.method == 'POST':
        post_counter += 1
        
    print(f'GET={get_counter} POST={post_counter}')
        
    return f'GET={get_counter} POST={post_counter}'

@main_bp.route('/read-light-status', methods=['POST'])
def read_light_status():
    global get_counter, post_counter
    post_counter += 1
    write_to_file(datetime.now().time(), get_counter, post_counter)
    
    try:
        with PLC() as comm:
            comm.IPAddress = IP_ADDRESS
            
            data = request.json
            color = data['color']
            
            ret = comm.Read(stack_light_tags[color])
            print(ret.TagName, ret.Value, ret.Status)
            
            if ret.Value == True:
                v = 1
            else:
                v = 0
                        
            # Sets data for the given light
            light_status = {
                'value' : v
            }
            
            return jsonify(light_status), 200
    except Exception as e:
        return jsonify({'error' : str(e)})
 
    
    
    

@main_bp.route('/connect-to-plc', methods=['POST'])
def connect_to_plc():
    global get_counter, post_counter
    
    post_counter += 1
    write_to_file(datetime.now().time(), get_counter, post_counter)
    
    
    data = request.json
    
    with PLC() as comm:
        comm.IPAddress = IP_ADDRESS
        color = data['color']
        value = data['value']
        
        ret = comm.Write(stack_light_tags[color], value)

    response_data = {'status' : 'connected'}
    return jsonify(response_data)
        
@main_bp.route('/grab-barcode', methods=['GET'])
def grab_barcode():
    global get_counter, post_counter
    
    get_counter += 1
    write_to_file(datetime.now().time(), get_counter, post_counter)

    
    try:
        with PLC() as comm:
            comm.IPAddress = IP_ADDRESS
            
            # enables the scanner
            enable_scanner(comm)
            
            
            barcode = comm.Read(barcode_mem_loc)
                        
            response_data = {
                'barcode' : get_barcode(comm),
                'status' : barcode.Status
            }
            
            # Sends the data back with a status code of 200.
            return jsonify(response_data), 200
    except Exception as e:
        return jsonify({'error' : str(e)})

@main_bp.route('/zone-check', methods=['GET'])
def zone_check():
    global get_counter, post_counter
    
    get_counter += 1
    
    write_to_file(datetime.now().time(), get_counter, post_counter)

    
    try:
        with PLC() as comm:
            zone_statuses = {}
            
            print('Checking zones')
            comm.IPAddress = IP_ADDRESS
            
            
            # Used to keep in check with the
            # correct index number for each zone. (Photoeye)
            i = 1
            for zone_num in zones_addresses:
                zone_address = zone_num
                r = comm.Read(zone_address)
                
                v = []
                # if the value is equal to true
                # use a 1, else use a 0.
                if r.Value == True:
                    v = 1
                else:
                    v = 0
                    
                # Sets data for each zone
                zone_statuses[f'Zone {i}'] = {
                    'value' : v
                }
                i += 1
            
            return jsonify(zone_statuses), 200
        
    except Exception as e:
        return jsonify({'error' : str(e)})


@main_bp.route('/get-plc-data', methods=['GET'])
def get_plc_data():
    global get_counter, post_counter
    
    get_counter += 1
    
    write_to_file(datetime.now().time(), get_counter, post_counter)

    
    print(post_counter, get_counter)
    try:
        with PLC() as comm:
            
            print('About to locate PLC Data')
            comm.IPAddress = IP_ADDRESS
            
            sc_tag = comm.Read('Scanner_On')
            
            conv_full = comm.Read('All_Zones_On')
            
            data = {
                'scan_on' : str(sc_tag.Value).upper(),
                'conveyer_full' : str(conv_full.Value).upper(),
                'plc_info' : str(comm.GetDeviceProperties())[24:100],
                'plc_port' : str(comm.Port),
                'plc_time' : str(comm.GetPLCTime())
            }
                        
            return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'error', str(e)})


@main_bp.route('/get-request-stats', methods=['GET'])
def get_request_stats():
    try:
        
        global get_counter, post_counter

        data = {
            'GET' : get_counter,
            'POST' : post_counter 
        }
        
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error', str(e)})


        
@main_bp.route('/display-lights', methods=['POST'])
def display_lights():
    try:
        global get_counter, post_counter
        post_counter += 1
        write_to_file(datetime.now().time(), get_counter, post_counter)

        with PLC() as comm:
            
            data_from_client = request.json
            comm.IPAddress = IP_ADDRESS
            
            print(str(request.json))
            
            run_script(comm, data_from_client.get('data'))
            
            data = {
                'success': 200
            }
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error', str(e)});
