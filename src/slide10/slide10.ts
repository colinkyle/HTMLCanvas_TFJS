import * as plt from '../plot';



class Intro extends plt.Slide {

    public titlePlot: plt.Plot;
    public title: plt.Text;

    public plot: plt.Plot;
    public data: plt.Tensor2D;

    public axes3d: plt.Axes;
    public data3d: plt.Tensor2D;

    public xPlot: plt.Plot;
    public x: plt.Matrix;

    public wPlot: plt.Plot;
    public w: plt.Matrix;

    public ray1: plt.Ray;
    public ray1loc: Array<number>;
    public ray1loc0: Array<number>;
    public ray2: plt.Ray;
    public ray2loc: Array<number>;
    public ray2loc0: Array<number>;
    public ray3: plt.Ray;
    public ray3loc: Array<number>;

    constructor(){
        super()
        // Create Plots:

        let titleProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 3,
            n_columns: 1,
            row_id: 0,
            col_id: 0,
        }

        new plt.Plot(titleProps);

        this.title = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "Basis Vectors",
            font: "100px myFont",
        });

        this.title.assignScreenPos(this.plots['title'].center.bind(this.plots['title']));

        let plotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 3,
            n_columns: 3,
            row_id: 0.5,
            col_id: 1,
            row_id_max:2,
            col_id_max:2
        }

        this.plot = new plt.Plot(plotProps);
        let primitives:Array<plt.Dot | plt.Ray> = [];

        this.data = plt.randomNormal([20,2]);

        for (let i = 0; i<this.data.shape[0]; i++){
            const rand_rgba = plt.random_rgba();
            primitives.push(new plt.Dot({fig:this.figure,fillstyle: rand_rgba, 
                stroke: "gray", 
                xyz: () => this.data.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );
        }
        this.ray1loc = [1,0]
        this.ray1loc0 = [0,0]
        this.ray1 = new plt.Ray(
            {
                fig: this.figure,
                strokeStyle: 'red',
                xyz1: (()=>this.ray1loc0).bind(this),
                xyz2: (()=>this.ray1loc).bind(this),
            }
        )
        this.ray2loc = [0,1]
        this.ray2loc0 = [0,0]
        this.ray2 = new plt.Ray(
            {
                fig: this.figure,
                strokeStyle: 'green',
                xyz1: (()=>this.ray2loc0).bind(this),
                xyz2: (()=>this.ray2loc).bind(this),
            }
        )
        this.ray3loc = [1.5,1.5,0]
        this.ray3 = new plt.Ray(
            {
                fig: this.figure,
                strokeStyle: 'blue',
                xyz1: ()=>[0,0,0],
                xyz2: (()=>this.ray3loc).bind(this),
            }
        )

        primitives.push(this.ray1)
        primitives.push(this.ray2)
        

        this.data3d = plt.concat([this.data,plt.zeros([20,1])],1)
        let primitives3d:Array<plt.Dot | plt.Ray> = [];
        for (let i = 0; i<this.data.shape[0]; i++){
            const rand_rgba = plt.random_rgba();
            primitives3d.push(new plt.Dot({fig:this.figure,fillstyle: rand_rgba, 
                stroke: "gray", 
                xyz: () => this.data3d.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );
        }

        primitives3d.push(this.ray1)
        primitives3d.push(this.ray2)
        primitives3d.push(this.ray3)


        let axesProps: plt.AxesProps = {
            plt: this.plot,
            slide:this,
            name:'m',
            primitives: primitives,
            // axisEqual: true,
            // axisCenter: true,
            axisAbsolute: true,
            ticks: true
            // margin: 0
        }

        let axesProps3d: plt.AxesProps = {
            plt: this.plot,
            slide:this,
            name:'title',
            primitives: primitives3d,
            // axisEqual: true,
            axisCenter: true,
            ticks: true
            // margin: 0
        }

        new plt.Axes(axesProps);
        this.axes3d = new plt.Axes(axesProps3d);


        let xPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 6,
            n_columns: 6,
            row_id: 2,
            col_id: 0.3,
        }

        this.xPlot = new plt.Plot(xPlotProps);

        let xProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'title',
            plt: this.xPlot,
            elements: [['x1'],['x2'],['x3']],
            shape: [3,3]
        }

        this.x = new plt.Matrix(xProps)

        let wPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 6,
            n_columns: 6,
            row_id: 2,
            col_id: 1.5,
        }

        this.wPlot = new plt.Plot(wPlotProps);

        let wProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'title',
            plt: this.wPlot,
            elements: [['1','0'],['0','1']]
        }

        this.w = new plt.Matrix(wProps)

        this.router();
    }

    draw0(){
        
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }
    
    draw1(){
        this.ray1loc[0] = 1;
        this.ray1loc[1] = 0;
        this.ray2loc[0] = 0;
        this.ray2loc[1] = 1;
        this.w.elements = [['1','0'],['0','1']];
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [1, 0],
                [0, 1],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
            }else if (step>1000 && step <=1500){
                // clip += inc
            }

            if (step > 1600){
                inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw2(){
        this.ray1loc[0] = 1;
        this.ray1loc[1] = 0;
        this.ray2loc[0] = 0;
        this.ray2loc[1] = 2;

        this.w.elements = [['1','0'],['0','2']];
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [1, 0],
                [0, 2],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        // create animation function
        let plot_func = () =>{
            // this.ray2.xyz2 = ()=>['0','2']
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
            }else if (step>1000 && step <=1500){
                // clip += inc
            }

            if (step > 1600){
                inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw3(){
        this.ray1loc[0] = -1;
        this.ray1loc[1] = 0;
        this.ray2loc[0] = 0;
        this.ray2loc[1] = 1;
        this.w.elements = [['-1','0'],['0','1']];
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [-1, 0],
                [0, 1],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
            }else if (step>1000 && step <=1500){
                // clip += inc
            }

            if (step > 1600){
                inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw4(){
        this.ray1loc[0] = Math.cos(Math.PI/4);
        this.ray1loc[1] = -Math.sin(Math.PI/4);
        this.ray2loc[0] = Math.sin(Math.PI/4);
        this.ray2loc[1] = Math.cos(Math.PI/4);

        this.w.elements = [['cos(45)','sin(45)'],['-sin(45)','cos(45)']];
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [Math.cos(Math.PI/4), Math.sin(Math.PI/4)],
                [-Math.sin(Math.PI/4), Math.cos(Math.PI/4)],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
            }else if (step>1000 && step <=1500){
                // clip += inc
            }

            if (step > 1600){
                inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw5(){
        this.ray1loc[0] = 1;
        this.ray1loc[1] = 2;
        this.ray2loc[0] = 0;
        this.ray2loc[1] = 1;

        this.w.elements = [['1','0'],['2','1']];
        this.w.shape = [2,2]
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [1, 0],
                [2, 1],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
            }else if (step>1000 && step <=1500){
                // clip += inc
            }

            if (step > 1600){
                inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw6(){
        this.ray1loc[0] = 1;
        this.ray1loc[1] = 2;
        this.ray2loc[0] = 0;
        this.ray2loc[1] = 0;
        this.ray1loc = this.ray1loc.slice(0,2)
        this.ray1loc0 = this.ray1loc0.slice(0,2)
        this.ray2loc = this.ray2loc.slice(0,2)
        this.ray2loc0 = this.ray2loc0.slice(0,2)

        this.w.elements = [['1'],['2']];
        this.w.shape = [2,1]
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [1, 0],
                [2, 0],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
            }else if (step>1000 && step <=1500){
                // clip += inc
            }

            if (step > 1600){
                inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw7(){
        this.ray1loc[0] = 1;
        this.ray1loc[1] = 0;
        this.ray1loc.push(0);
        this.ray1loc0.push(0);
        this.ray2loc[0] = 0;
        this.ray2loc[1] = 1;
        this.ray2loc.push(0);
        this.ray2loc0.push(0);

        // this.axes['m'].draw = () => null;
        this.w.elements = [['1','0','1.5'],['0','1','1.5']];
        this.w.shape = [2,3]

        let tFormI = plt.tensor2d(
            [
                [1,0,0], 
                [0,1,0], 
                [0,0,1]
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [1, 0, 1.5],
                [0, 1, 1.5],
                [0, 0, 1]
            ]
        );

        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();

            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
            }else if (step>1000 && step <=1500){
                // clip += inc
            }

            if (step > 1600){
                inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes3d.extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes3d.actFunc = [clipFunc];
            this.axes3d.updateTForm();

            this.axes3d.updatePrimitives();

            // console.log(this.axes3d.dataRaw.arraySync());
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            // tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            // this.axes3d.TForm = tForm;
            this.axes3d.updateAxes();
            // Draw all points using screen coordinates.
            this.axes3d.draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }
}

let app = new Intro();
