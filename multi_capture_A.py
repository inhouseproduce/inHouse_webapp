#Working code for remote monitoring purposes of products by inHouse Produce. Not to be shared with anyone besides co-workers
#Test code taken from https://www.arducam.com/multi-camera-adapter-module-raspberry-pi/ and modified to requirements

#The following code uses an ArduCam header to multiplex four cameras at 30 minute intervals and sends the received picture right to the Amazon S3 web server before deleting it on the pi itself

#import relevant modules
import RPi.GPIO as gp
import os
import time
import datetime
from picamera import PiCamera

#using the variable 'camera' for ease
camera = PiCamera()

#setting warnings aside
gp.setwarnings(False)
gp.setmode(gp.BOARD)

#need pin 7 for any amount of headers connected to pi. One header supports 4 cameras max
gp.setup(7, gp.OUT)
#pin 11 and 12 needed for controlling first ArduCam header
gp.setup(11, gp.OUT)
gp.setup(12, gp.OUT)

#needed for second and third header 
#not necessary for this script
gp.setup(15, gp.OUT)
gp.setup(16, gp.OUT)
gp.setup(21, gp.OUT)
gp.setup(22, gp.OUT)

#set them all to true
gp.output(11, True)
gp.output(12, True)
gp.output(15, True)
gp.output(16, True)
gp.output(21, True)
gp.output(22, True)

#The main function, defined here, will loop forever
def main():
    while True:
        #operating camera A
        gp.output(7, False)
        gp.output(11, False)
        gp.output(12, True)
        camera.rotation = 180
        camera.start_preview()
        time.sleep(3)
        date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
        camera.capture("/home/pi/cameraA_%s.jpg" %date)
        camera.stop_preview()
        os.system('s3cmd put /home/pi/cameraA_%s.jpg s3://imagesofmicrogreens/camera_A_germination/cameraA_%s.jpg' %(date,date))
        os.system('rm /home/pi/cameraA_%s.jpg' %date)
        time.sleep(30)

        #operating camera B
        gp.output(7, True)
        gp.output(11, False)
        gp.output(12, True)
        camera.rotation = 270
        camera.start_preview()
        time.sleep(3)
        date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
        camera.capture("/home/pi/cameraB_%s.jpg" %date)
        camera.stop_preview()
        os.system('s3cmd put /home/pi/cameraB_%s.jpg s3://imagesofmicrogreens/camera_B_firstfloor/cameraB_%s.jpg' %(date,date))
        os.system('rm /home/pi/cameraB_%s.jpg' %date)
        time.sleep(30)

        #operating camera C
        gp.output(7, False)
        gp.output(11, True)
        gp.output(12, False)
        camera.rotation = 270
        camera.start_preview()
        time.sleep(3)
        date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
        camera.capture("/home/pi/cameraC_%s.jpg" %date)
        camera.stop_preview()
        os.system('s3cmd put /home/pi/cameraC_%s.jpg s3://imagesofmicrogreens/camera_C_secondfloor/cameraC_%s.jpg' %(date,date))
        os.system('rm /home/pi/cameraC_%s.jpg' %date)
        time.sleep(30)

        #operating camera D
        gp.output(7, True)
        gp.output(11, True)
        gp.output(12, False)
        camera.rotation = 270
        camera.start_preview()
        time.sleep(3)
        date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
        camera.capture("/home/pi/cameraD_%s.jpg" %date)
        camera.stop_preview()
        os.system('s3cmd put /home/pi/cameraD_%s.jpg s3://imagesofmicrogreens/camera_D_thirdfloor/cameraD_%s.jpg' %(date,date))
        os.system('rm /home/pi/cameraD_%s.jpg' %date)
        time.sleep(1800)

#calling main function
if __name__ == "__main__":
    main()

    #sets to camera A in the end (does not get here because of while True but left it here if we have a finite loop by any chance)
    gp.output(7, False)
    gp.output(11, False)
    gp.output(12, True)
