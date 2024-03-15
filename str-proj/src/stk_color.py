import pylogix
import csv
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
import seaborn as sns
import warnings

matplotlib.use('Agg')


from pylogix import PLC

# ip address for plc
IP_ADDRESS = '192.168.0.10'

get_counter = 0
post_counter = 0




# tags of all the stack lights
stack_light_tags = {
    'blue' : 'Local:1:O.Data.2',
    'green' : 'Local:1:O.Data.3',
    'yellow' : 'Local:1:O.Data.4',
    'red' : 'Local:1:O.Data.5',
}

# Location in memory for the barcode
barcode_mem_loc = 'Scanner:I.ResultData[0]'

# These memory locations allow enabling for triggering
# the scanner.
scanning = [ 'Scanner:O.Control.TriggerEnable', 'Scanner:O.Control.Trigger' ]

# All the zone addresses within the PLC
zones_addresses = [
    'Local:1:I.Data.2',
    'Local:1:I.Data.0',
    'Local:1:I.Data.1',
    'Local:1:I.Data.3',
    'Local:1:I.Data.0'
 ]

def make_chart():
    df = pd.read_csv('get_post_req.csv', names=['Time', 'GET', 'POST'])
    
    if len(df) <= 500:
        df['Time'] = pd.to_datetime(df['Time'], format='%H:%M:%S.%f')
        
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            plt.figure(figsize=(10, 6))
            plt.fill_between(df['Time'], df['GET'], color='skyblue', alpha=0.4, label='GET')
            plt.fill_between(df['Time'], df['POST'], color='skyblue', alpha=0.4, label='POST')
            plt.xticks([])
            plt.xlabel(None)
            plt.tight_layout()
            plt.ioff()
            plt.savefig('../dist/data_chart.png')
    else:
        with open('get_post_req.csv', mode='w', newline='') as f:
            f.write('')


def write_to_file(time, get_count, post_count):
    with open('get_post_req.csv', mode='a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([time, get_count, post_count])
    make_chart()

app = Flask(__name__, static_url_path='/public')
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    global get_counter, post_counter
    if request.method == 'GET':
        get_counter += 1
    elif request.method == 'POST':
        post_counter += 1
        
    print(f'GET={get_counter} POST={post_counter}')
        
    return f'GET={get_counter} POST={post_counter}'

@app.route('/connect-to-plc', methods=['POST'])
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


def enable_scanner(comm):
    print('Enabling scanner...')
    for instr in scanning:
        ret = comm.Write(instr, 1)
        
# grabs the barcode
def get_barcode(comm):
    barcode_arr = []
            
    # Grabs all the characters from the barcode scanned.
    for i in range(31):
        b = comm.Read(f'Scanner:I.ResultData[{i}]')
        barcode_arr.append(chr(b.Value))
    # joins all the characters
    return ''.join(barcode_arr)

        
@app.route('/grab-barcode', methods=['GET'])
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

@app.route('/zone-check', methods=['GET'])
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


@app.route('/get-plc-data', methods=['GET'])
def get_plc_data():
    global get_counter, post_counter
    
    get_counter += 1
    
    write_to_file(datetime.now().time(), get_counter, post_counter)

    
    print(post_counter, get_counter)
    try:
        with PLC() as comm:
            
            print('About to locate PLC Data')
            comm.IPAddress = IP_ADDRESS
            
            sc_tag = comm.Read('Scanner:I.Status.TriggerReady')
            
            conv_full = comm.Read('Local:1:O.Data.5')
            
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


@app.route('/get-request-stats', methods=['GET'])
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


def run_script(comm, chosen_tag):
    ret = comm.Read(chosen_tag)
    
    if ret.Value == 1:
        comm.Write(chosen_tag, 0)
    elif ret.Value == 0:
        comm.Write(chosen_tag, 1)
        
@app.route('/display-lights', methods=['POST'])
def display_lights():
    try:
        global get_counter, post_counter
        post_counter += 1
        write_to_file(datetime.now().time(), get_counter, post_counter)

        with PLC() as comm:
            
            data_from_client = request.json
            comm.IPAddress = IP_ADDRESS
            run_script(comm, data_from_client.get('data'))
            
            data = {
                'success': 200
            }
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error', str(e)});

if __name__ == '__main__':
    app.run(debug=True, host='192.168.1.95', port=8081)

