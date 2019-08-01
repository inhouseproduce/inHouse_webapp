#Working code for remote monitoring purposes of products by inHouse Produce. Not to be shared with anyone besides co-workers
#Test code taken from https://www.arducam.com/multi-camera-adapter-module-raspberry-pi/ and modified to requirements

#The following code uses an ArduCam header to multiplex four cameras at 30 minute intervals and sends the received picture right to the Amazon S3 web server before deleting it on the pi itself

#import relevant modules
import RPi.GPIO as gp
import os
import time
import datetime
from picamera import PiCamera

camera = PiCamera()

gp.setwarnings(False)
gp.setmode(gp.BOARD)

#Pin 7 needed for all 4 stacks
gp.setup(7, gp.OUT)

#let arducam_pins = {
  #     1: [11, 12],
  #     2: [15, 16],
  #     3: [21, 22] }

#for x in range(modules):
 #   pins = stack_pins[x+1]
 #   for pin in pins:
#        gp.setup(pin, gp.OUT)
#        gp.setup(pin, True)


#Pin 11 and 12 needed for stack 1 only
gp.setup(11, gp.OUT)
gp.setup(12, gp.OUT)

#need this for stack 2
gp.setup(15, gp.OUT)
gp.setup(16, gp.OUT)
#need this for stack 3
gp.setup(21, gp.OUT)
gp.setup(22, gp.OUT)

#Turning all true
gp.output(11, True)
gp.output(12, True)
gp.output(15, True)
gp.output(16, True)
gp.output(21, True)
gp.output(22, True)

def main():
    #grabbing just the serial number
    f = open('/proc/cpuinfo','r')
    for line in f:
      if line[0:6]=='Serial':
        cpuserial = line[10:26]
    f.close()

    os.system('s3cmd ls -r s3://inhouseproduce-sites | grep "%s/Stack1/" > out.txt' %cpuserial)

    f = open('/home/pi/out.txt','r')
    line = f.readlines()
    char1 = len(line[1])
    pathway1 = line[1][29:char1]
    char2 = len(line[2])
    pathway2 = line[2][29:char2]
    char3 = len(line[3])
    pathway3 = line[3][29:char3]
    char4 = len(line[4])
    pathway4 = line[4][29:char4]
    f.close()
    
    while True:
        gp.output(7, False)
        gp.output(11, False)
        gp.output(12, True)
        camera.rotation = 180
        camera.start_preview()
        time.sleep(3)
        date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
        camera.capture("/home/pi/camera1_%s.jpg" %date)
        camera.stop_preview()
        os.system('s3cmd put camera1_%s.jpg %s' %(date, pathway1))
        os.system('rm /home/pi/camera1_%s.jpg' %date)
        time.sleep(30)

        gp.output(7, True)
        gp.output(11, False)
        gp.output(12, True)
        camera.rotation = 270
        camera.start_preview()
        time.sleep(3)
        date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
        camera.capture("/home/pi/camera2_%s.jpg" %date)
        camera.stop_preview() 
        os.system('s3cmd put camera2_%s.jpg %s' %(date, pathway2))
        os.system('rm /home/pi/camera2_%s.jpg' %date)
        time.sleep(30)

        gp.output(7, False)
        gp.output(11, True)
        gp.output(12, False)
        camera.rotation = 270
        camera.start_preview()
        time.sleep(3)
        date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
        camera.capture("/home/pi/camera3_%s.jpg" %date)
        camera.stop_preview()
        pathway = ""
        os.system('s3cmd put camera3_%s.jpg %s' %(date, pathway3))
        os.system('rm /home/pi/camera3_%s.jpg' %date)
        time.sleep(30)

        gp.output(7, True)
        gp.output(11, True)
        gp.output(12, False)
        camera.rotation = 270
        camera.start_preview()
        time.sleep(3)
        date = datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
        camera.capture("/home/pi/camera4_%s.jpg" %date)
        camera.stop_preview()
        os.system('s3cmd put camera4_%s.jpg %s' %(date, pathway4))
        os.system('rm /home/pi/camera4_%s.jpg' %date)
        time.sleep(1800)

if __name__ == "__main__":
    
    main()

