import * as plt from '../plot';



class Intro extends plt.Slide {

    public titlePlot: plt.Plot;
    public title: plt.Text;

    public subtitlePlot: plt.Plot;
    public subtitle: plt.Text;

    public plot: plt.Plot;

    public data: plt.Tensor2D;

    public axes3d: plt.Axes;
    public data3d: plt.Tensor2D;

    public axesRelu: plt.Axes;

    public xPlot: plt.Plot;
    public x: plt.Matrix;

    public wPlot: plt.Plot;
    public w: plt.Matrix;

    public bPlot: plt.Plot;
    public b: plt.Matrix;

    public plusText: plt.Text;
    public plusPlot: plt.Plot;


    constructor(){
        super()
        // Create Plots:

        let titleProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 8,
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
            text: " ",
            font: "5% myFont",
        });

        this.title.assignScreenPos(this.plots['title'].center.bind(this.plots['title']));

        let subtitleProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'subtitle',
            n_rows: 12,
            n_columns: 1,
            row_id: 11,
            col_id: 0,
        }

        this.subtitlePlot = new plt.Plot(subtitleProps);

        this.subtitle = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'subtitle',
            xyz: () => [0,0,0],
            text: " ",
            font: "3% myFont",
        });

        this.subtitle.assignScreenPos(this.subtitlePlot.center.bind(this.subtitlePlot));

        let plotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 1,
            n_columns: 1,
            row_id: 0,
            col_id: 0,
        }

        this.plot = new plt.Plot(plotProps);
        let primitives:Array<plt.Dot> = [];
        

        this.data = plt.randomNormal([20, 2], 0, 1, 'float32', 1234);
        let grids = plt.genGrid(this.data,this.figure)

        var colors = [];
        for (let i = 0; i<this.data.shape[0]; i++){
            const rand_rgba = plt.random_rgba();
            colors.push(rand_rgba);
            primitives.push(new plt.Dot({fig:this.figure,fillstyle: colors[i], 
                stroke: "gray", 
                xyz: () => this.data.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );
        }

        this.data3d = plt.concat([this.data,plt.zeros([20,1])],1)
        let primitives3d:Array<plt.Dot> = [];
        for (let i = 0; i<this.data.shape[0]; i++){
            const rand_rgba = plt.random_rgba();
            primitives3d.push(new plt.Dot({fig:this.figure,fillstyle: colors[i], 
                stroke: "gray", 
                xyz: () => this.data3d.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );
        }


        let axesProps: plt.AxesProps = {
            plt: this.plot,
            slide:this,
            name:'m',
            primitives: primitives,
            grids:grids,
            axisEqual: true,
            // axisCenter: true,
            // axisCenter: true,
            axisAbsolute: true,
            ticks: true
            // margin: 0
        }
        new plt.Axes(axesProps);

        let grids3d = plt.genGrid(this.data3d,this.figure)

        let axesProps3d: plt.AxesProps = {
            plt: this.plot,
            slide:this,
            name:'title',
            primitives: primitives3d,
            grids:grids3d,
            axisEqual: true,
            axisCenter: true,
            ticks: true,
            // margin: 0
        }

        let linesPrimitives = [];
        linesPrimitives.push(new plt.Line({
            fig: this.figure,
            xyz1: ()=>[-1,0],
            xyz2: ()=>[0,0]
        }))
        linesPrimitives.push(new plt.Line({
            fig: this.figure,
            xyz1: ()=>[0,0],
            xyz2: ()=>[1,1]
        }))

        let axesPropsRelu: plt.AxesProps = {
            plt: this.plot,
            slide:this,
            name:'title',
            primitives: linesPrimitives,
            axisEqual: true,
            axisCenter: true,
            ticks: true
            // margin: 0
        }

        this.axes3d = new plt.Axes(axesProps3d);
        this.axesRelu = new plt.Axes(axesPropsRelu);


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

        let bPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 6,
            n_columns: 12,
            row_id: 2,
            col_id: 6,
        }

        this.bPlot = new plt.Plot(bPlotProps);

        let bProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'title',
            plt: this.bPlot,
            elements: [['b']]
        }

        this.b = new plt.Matrix(bProps)

        let plusPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 6,
            n_columns: 12,
            row_id: 2,
            col_id: 5,
        }

        this.plusPlot = new plt.Plot(plusPlotProps);

        let plusTextProps:plt.TextProps = {
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () =>[0,0],
            text: '+',
        }

        this.plusText = new plt.Text(plusTextProps);

        console.log(this.plusPlot.center.bind(this.plusPlot)())
        this.plusText.assignScreenPos(()=>[this.plusPlot.center.bind(this.plusPlot)()[0],this.plusPlot.center.bind(this.plusPlot)()[1]])

        this.router();
    }

    draw0(){
        this.title.text = "Scaling"
        this.w.elements = [['cos(45)','sin(45)'],['-sin(45)','cos(45)']];
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [2, 0],
                [0, 4],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        let bias = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.subtitle.draw();
            // this.x.draw();
            // this.w.draw();
            // this.plusText.draw();
            // this.b.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
                // biasWeight = -1*biasWeight
            }
            if (step <= 0){
                clip = 0;
                bias = 0;
                warpStep = 0;
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                this.subtitle.text = 'weights - linear transformation'
                clip = 0;
                bias = 0;
            }else if (step>1000 && step <=1500) {
                clip = 0;
                bias = biasWeight*(step-1000)/1500
                this.subtitle.text = 'bias - translation'
            }else if (step>1500 && step <=2000){
                clip += inc
                this.subtitle.text = 'activation function - clipping'
            }

            if (step > 2100){
                inc = -32
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min(2*(-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].bias[0].dispose();
            this.axes['m'].bias = [plt.tensor2d([[bias,bias]])];
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide15/draw0');
    }
    draw1(){
        this.title.text = "Rotation"
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
        let bias = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.subtitle.draw();
            // this.x.draw();
            // this.w.draw();
            // this.plusText.draw();
            // this.b.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
            }
            if (step <= 0){
                clip = 0;
                bias = 0;
                warpStep = 0;
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                this.subtitle.text = 'weights - linear transformation'
                clip = 0;
                bias = 0;
            }else if (step>1000 && step <=1500) {
                clip = 0;
                bias = biasWeight*(step-1000)/1500
                this.subtitle.text = 'bias - translation'
            }else if (step>1500 && step <=2000){
                clip += inc
                this.subtitle.text = 'activation function - clipping'
            }

            if (step > 2100){
                inc = -32
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min(2*(-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].bias[0].dispose();
            this.axes['m'].bias = [plt.tensor2d([[-bias,-bias]])];
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide15/draw1');
    }
    draw2(){
        this.title.text = "Flipping"
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
        let bias = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.subtitle.draw();
            // this.x.draw();
            // this.w.draw();
            // this.plusText.draw();
            // this.b.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
                // biasWeight = -1*biasWeight
            }
            if (step <= 0){
                clip = 0;
                bias = 0;
                warpStep = 0;
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                this.subtitle.text = 'weights - linear transformation'
                clip = 0;
                bias = 0;
            }else if (step>1000 && step <=1500) {
                clip = 0;
                bias = biasWeight*(step-1000)/1500
                this.subtitle.text = 'bias - translation'
            }else if (step>1500 && step <=2000){
                clip += inc
                this.subtitle.text = 'activation function - clipping'
            }

            if (step > 2100){
                inc = -32
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min(2*(-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].bias[0].dispose();
            this.axes['m'].bias = [plt.tensor2d([[-bias,bias]])];
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide15/draw2');
    }
    draw3(){
        this.title.text = "Shear"
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
        let bias = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.subtitle.draw();
            // this.x.draw();
            // this.w.draw();
            // this.plusText.draw();
            // this.b.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
            }
            if (step <= 0){
                clip = 0;
                bias = 0;
                warpStep = 0;
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                this.subtitle.text = 'weights - linear transformation'
                clip = 0;
                bias = 0;
            }else if (step>1000 && step <=1500) {
                clip = 0;
                bias = biasWeight*(step-1000)/1500
                this.subtitle.text = 'bias - translation'
            }else if (step>1500 && step <=2000){
                clip += inc
                this.subtitle.text = 'activation function - clipping'
            }

            if (step > 2100){
                inc = -32
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min(2*(-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].bias[0].dispose();
            this.axes['m'].bias = [plt.tensor2d([[bias,-bias]])];
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide15/draw3');
    }
    draw4(){
        this.title.text = "Reduce Dimensions"
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
        let bias = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.subtitle.draw();
            // this.x.draw();
            // this.w.draw();
            // this.plusText.draw();
            // this.b.draw();
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
                // biasWeight = -1*biasWeight
            }
            if (step <= 0){
                clip = 0;
                bias = 0;
                warpStep = 0;
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                this.subtitle.text = 'weights - linear transformation'
                clip = 0;
                bias = 0;
            }else if (step>1000 && step <=1500) {
                clip = 0;
                bias = biasWeight*(step-1000)/1500
                this.subtitle.text = 'bias - translation'
            }else if (step>1500 && step <=2000){
                clip += inc
                this.subtitle.text = 'activation function - clipping'
            }

            if (step > 2100){
                inc = -32
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min(2*(-500+clip)/75,0), 10000);
                return x
            }

            this.axes['m'].actFunc = [clipFunc];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tForm;
            this.axes['m'].bias[0].dispose();
            this.axes['m'].bias = [plt.tensor2d([[bias,0]])];
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide15/draw4');
    }

    draw5(){
        this.title.text = "Increase Dimensions"
        
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
                [2, 1, -2],
                [1, 2, 2],
                [0, 0, 1]
            ]
        );

        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let clip = 0;
        let bias = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.subtitle.draw();
            // this.x.draw();
            // this.w.draw();

            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
                // biasWeight = -1*biasWeight
            }
            if (step <= 0){
                clip = 0;
                bias = 0;
                warpStep = 0;
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                this.subtitle.text = 'weights - linear transformation'
                clip = 0;
                bias = 0;
            }else if (step>1000 && step <=1500) {
                clip = 0;
                bias = biasWeight*(step-1000)/1500
                this.subtitle.text = 'bias - translation'
            }else if (step>1500 && step <=2000){
                clip += inc
                this.subtitle.text = 'activation function - clipping'
            }

            if (step > 2100){
                inc = -32
                this.subtitle.text = ' '
                // biasWeight = -1*biasWeight
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes3d.extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min(2*(-500+clip)/75,0), 10000);
                return x
            }

            this.axes3d.actFunc = [clipFunc];
            this.axes3d.updateTForm();

            this.axes3d.updatePrimitives();

            console.log(this.axes3d.dataRaw.arraySync());
            this.axes3d.bias = [plt.tensor2d([[bias,-bias,bias]])];
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            // tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            // this.axes3d.TForm = tForm;
            this.axes3d.updateAxes();
            // Draw all points using screen coordinates.
            this.axes3d.draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide15/draw5')
    }

}

let app = new Intro();
