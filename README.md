Web to Native Audio :

Features:
1.It currently transfers audio from Web to Native Client only.

Requirements:
1.It requires Node.js 0.10.x
2. Web Application is already packaged with node_modules. One can use these modules or install the node modules using package.json in Web Application.
3. Native Client is build using Qt, C++. Qt version 4.7.4. It is a Qt Application and build it accordingly. (You can find it on internet)
4. Executable will be created in bin folder and it requires configure.xml file which exists in the bin folder as well.


How to use:
I have created all the required servers in one file Server.js in Web Application.

1. After installing the node.js and node modules. Type
    node Server.js
    This will start the servers.

2. Web Application
    One can access the web client by typing following command in the browser:
        <server>:3000

3. Native Client:
    Start the Executable after building the Native Application.

4. Web Client is prompted with Server and Client IP Address. Server - Server IP Address. Client - Native Client IP Address

5. Native Client consists configure.xml file in its bin folder. It requires Server IP Address.

Then start speaking on the web client and listen on the Native Client. :)

If you are still not able to run it. Then mail me
    Parveen Arora - parveen1112@gmail.com