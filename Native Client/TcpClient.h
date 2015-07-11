#ifndef TCP_CLIENT_H
#define TCP_CLIENT_H

#include <QtCore>
#include <QtNetwork>
#include "AudioOutput.h"

class TcpClient : public QObject
{
    Q_OBJECT

public:
    TcpClient(QObject *parent = 0);	
	~TcpClient();
	bool connectToServer(QString host, QString port);

public slots:
    void readyRead();

private:
    QTcpSocket *socket;
    AudioOutput output;
};

#endif
