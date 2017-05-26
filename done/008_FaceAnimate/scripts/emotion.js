var emotion = function(PV){
    this.vertices = PV;
    this.defaultVert = [];

    for(var i=0,vertice; vertice=this.vertices[i]; i++){
        this.defaultVert.push({'x':vertice.x,'y':vertice.y});
    }
    
    this.V = {
        eyeL: [],
        eyeR: [],
        mouth: []
    };

    this.Vstructure = function(index, mv, my){
        this.index = index;
        this.move = { x: mv, y: my };
    }

    this.Timer;
    this.nowType = 0;
    this.gifFrameList = [];
}

emotion.prototype  = {
    setFeature: function(self, type, range){
        //節點初始化
        self.resetVert(self);
        self.V = {
            eyeL: [],
            eyeR: [],
            mouth: []
        };

        self.nowType = type;

        //右眼
        var eyeRMoveRang = range.eyeR.w/2;
        var eyeRCenter = {
            x: range.eyeR.x+range.eyeR.w*.5,
            y: -range.eyeR.y
        };
        var eyeRedge = {
            x: range.eyeR.x,
            y: -(range.eyeR.y-range.eyeR.h*.5)
        };
        var eyebrowRCenter = {
            x: range.eyeR.x+range.eyeR.w*.5,
            y: -(range.eyeR.y-range.eyeR.h)
        };

        //左眼
        var eyeLMoveRang = range.eyeL.w/2;
        var eyeLCenter = {
            x: range.eyeL.x+range.eyeL.w*.5,
            y: -range.eyeL.y
        };
        var eyeLedge = {
            x: range.eyeL.x+range.eyeL.w,
            y: -(range.eyeL.y-range.eyeL.h*.5)
        };
        var eyebrowLCenter = {
            x: range.eyeL.x+range.eyeL.w*.5,
            y: -(range.eyeL.y-range.eyeL.h)
        };

        //嘴巴
        var mouthMoveRang = range.mouth.w/2;
        var mouthCenter = {
            x: range.mouth.x+range.mouth.w*.5,
            y: -(range.mouth.y-range.mouth.h*0.5)
        };
        var mouthRCenter = {
            x: range.mouth.x,
            y: -(range.mouth.y-range.mouth.h*0.2)
        };
        var mouthLCenter = {
            x: range.mouth.x+range.mouth.w,
            y: -(range.mouth.y-range.mouth.h*0.2)
        };


        switch(type){
            case 1: //挑眉
                for(var i=0,vertice; vertice=self.vertices[i]; i++){
                    //右眼設定
                    var distance = self.distancePoints(eyebrowRCenter, vertice);
                    if(distance < eyeRMoveRang){
                        if(self.isInEllipse(vertice, eyeRCenter, range.eyeR.w/2, range.eyeR.h/2)) self.V.eyeR.push(new self.Vstructure(i, 0, range.eyeR.h*((eyeRMoveRang-distance)/eyeRMoveRang)*.2));
                        else self.V.eyeR.push(new self.Vstructure(i, 0, range.eyeR.h*((eyeRMoveRang-distance)/eyeRMoveRang)*.5));
                    }

                    //左眼設定
                    distance = self.distancePoints(eyebrowLCenter, vertice);
                    if(distance < eyeLMoveRang){
                        if(self.isInEllipse(vertice, eyeLCenter, range.eyeL.w/2, range.eyeL.h/2)) self.V.eyeL.push(new self.Vstructure(i, 0, range.eyeL.h*((eyeLMoveRang-distance)/eyeLMoveRang)*.2));
                        else self.V.eyeL.push(new self.Vstructure(i, 0, range.eyeL.h*((eyeLMoveRang-distance)/eyeLMoveRang)*.5));
                    }

                    //嘴巴設定
                    distance = self.distancePoints(mouthLCenter, vertice);
                    if(distance < mouthMoveRang){
                        self.V.mouth.push(new self.Vstructure(i, range.mouth.w*((mouthMoveRang-distance)/mouthMoveRang)*.1, range.mouth.h*((mouthMoveRang-distance)/mouthMoveRang)*.4));
                    }
                }
                break;
            case 2: //衰臉
                for(var i=0,vertice; vertice=self.vertices[i]; i++){
                    //右眼設定
                    var distance = self.distancePoints(eyeRedge, vertice);
                    if(distance < eyeRMoveRang*2){ 
                        self.V.eyeR.push(new self.Vstructure(i, 0, -range.eyeR.h*((eyeRMoveRang*2-distance)/eyeRMoveRang)*.3));
                    }

                    //左眼設定
                    distance = self.distancePoints(eyeLedge, vertice);
                    if(distance < eyeLMoveRang*2){
                        self.V.eyeL.push(new self.Vstructure(i, 0, -range.eyeL.h*((eyeLMoveRang*2-distance)/eyeLMoveRang)*.3));
                    }

                    //嘴巴設定
                    distance = self.distancePoints(mouthLCenter, vertice);
                    if(distance < mouthMoveRang){
                        self.V.mouth.push(new self.Vstructure(i, range.mouth.w*((mouthMoveRang-distance)/mouthMoveRang)*.05, -range.mouth.h*((mouthMoveRang-distance)/mouthMoveRang)*.2));
                    }

                    distance = self.distancePoints(mouthRCenter, vertice);
                    if(distance < mouthMoveRang){
                        self.V.mouth.push(new self.Vstructure(i, -range.mouth.w*((mouthMoveRang-distance)/mouthMoveRang)*.05, -range.mouth.h*((mouthMoveRang-distance)/mouthMoveRang)*.2));
                    }
                }
                break;
            case 3: //啾
                for(var i=0,vertice; vertice=self.vertices[i]; i++){
                    //右眼設定
                    var distance = self.distancePoints(eyebrowRCenter, vertice);
                    if(distance < eyeRMoveRang){
                        self.V.eyeR.push(new self.Vstructure(i, 0, range.eyeR.h*((eyeRMoveRang-distance)/eyeRMoveRang)*.5));
                    }

                    //左眼設定
                    distance = self.distancePoints(eyebrowLCenter, vertice);
                    if(distance < eyeLMoveRang){
                        self.V.eyeL.push(new self.Vstructure(i, 0, range.eyeL.h*((eyeLMoveRang-distance)/eyeLMoveRang)*.5));
                    }

                    //嘴巴設定
                    distance = self.distancePoints(mouthLCenter, vertice);
                    if(distance < mouthMoveRang){
                        self.V.mouth.push(new self.Vstructure(i, -range.mouth.w*((mouthMoveRang-distance)/mouthMoveRang)*.1, 0));
                    }

                    distance = self.distancePoints(mouthRCenter, vertice);
                    if(distance < mouthMoveRang){
                        self.V.mouth.push(new self.Vstructure(i, range.mouth.w*((mouthMoveRang-distance)/mouthMoveRang)*.1, 0));
                    }

                    distance = self.distancePoints(mouthCenter, vertice);
                    if(distance < mouthMoveRang){
                        self.V.mouth.push(new self.Vstructure(i, (vertice.x-mouthCenter.x>0?1:-1)*range.mouth.w*((mouthMoveRang-distance)/mouthMoveRang)*.05, (vertice.y-mouthCenter.y>0?1:-1)*range.mouth.h*((mouthMoveRang-distance)/mouthMoveRang)*.05));
                    }
                }
                break;
        }
        if(self.Timer)  window.cancelAFrame(self.Timer);
        self.animateFeaturn(self, type, 0);
    },
    recordCut: function(self){
        //節點初始化
        self.resetVert(self);

        if(self.Timer)  window.cancelAFrame(self.Timer);
        self.animateFeaturn(self, self.nowType, 0, true);
    },
    moveFeature: function(self, part, detect){
        var mVers = part=='mouth' ? self.V.mouth : part=='eyeL' ? self.V.eyeL : self.V.eyeR;

        for(var i=0,mVer; mVer=mVers[i]; i++){
            self.vertices[mVer.index].x += (mVer.move.x/60) * detect;
            self.vertices[mVer.index].y += (mVer.move.y/60) * detect;
        }
    },
    animateFeaturn: function(self, type, cut, record){
        if(self.Timer)  window.cancelAFrame(self.Timer);

        switch(type){
            case 1: //挑眉
                if(cut < 30){
                    self.moveFeature(self, 'eyeR', 2);
                }else if(cut < 60){
                    self.moveFeature(self, 'mouth', 2);
                }else if(cut < 90){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', 2);
                }else if(cut < 120){
                    self.moveFeature(self, 'eyeR', 2);
                    self.moveFeature(self, 'eyeL', -2);
                }else if(cut < 150){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', 2);
                }else if(cut < 180){
                    self.moveFeature(self, 'eyeR', 2);
                    self.moveFeature(self, 'eyeL', -2);
                }else if(cut < 210){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', 2);
                }else if(cut < 240){
                    self.moveFeature(self, 'eyeR', 2);
                    self.moveFeature(self, 'eyeL', -2);
                }else if(cut < 270){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', 2);
                }else if(cut < 300){
                    self.moveFeature(self, 'mouth', -2);
                    self.moveFeature(self, 'eyeL', -2);
                }
                break;
            case 2: //衰臉
                if(cut < 60){
                    self.moveFeature(self, 'eyeR', 1);
                    self.moveFeature(self, 'eyeL', 1);
                }else if(cut < 120){
                    self.moveFeature(self, 'mouth', 1);
                }else if(cut < 150){
                    self.moveFeature(self, 'eyeR', -1);
                    self.moveFeature(self, 'eyeL', -1);
                    self.moveFeature(self, 'mouth', -1);
                }else if(cut < 180){
                    self.moveFeature(self, 'eyeR', 1);
                    self.moveFeature(self, 'eyeL', 1);
                    self.moveFeature(self, 'mouth', 1);
                }else if(cut < 210){
                    self.moveFeature(self, 'eyeR', -1);
                    self.moveFeature(self, 'eyeL', -1);
                    self.moveFeature(self, 'mouth', -1);
                }else if(cut < 240){
                    self.moveFeature(self, 'eyeR', 1);
                    self.moveFeature(self, 'eyeL', 1);
                    self.moveFeature(self, 'mouth', 1);
                }else if(cut < 270){
                    self.moveFeature(self, 'mouth', -2);
                }else if(cut < 300){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', -2);
                }
                break;
            case 3: //微笑
                if(cut < 30){
                    self.moveFeature(self, 'eyeR', 2);
                    self.moveFeature(self, 'eyeL', 2);
                }else if(cut < 60){
                    self.moveFeature(self, 'mouth', 2);
                }else if(cut < 90){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', -2);
                }else if(cut < 120){
                    self.moveFeature(self, 'eyeR', 2);
                    self.moveFeature(self, 'eyeL', 2);
                    self.moveFeature(self, 'mouth', -2);
                }else if(cut < 150){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', -2);
                    self.moveFeature(self, 'mouth', 2);
                }else if(cut < 180){
                    self.moveFeature(self, 'eyeR', 2);
                    self.moveFeature(self, 'eyeL', 2);
                    self.moveFeature(self, 'mouth', -2);
                }else if(cut < 210){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', -2);
                    self.moveFeature(self, 'mouth', 2);
                }else if(cut < 240){
                    self.moveFeature(self, 'eyeR', 2);
                    self.moveFeature(self, 'eyeL', 2);
                    self.moveFeature(self, 'mouth', -2);
                }else if(cut < 270){
                    self.moveFeature(self, 'eyeR', -2);
                    self.moveFeature(self, 'eyeL', -2);
                    self.moveFeature(self, 'mouth', 2);
                }else if(cut < 300){
                    self.moveFeature(self, 'mouth', -2);
                }
                break;
        }
        
        planeGeo.verticesNeedUpdate = true;
        renderer.render(scene, camera);

        if(record && (cut%3==0)) {
            self.addGifFrame(self);
        }

        if(++cut >= 300 && !record) cut=0;
        if(record && cut >= 300) {
            self.makeGif(self);
        } else {
            self.Timer = window.requestAFrame(function(){ self.animateFeaturn(self, type, cut, record); });
        }
    },
    addGifFrame: function(self){
        var canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(renderer.domElement, 0, 0);
        self.gifFrameList.push(ctx);
    },
    makeGif: function(self){
        console.log('makeGif');
        console.log(self.gifFrameList.length);
        for(var i=0,ctx; ctx=self.gifFrameList[i]; i++){
            console.log(i);
            gifEncoder.addFrame(ctx);
        }
        gifEncoder.finish();

        sendToSocket();
    },
    resetVert: function(self){
        for(var i=0,len=self.vertices.length; i<len; i++){
            self.vertices[i].x = self.defaultVert[i].x;
            self.vertices[i].y = self.defaultVert[i].y;
        }
    },
    distancePoints: function(P1, P2){
        var disX =  P1.x - P2.x;
        var disY =  P1.y - P2.y;
        return Math.sqrt(disX*disX + disY*disY);
    },
    isInEllipse: function(point, rCenter, rw, rh) {
        return Math.pow((point.x - rCenter.x),2)/Math.pow(rw,2) + Math.pow((point.y - rCenter.y),2)/Math.pow(rh,2) < 1;
    }
}


//各 Browsers 的 requestAnimationFrame() 處理==========================================================
window.requestAFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            // if all else fails, use setTimeout
            function (callback) {
                return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
            };
})();

//各 Browsers 的 cancelAnimationFrame() 處理==========================================================
window.cancelAFrame = (function () {
    return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            function (id) {
                window.clearTimeout(id);
            };
})();