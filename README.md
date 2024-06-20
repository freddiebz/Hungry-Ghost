# Hungry Ghost

![Live Demo of Code](https://github.com/freddiebz/Hungry-Ghost/blob/main/Assets/demo.gif)

An computational art project inspired by Chinese culture and superstition. Viewers can come into the frame of the camera and see themselves as a jumpy, ghostlike image, inspired by the bony, hungry ghosts in Chinese ink art. As they move, they leave behind a white trail, showing their recent movement path. However, the viewers can also choose to stand still, slowly fading away into the black. Viewers that move their white trails to overlap with the falling  objects (joss paper) will cause the offerings to “burn” into the afterlife. This is depicted with a white flame that burns and fades away after the joss paper falls into the flame.

Note: Due to technical limitations, the image processing is split into 3 different frames to ease computation lags. The first frame calculates the new progressive image, the second calculates the frame difference and thresholds for the new image, and the third calculates the contours and computes intersection testing on each of them with each active Paper object and update the ghost accordingly. 


Created using p5.js and OpenCv libraries.
