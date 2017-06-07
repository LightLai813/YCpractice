const fs = require('fs');
const exec = require('child_process').exec;
const AudioContext = require('web-audio-api').AudioContext;
const context = new AudioContext;

let pcmdata = [];
const soundfile = 'BlameItOntheBoogieDrum-drum.mp3';

decodeSoundFile(soundfile);
function decodeSoundFile(soundfile) {
    console.log('decoding mp3 file ', soundfile, ' ..... ');
    fs.readFile(soundfile, function (err, buf) {
        if (err) throw err
        context.decodeAudioData(buf, function (audioBuffer) {
            console.log(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate, audioBuffer.duration);
            pcmdata = (audioBuffer.getChannelData(0));
            samplerate = audioBuffer.sampleRate; // store sample rate

            maxvals = [];
            max = 0;
            playsound(soundfile);
            findPeaks(pcmdata, samplerate)
        }, function (err) { 
            throw err;
        });
    })
}

function findPeaks(pcmdata, samplerate) {
    // console.log('pcmdata = ', pcmdata);
    // console.log('samplerate = ', samplerate);
    var interval = (1/30) * 1000;
    index = 0;
    var step = Math.round(samplerate * (interval / 1000));
    var max = 0;
    var prevmax = 0;
    var prevdiffthreshold = 0.3;

    var timeStamp = 0;
    var dotArray = [];

    //loop through song in time with sample rate
    var samplesound = setInterval(function () {
        
        if(index >= pcmdata.length) {
            clearInterval(samplesound);
            console.log("finished sampling sound")
            console.log(dotArray.join(','));
            return;
        }

        var dot = false;
        timeStamp++;
        for (var i = index; i < index + step; i++) {
            max = pcmdata[i] > max ? pcmdata[i].toFixed(1) : max;
        }

        // Spot a significant increase? Potential peak

        var time = [];
        time[0] = timeStamp%30;
        var second = Math.floor(timeStamp/30);
        time[1] = second%60;
        time[2] = Math.floor(second/60);

        bars = getbars(max);

        if (max - prevmax >= prevdiffthreshold) {
            bars = bars + " == peak == ";
            dot = true;
        }

        // Print out mini equalizer on commandline
        if(max > 0.4){
            console.log(time[2]+':'+time[1]+'.'+time[0],' ',bars, max);
            // dotArray[dotArray.length] = '{time: '+Math.round((timeStamp-167)*1.005)+', strong: '+max+'}';
            dotArray[dotArray.length] = '{time: '+timeStamp+', strong: '+max+'}';
        }
        
        prevmax = max; 
        max = 0; 
        index += step;
    }, interval, pcmdata);
}


function getbars(val) {
    bars = '';
    for (var i = 0; i < val * 50 + 2; i++) {
        bars = bars + "|";
    }
    return bars;
}

function playsound(soundfile) {
    // linux or raspi
    // var create_audio = exec('aplay'+soundfile, {maxBuffer: 1024 * 500}, function (error, stdout, stderr) {
    var create_audio = exec('ffplay -autoexit ' + soundfile, { maxBuffer: 1024 * 500 }, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        } else {
            //console.log(" finshed ");
            //micInstance.resume();
        }
    });
}
