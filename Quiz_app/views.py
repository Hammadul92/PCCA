from . import app
import time
import datetime
from datetime import date



ALLOWED_EXTENSIONS = set(['pdf', 'jpg', 'jpeg', 'png', 'docx'])
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def date_now():
    day = datetime.datetime.now().strftime("%d")
    month = datetime.datetime.now().strftime("%m")
    year = datetime.datetime.now().strftime("%y")
    m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] 
    date = day +' ' + m[int(month)-1] +','+ ' 20' + year
    return date

def day_now():
    day = datetime.datetime.now().strftime("%d")
    return day

def month_now():
    month = datetime.datetime.now().strftime("%m")
    m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] 
    month = m[int(month)-1]
    return month

def year_now():
    year = datetime.datetime.now().strftime("%y")
    return  '20'+year

def year_month_day():
    month = datetime.datetime.now().strftime("%m")
    year = datetime.datetime.now().strftime("%y")
    day = datetime.datetime.now().strftime("%d")
    return [year,month,day]

def get_month_name(month_number):
    m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] 
    month = m[int(month_number)-1]
    return month

def get_month_number(month_name):
    m =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] 
    return m.index(month_name) + 1

def get_month_from_date(date):
    date = date.split(',')
    date = date[0].split(' ')
    date = date[1]
    return date

def calc_days_gap(date1, date2):
    date2= date2.split(',')
    date1 = date1.split(',')
    a = date(int(date2[1]), get_month_number(date2[0].split(' ')[1]), int(date2[0].split(' ')[0]))
    b = date(int(date1[1]), get_month_number(date1[0].split(' ')[1]), int(date1[0].split(' ')[0]))
    days = (a-b).days
    return abs(days)


def decrease_inventory(item, product):
    sizes = product.product_weight.split(",")
    inventory = product.inventory.split(",")
    index = sizes.index(item.product_size)
    inventory_left = str(int(inventory[index]) - item.amount)
    inventory[index] = inventory_left
    new_inventory = ""
    for val in inventory:
        if new_inventory == "":
            new_inventory = val
        else:
            new_inventory = new_inventory + "," + val
    return new_inventory

def inventory_remaining(item,product):
    inventory = product.inventory.split(",")
    sizes = product.product_weight.split(",")
    index = sizes.index(str(item.product_size))
    inventory_left = int(inventory[index])
    return inventory_left

def variational_inventory(product, size):
    inventory = product.inventory.split(",")
    sizes = product.product_weight.split(",")
    index = sizes.index(str(size))
    inventory = int(inventory[index])
    return inventory

def same_as(column_name):
    def default_function(context):
        return context.current_parameters.get(column_name)
    return default_function

def generate_email(top_ID):
    anonymous_email = 'anonymous' + str(top_ID.userID) + '@nse.com'
    return anonymous_email