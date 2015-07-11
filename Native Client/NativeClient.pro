TEMPLATE = app
CONFIG += console
QT += network multimedia
DESTDIR = ./bin
SOURCES += NativeClientMain.cpp\
    AudioOutput.cpp \
    TcpClient.cpp

HEADERS  += AudioOutput.h \
    TcpClient.h
