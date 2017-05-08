
var bitmaps = ['bg', '1', '2', '3', '4', 'p1', 'p2', 'audience', 'audience2', 'dead'];
var sprites = {};
var samples = {};
var sounds = ['music','bam'];
var frame;

var points1 = 0;
var points2 = 0;

var counter = 0;

var leftpress = false;
var uppress = false;
var rightpress = false;
var downpress = false;

var title = true;

var runners = [];

var x1 = 320/2, y1 = 180/2;
var x2 = 320/2 - 20, y2 = 180/2 + 72;

function install_keys() {

                document.addEventListener('keydown', function(e) {
                    var key = e.which || e.keyCode || event.which;
                                        if (e.repeat) return;
                     //                     console.log(key);
                                          title = false;
                    if (key === 37) {
                        x1-=1;
                    }
                    if (key === 38) {
                        y1-=1;
                    }
                    if (key === 39) {
                        x1+=1;
                    }
                    if (key === 40) {
                        y1+=1;
                    }
                    
                    
                    if (key == 87) {
                        y2-=1;
                    }
                    if (key==65) {
                        x2-=1;
                    }
                    if (key==83) {
                        y2+=1;
                    }
                    if (key==68) {
                        x2+=1;
                    }

                });
                

}
     
    
            
function main()
{
	//enable_debug('debug');
	allegro_init_all("game_canvas", 320, 180);
        	canvas.mozImageSmoothingEnabled = false;
	canvas.webkitImageSmoothingEnabled = false;
	canvas.msImageSmoothingEnabled = false;
	canvas.imageSmoothingEnabled = false;
        
        //font = load_font('DejaVuSansMono.ttf');
                
        bitmaps = bitmaps.forEach(function(name) {
            sprites[name] = load_bmp(name+'.png');
        });
        sounds.forEach(function(name) {
            samples[name] = load_sample(name+'.ogg');
        });

        samples.dosowisko = load_sample('dosowisko.ogg');
        install_keys();
	ready(function(){
                                play_sample(samples.music, 1.0, 1.0, true);

		loop(function(){
                   // LOGIC
                    counter++;
                     
                     if (Math.round((Math.random()*20))%20==0) {
                         //console.log('a');
                        runners.push({ 
                            frame: 1, 
                            counter: 0, 
                            forward: true, 
                            pos: 0, 
                            speed: Math.random(), 
                            y: 180/2 + Math.random() * 180/2,
                            jumping: false,
                            jumpx: -1,
                            which: null,
                            dead: false
                        });
                     }
                     
                     runners.forEach(function(runner) {
                         if (runner.dead) return;
                         runner.counter++;
                         runner.pos += 1 + runner.speed;
                         
                         if (runner.counter>5) {
                                 if (runner.forward) {
                                    runner.frame++;
                                 } else {
                                     runner.frame--;
                                 }
                                 if (runner.frame == 4) {
                                     runner.frame = 3;
                                     runner.forward = false;
                                 }
                                if (runner.frame == 0) {
                                    runner.frame = 1;
                                    runner.forward = true;
                                }
                             runner.counter = 0;
                         }
                         
                         if ((runner.pos > x1 - 20) && (runner.pos < x1 - 15)) {
                             if ((runner.y > y1 - 20) && (runner.y < y1)) {
                
                                runner.jumping = 20;
                                runner.which = 1;
                                runner.jumpx = x1;
                            }
                         }

                        if ((runner.pos > x2 - 20) && (runner.pos < x2 - 15)) {
                             if ((runner.y > y2 - 20) && (runner.y < y2 )) {
                
                                runner.jumping = 20;
                                runner.which = 2;
                                runner.jumpx = x2;
                            }
                         }


                         if (runner.jumping==1) {
                             if (runner.which==1) {
                                 if (runner.jumpx < x1) {
                                                     play_sample(samples.bam, 1.0, 1.0, false);
                                     runner.dead = true;
                                     points1++;
                                 }
                             }
                            if (runner.which==2) {
                                 if (runner.jumpx < x2) {
                                                     play_sample(samples.bam, 1.0, 1.0, false);

                                     runner.dead = true;
                                     points2++;
                                 }
                             }
                         }
                         if (runner.jumping) {
                             runner.jumping--;
                         }
                         
                         if (runner.pos > 400) {
                             runner.dead = true;
                         }
                     });
                                          
                     
                    if (!frame) frame = requestAnimationFrame(draw);

                },BPS_TO_TIMER(60));
                
                var draw = function() {
                        frame = 0;
                        clear_to_color(canvas,makecol(255,255,255));
                       // DRAW
                        draw_sprite(canvas, sprites.bg, 320/2, 180/2);
                        
                        if (Math.round(counter/10)%2==0) {
                            draw_sprite(canvas, sprites.audience, 320/2, 180/2);
                        } else {
                            draw_sprite(canvas, sprites.audience2, 320/2, 180/2);
                        }
                        
                        runners.forEach(function(runner) {
                            if (runner.dead) {
                                if (runner.pos < 400) draw_sprite(canvas, sprites.dead, runner.pos, runner.y);
                                return;
                            }
                            if (!runner.jumping) {
                                draw_sprite(canvas, sprites[runner.frame], runner.pos, runner.y);
                            }
                        });
                        
                        draw_sprite(canvas, sprites.p1, x1, y1);
                        draw_sprite(canvas, sprites.p2, x2, y2);
                        
                        runners.forEach(function(runner) {
                            if (runner.jumping) {
                                draw_sprite(canvas, sprites[4], runner.pos, runner.y - 9);
                            }
                        });
                        
                                if (title) {
                                textout (canvas, font, "HURDLINATOR", 6, 180/2+1+10, 35, 0xFF000000)
                        	textout (canvas, font, "HURDLINATOR", 5, 180/2+10, 35, 0xFFFFFFFF)
                                } else {
                                    
                        	textout (canvas, font, points2, 41, 41, 32, 0xFF000000)
                        	textout (canvas, font, points2, 40, 40, 32, 0xFFFFFFFF)

                                textout (canvas, font, points1, 320-60+1, 41, 32, 0xFF000000)
                                textout (canvas, font, points1, 320-60, 40, 32, 0xFFFFFFFF)

                                }

                                                
                };
	});
	return 0;
}
END_OF_MAIN();

 
