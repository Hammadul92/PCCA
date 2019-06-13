###############################
##### To fire-up the app ######
#####run this file run.py######
###############################
from Quiz_app import app as application
from instance import create_db 


if __name__ == '__main__':
  application.run(host='0.0.0.0', debug='True')
