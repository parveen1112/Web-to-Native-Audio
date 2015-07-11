#include "TcpClient.h"

TcpClient::TcpClient(QObject *parent) : QObject(parent)
{
    socket = new QTcpSocket(this);

}
bool TcpClient::connectToServer(QString host, QString port)
{
    socket->connectToHost(host, port.toInt());
	if (socket->waitForConnected(10000))
	{
		connect(socket, SIGNAL(readyRead()), SLOT(readyRead()));
		return true;
	}
	else
	{
		return false;
	}
    
}

TcpClient::~TcpClient()
{
	delete socket;
}

void TcpClient::readyRead()
{
    QByteArray data;

    while (socket->bytesAvailable() > 0)
        data.append(socket->readAll());
    output.writeData(data);
}
