#######################################################################################################################
# RaspberryPi Remote Camera Monitoring
# Test code taken from https://www.arducam.com/multi-camera-adapter-module-raspberry-pi/ and modified to requirements
# 
# Written by inHouse Produce. ONLY to be used by inHouse Produce.
#######################################################################################################################
# The following code uses an ArduCam header to multiplex four cameras at 30 minute intervals and sends 
# the received picture right to the Amazon S3 web server before deleting it on the pi itself
#######################################################################################################################
import RPi.GPIO as gp
import os
import time
import datetime
from picamera import PiCamera

pathways = {}

######################################################
# setPins
# initialize power and data pins for each camera
######################################################
def setPins():
    gp.setup(7, gp.OUT) #Pin 7 needed for all cameras

    setup_pins = { #Listed pins according to arducam adapter number
        1: [11, 12], 2: [15, 16], 3: [21, 22], 4: [23, 24]
    }
    for camera, pins in setup_pins.items():
        for pin in pins:
            gp.setup(pin, gp.OUT)
            gp.output(pin, True)


######################################################
# getSerial
# extract serial number of the Raspberry Pi
######################################################
def getSerial():
    serialfile = open('/proc/cpuinfo','r')
    for line in serialfile:
        if line[0:6]=='Serial':
            cpu_serial = line[10:26]
            serialfile.close()

            return cpu_serial

    serialfile.close()

    return False


######################################################
# getPathways
# extract pathway name from s3
######################################################
def getPathways():
   global pathways
   f = open('/home/pi/out.txt','r')
   lines = f.readlines()
   for line in lines:
       #following lines get the desired listing and strip the unnecessary string from the pathway
       if (line.find('Module1') >= 0):
           pathways[1] = line[29:] #29th character onwards gives the correct pathway
       elif (line.find('Module2') >= 0):
           pathways[2] = line[29:]
       elif (line.find('Module3') >= 0):
           pathways[3] = line[29:]
       elif (line.find('Module4') >= 0):
           pathways[4] = line[29:]


######################################################
# cameraProcess
# take a photo for a given camera and push it to s3
######################################################
def cameraProcess(pathway):
    camera = PiCamera()
    camera.rotation = 270
    camera.start_preview()
    time.sleep(3) # >2 seconds of sleep time required for the camera to focus
    date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
    camera.capture("/home/pi/camera_%s.jpg" %date)
    camera.stop_preview()
    os.system('s3cmd put /home/pi/camera_%s.jpg %s' %(date, pathway)) #push image to s3
    os.system('rm /home/pi/camera_%s.jpg' %date) #delete image locally


######################################################
# main
# initialize camera and send pictures from each
# source to s3 on regular intervals
######################################################
def main():
    gp.setwarnings(False) #set warnings OFF
    gp.setmode(gp.BOARD)

    setPins()

    if (os.path.exists('/home/pi/out.txt') == False):
        # if there is no output file created, a new one is generated with recursive listings 
        # associated with the Pi's serial number
        os.system('s3cmd ls -r s3://inhouseproduce-sites | grep "%s" > /home/pi/out.txt' %cpu_serial)
    cpu_serial = getSerial()
    if cpu_serial:   
        getPathways()
    else:
        raise Exception('no cpu_serial found')
        
    capture_pins = {
        1: {7: False, 11: False, 12: True},
        2: {7: True, 11: False, 12: True},
        3: {7: False, 11: True, 12: False},
        4: {7: True, 11: True, 12 False}
    }

    while True:
        for camera, pins in capture_pins.items():
            for pin, value in pins.items():
                gp.output(pin, value)
            cameraProcess(pathways[camera])
            time.sleep(60)
        time.sleep(1740)


if __name__ == "__main__":