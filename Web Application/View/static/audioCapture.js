navigator.getUserMedia  = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

$(function() {
    var server;
    $("#start").button();
    $("#stop").button();
    $("#inputDialog").dialog({
        width : 230,
        height : "auto",
        modal : true,
        autoOpen: true,
        closeOnEscape: false,
        open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
        buttons: [
            {
                text : "OK",
                type : "Submit",
                form : "inputForm",
                click : function(event) {
                    server = $("input[name=serverAddress]").val();
                    if($("#inputForm")[0].checkValidity()) {
                        $.ajax({
                            url: "/",
                            type:   'POST',
                            data: {"clientAddress" : $("input[name=clientAddress]").val()},
                            success: function(msg){
                                console.log(msg);
                                $("#inputDialog").dialog('close');
                            },
                            error: function() {
                                alert("Bad submit");
                            }
                        });
                        event.preventDefault();
                    }else console.log("invalid form");
                }
            }
        ]
    });
    var client;
    var recorder;
    var audioContext = window.AudioContext;
    var context = new audioContext();
    var bStream;
    var source = context.createBufferSource();
    $("#start").click(function() {
        client = new BinaryClient('ws://' + server + ':9001');
        client.on('open', function() {
            bStream= client.createStream();
        });
        var session = {
            audio: true,
            video: false
        };
        navigator.getUserMedia(session, function(stream){
            var audioInput = context.createMediaStreamSource(stream);
            var bufferSize = 2048;
            recorder = context.createScriptProcessor(bufferSize, 1, 1);
            recorder.onaudioprocess = onAudio;

            audioInput.connect(recorder);

            recorder.connect(context.destination);
        }, function(e){alert("Following Error Occured:" + e.name);});
        if(context)
        {
            recorder.connect(context.destination);
            return;
        }
    });

    function onAudio(e) {
        if(!bStream || !bStream.writable)
        {
            return;
        }
        var left = e.inputBuffer.getChannelData(0);
        var canvas = document.getElementById("canvas");
        drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), left );
        bStream.write(convertFloat32ToInt16(left));
    }

    function convertFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l])*0x7FFF;
        }
        return buf.buffer;
    }

    function drawBuffer( width, height, context, data ) {
        context.clearRect ( 0 , 0 , width , height );
        var step = Math.ceil( data.length / width );
        var amp = height / 2;
        for(var i=0; i < width; i++){
            var min = 1.0;
            var max = -1.0;
            for (var j=0; j<step; j++) {
                var datum = data[(i*step)+j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
        }
    }

    $("#stop").click(function() {
        recorder.disconnect();
        client.close();
    });
});