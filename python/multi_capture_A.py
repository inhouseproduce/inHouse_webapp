#Working code for remote monitoring purposes of products by inHouse Produce. ONLY to be used by inHouse Produce.
#Test code taken from https://www.arducam.com/multi-camera-adapter-module-raspberry-pi/ and modified to requirements

#The following code uses an ArduCam header to multiplex four cameras at 30 minute intervals and sends the received picture right to the Amazon S3 web server before deleting it on the pi itself

#importing relevant modules
import RPi.GPIO as gp
import os
import time
import datetime
from picamera import PiCamera

#using camera as the variable to control PiCamera()
camera = PiCamera()

#set warnings OFF
gp.setwarnings(False)
gp.setmode(gp.BOARD)

#Pin 7 needed for all cameras
gp.setup(7, gp.OUT)

#Listed pins according to arducam adapter number
arducam_pins = {
     1: [11, 12], 2: [15, 16], 3: [21, 22], 4: [23, 24] }

#For loop to turn on the relevant pins
for x in range(0,len(arducam_pins)):
   pins = arducam_pins[x+1]
   for pin in pins:
        gp.setup(pin, gp.OUT)
        gp.output(pin, True)

#algorithm to extract serial number of the Raspberry Pi
serialfile = open('/proc/cpuinfo','r')
for line in serialfile:
    if line[0:6]=='Serial':
        cpuserial = line[10:26]
serialfile.close()

#Using all pathways as global variables
pathway = pathway1 = pathway2 = pathway3 = pathway4 = "global"


def main():
    #using the pathway in the define structure by declaring it
    if (os.path.exists('/home/pi/out.txt') == False):
        #if there is no output file created, a new one is generated with recursive listings associated with the Pi's serial number
        os.system('s3cmd ls -r s3://inhouseproduce-sites | grep "%s" > out.txt' %cpuserial)
        #Opening and extrapolating data from the newly generated output files in one function called get_pathways()
        get_pathways()
    else:
        #if out.txt is already present, the script will not send the command for the recursive listing and get the pathways from the already generated out.txt file
        get_pathways()

    while True:
         #First Camera Operation (Module1)
         gp.output(7, False); gp.output(11, False); gp.output(12, True)
         #function that implements the whole camera capture
         camera_process(pathway1)

         #Second Camera Operation (Module2)
         gp.output(7, True); gp.output(11, False); gp.output(12, True)
         #function that implements the whole camera capture
         camera_process(pathway2)

         #Third Camera Operation (Module3)
         gp.output(7, False); gp.output(11, True); gp.output(12, False)
         #function that implements the whole camera capture
         camera_process(pathway3)

         #Fourth Camera Operation (Module4)
         gp.output(7, True); gp.output(11, True); gp.output(12, False)
         #function that implements the whole camera capture
         camera_process(pathway4)

         time.sleep(1800)

def get_pathways()
   #using the global pathway variable and assigning them appropriate paths
   global pathway1, pathway2, pathway3, pathway4
   f = open('/home/pi/out.txt','r')
   #reading lines of the file one by one
   lines = f.readlines()
   for line in lines:
       #following lines get the desired listing and strip the unnecessary string from the pathway
       if (line.find('Module1') >= 0):
           #29th character onwards gives the correct pathway
           pathway1 = line[29:]
       elif (line.find('Module2') >= 0):
           #29th character onwards gives the correct pathway
           pathway2 = line[29:]
       elif (line.find('Module3') >= 0):
           #29th character onwards gives the correct pathway
           pathway3 = line[29:]
       elif (line.find('Module4') >= 0):
           #29th character onwards gives the correct pathway
           pathway4 = line[29:]


#operation of the user-defined function 'camera_process()'
def camera_process(pathway):
    camera.rotation = 270
    camera.start_preview()
    #at least 2 seconds of sleep time required for the camera to focus
    time.sleep(3)
    #new date and time stamp everytime
    date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
    camera.capture("/home/pi/camera_%s.jpg" %date)
    camera.stop_preview()
    #Using OS system commands to first put the image in the desired folder and then deleting the image from the Pi
    os.system('s3cmd put camera_%s.jpg %s' %(date, pathway))
    os.system('rm /home/pi/camera_%s.jpg' %date)
    time.sleep(60)

#initializing the main function
if __name__ == "__main__":
