import * as plt from '../plot';
// We need to have app by typed to a family of slides so we know it has the right variables

export function registerListeners(app:plt.Slide){
    window.addEventListener('resize', () => {
        app.figure.redrawTrigger = true;
        app.figure.onResize();
    })
    
    window.addEventListener('keydown', function(event) {
        const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        switch (key) {
            
            case "ArrowUp":
                app.currDraw -= 1;
                app.router();
                // Up pressed
                break;
            case "ArrowDown":
                app.currDraw += 1;
                app.router();
                // Down pressed
                break;
            case " ":
                app.animateBool[app.animateBool.length - 1] = !app.animateBool[app.animateBool.length - 1];

        }
    });
    
    var canvas = app.figure.canvas;
    var ctx = app.figure.context;
    
    // last known position
    var pos = { x: 0, y: 0 };
    
    document.addEventListener('mousemove', draw);
    document.addEventListener('mousedown', setPosition);
    document.addEventListener('mouseenter', setPosition);
    
    // new position from mouse event
    function setPosition(e:any) {
      pos.x = app.figure.dpr*e.clientX;
      pos.y = app.figure.dpr*e.clientY;
    }
    
    function draw(e:any) {
      // mouse left button must be pressed
      if (e.buttons !== 1) return;
    
      ctx.beginPath(); // begin
    
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'white';
    
      ctx.moveTo(pos.x, pos.y); // from
      setPosition(e);
      ctx.lineTo(pos.x, pos.y); // to
    
      ctx.stroke(); // draw it!
    }

    window.addEventListener('keydown', function(event) {
        const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        switch (key) {
            case "ArrowLeft":
                if (parseInt(window.location.pathname.slice(-3))){
                    var routeBase = window.location.pathname.slice(0,-3)
                    var page = parseInt(window.location.pathname.slice(-3))
                }else{
                    var routeBase = window.location.pathname.slice(0,-2)
                    var page = parseInt(window.location.pathname.slice(-2))
                }
                var newPage = page - 1;
                this.window.location.href = routeBase+newPage+"/"
                // Left pressed
                break;
            case "ArrowRight":
                // Right pressed
                if (parseInt(window.location.pathname.slice(-3))){
                    var routeBase = window.location.pathname.slice(0,-3)
                    var page = parseInt(window.location.pathname.slice(-3))
                }else{
                    var routeBase = window.location.pathname.slice(0,-2)
                    var page = parseInt(window.location.pathname.slice(-2))
                }
                var newPage = page + 1;
                this.window.location.href = routeBase+newPage+"/"
                break;
        }
    });
}
