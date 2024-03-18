
# ip address for plc
IP_ADDRESS = '192.168.0.10'


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
    'Local:1:I.Data.4'
 ]