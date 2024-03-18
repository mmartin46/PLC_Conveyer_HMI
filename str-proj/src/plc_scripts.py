from memory_locations import *
from chart_handler import *


def run_script(comm, chosen_tag):
    ret = comm.Read(chosen_tag)
    print(ret.TagName, ret.Value, ret.Status)
    
    if ret.Value == 1:
        comm.Write(chosen_tag, 0)
    elif ret.Value == 0:
        comm.Write(chosen_tag, 1)
        

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