#Working code for remote monitoring purposes of products by inHouse Produce. ONLY to be used by inHouse Produce.
#Test code taken from https://www.arducam.com/multi-camera-adapter-module-raspberry-pi/ and modified to requirements

#The following code uses an ArduCam header to multiplex four cameras at 30 minute intervals and sends the received picture right to the Amazon S3 web server before deleting it on the pi itself

#import relevant modules
import RPi.GPIO as gp
import os
import time
import datetime
from picamera import PiCamera

#using camera as a variable to perform the picamera commands
camera = PiCamera()

#warnings set off
gp.setwarnings(False)
gp.setmode(gp.BOARD)

#main pin needed for any camera
gp.setup(7, gp.OUT)

#arducam pins for stacking layer 1, 2, 3 and 4
arducam_pins = {
     1: [11, 12], 2: [15, 16], 3: [21, 22], 4: [23, 24] }

#setting all the pins declared as GPIO and True
for x in range(0,len(arducam_pins)):
   pins = arducam_pins[x+1]
   for pin in pins:
        gp.setup(pin, gp.OUT)
        gp.output(pin, True)

#getting the Raspberry Pi's unique serial number
f = open('/proc/cpuinfo','r')
for line in f:
    if line[0:6]=='Serial':
        cpuserial = line[10:26]
f.close()

#declaring a global pathway for using in different sections of the code
pathway = "global"

def main():
    #using the pathway in the define structure by declaring it
    global pathway
    
    #condition to check if output file exists or not
    if (os.path.exists('/home/pi/out.txt') == False):
        #if there is no output file created, a new one is generated with recursive listings associated with the Pi's serial number
        os.system('s3cmd ls -r s3://inhouseproduce-sites | grep "%s" > out.txt' %cpuserial)
        #Opening and extrapolating data from the newly generated output files
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

    #First Camera Operation (Module1)
    gp.output(7, False); gp.output(11, False); gp.output(12, True)
    #Camera rotation currently set according to testing cameras. We can choose a definitive rotation for each camera that we can use in the long term.
    #First Camera Operation (Module1)
    gp.output(7, False); gp.output(11, False); gp.output(12, True)
    #Camera rotation currently set according to testing cameras. We can choose a definitive rotation for each camera that we can use in the long term.
    camera.rotation = 180
    #main pathway set to pathway1
    pathway = pathway1
    #function that implements the whole camera capture
    camera_process()

    #Second Camera Operation (Module2)
    gp.output(7, True); gp.output(11, False); gp.output(12, True)
    #Camera rotation currently set according to testing cameras. We can choose a definitive rotation for each camera that we can use in the long term.
    camera.rotation = 270
    #main pathway set to pathway2
    pathway = pathway2
    #function that implements the whole camera capture
    camera_process()
    
    #Third Camera Operation (Module3)
    gp.output(7, False); gp.output(11, True); gp.output(12, False)
    #Camera rotation currently set according to testing cameras. We can choose a definitive rotation for each camera that we can use in the long term.
    camera.rotation = 270
    #main pathway set to pathway3
    pathway = pathway3
    #function that implements the whole camera capture
    camera_process()

    #Fourth Camera Operation (Module4)
    gp.output(7, True); gp.output(11, True); gp.output(12, False)
    #Camera rotation currently set according to testing cameras. We can choose a definitive rotation for each camera that we can use in the long term.
    camera.rotation = 270
    #main pathway set to pathway4
    pathway = pathway4
    #function that implements the whole camera capture
    camera_process()
    
#operation of the user-defined function 'camera_process()'
def camera_process():
    camera.start_preview()
    #at least 2 seconds of sleep time required for the camera to focus
    time.sleep(3)
    #NEW date and time stamp used at every implementation
    date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
    camera.capture("/home/pi/camera_%s.jpg" %date)
    camera.stop_preview()
    #Using OS system commands to first put the image in the desired folder and then deleting the image from the Pi
    os.system('s3cmd put camera_%s.jpg %s' %(date, pathway))
    os.system('rm /home/pi/camera_%s.jpg' %date)

#initializing the main function
if __name__ == "__main__":
    
    main()
