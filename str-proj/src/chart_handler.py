import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
import seaborn as sns
import warnings
import csv
from datetime import datetime


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
            plt.savefig('data_chart.png')
    else:
        with open('get_post_req.csv', mode='w', newline='') as f:
            f.write('')


def write_to_file(time, get_count, post_count):
    with open('get_post_req.csv', mode='a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([time, get_count, post_count])
    make_chart()