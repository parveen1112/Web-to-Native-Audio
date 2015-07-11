#include "TcpClient.h"
#include <QtCore>
#include <iostream>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    QString executablePath = QCoreApplication::applicationDirPath();
    QDir::setCurrent(executablePath);
	QString server, port;
    QFile* file = new QFile("configure.xml");
    if (!file->open(QIODevice::ReadOnly | QIODevice::Text))
    {
        qDebug() << "NativeClient: Couldn't open configure.xml\n";
		getchar();
        return 0;
    }
    QXmlStreamReader xml(file);
    while (!xml.atEnd() && !xml.hasError())
    {
        QXmlStreamReader::TokenType token = xml.readNext();
        
        if (token == QXmlStreamReader::StartElement)
        {
            if (xml.name() == "port")
            {
                xml.readNext();
                if (xml.tokenType() == QXmlStreamReader::Characters)
                {
                    port = xml.text().toString();
                }
                else
                {
                    qDebug() << "NativeClient: No port specified for listening" << endl;
					getchar();
                    return 0;
                }
                
            }
			if (xml.name() == "server")
            {
                xml.readNext();
                if (xml.tokenType() == QXmlStreamReader::Characters)
                {
                    server = xml.text().toString();
                }
                else
                {
                    qDebug() << "NativeClient: No Server specified for listening" << endl;
					getchar();
                    return 0;
                }
                
            }
		}
    }
    if (xml.hasError())
    {
        qDebug() << "NativeClient: Xml file error - " + xml.errorString()
            + "\n";
		getchar();
        return 0;
    }
	if (server.compare("") == 0 || port.compare("") == 0)
	{
		qDebug() << "Please provide server address and port properly";
		getchar();
	}
    TcpClient* client = new TcpClient();
	if (!client->connectToServer(server, port))
	{
		qDebug("No Server Running Try Again Later");
		getchar();
	}
	else
	{
		qDebug("Connected to Server");
	}
    return a.exec();
}
