#include "audiooutput.h"

AudioOutput::AudioOutput(QObject *parent) : QObject(parent)
{
    QAudioFormat format;
    format.setChannelCount(1);
    format.setSampleRate(44100);
    format.setSampleSize(16);
    format.setCodec("audio/pcm");
    format.setByteOrder(QAudioFormat::LittleEndian);
    format.setSampleType(QAudioFormat::UnSignedInt);

    audio = new QAudioOutput(format, this);
    audio->setBufferSize(8192);

    device = audio->start();
}

AudioOutput::~AudioOutput()
{
	delete audio;
}

void AudioOutput::writeData(QByteArray data)
{
    device->write(data.data(), data.size());
}
