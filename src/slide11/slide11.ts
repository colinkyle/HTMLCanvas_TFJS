import * as plt from '../plot';



class Intro extends plt.Slide {

    public titlePlot: plt.Plot;
    public title: plt.Text;

    public plot2: plt.Plot;
    public data: plt.Tensor2D;

    public xPlot: plt.Plot;
    public wPlot: plt.Plot;
    public x: plt.Matrix;
    public w: plt.Matrix;

    public data3d: plt.Tensor2D;
    public plot3d: plt.Plot;
    public axes3d: plt.Axes;

    public thetaX: number;
    public thetaY: number;

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
            text: "Linear transformation to 1D\n is just linear regression",
            font: "100px myFont",
        });

        this.title.assignScreenPos(this.plots['title'].center.bind(this.plots['title']));


        let plotProps2: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 1.5,
            n_columns: 1.5,
            row_id: .5,
            col_id: .5,
            // row_id_max:1.5,
            // col_id_max:1.5
        }

        this.plot2 = new plt.Plot(plotProps2);
        let primitives:Array<plt.Dot | plt.Line | plt.Ray> = [];

        this.data = plt.randomNormal([20,2]);

        const theta = Math.atan2(2,1);

        primitives.push(new plt.Line({fig:this.figure, 
            xyz1: () => [-1,-2],
            xyz2: () => [0,0],
            strokeStyle:"green",
            dashed: true
        })
        );

        primitives.push(new plt.Ray(
            {
                fig: this.figure,
                strokeStyle: 'green',
                xyz1: ()=>[0,0],
                xyz2: ()=>[1,2],
            }
        ));

        

        // primitives.push(new plt.Dot({fig:this.figure,fillstyle: plt.random_rgba(), 
        //     stroke: "gray", 
        //     xyz: () => plt.tensor2d([[1,2]]),
        //     radiusFraction: .02, animate: false })
        // );
        const dot:number = plt.tensor2d([[1,2]]).dot(plt.tensor2d([[1,2]]).transpose()).bufferSync().get(0);

        primitives.push(new plt.Line({fig:this.figure, 
            xyz1: () => [1,2],
            xyz2: () => [Math.cos(theta)*dot/Math.sqrt(5),Math.sin(theta)*dot/Math.sqrt(5)],
            dashed: true})
        );

        var colors = new Array(20).fill(0);
        for (let i = 0; i<this.data.shape[0]; i++){
            colors[i] = plt.random_rgba();
            primitives.push(new plt.Dot({fig:this.figure,fillstyle: colors[i], 
                stroke: "gray", 
                xyz: () => this.data.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );

            const dot:number = plt.tensor2d([[1,2]]).dot(this.data.slice([i],[1]).transpose()).bufferSync().get(0);

            primitives.push(new plt.Line({fig:this.figure, 
                xyz1: (() => [this.data.slice([i],[1]).bufferSync().get(0,0),this.data.slice([i],[1]).bufferSync().get(0,1)]).bind(null),
                xyz2: (() => [Math.cos(theta)*dot/Math.sqrt(5),Math.sin(theta)*dot/Math.sqrt(5)]).bind(null),
                dashed: true})
            );
            
        }

        let axesProps: plt.AxesProps = {
            plt: this.plot2,
            slide:this,
            name:'m',
            primitives: primitives,
            axisEqual: true,
            // axisCenter: true,
            axisAbsolute: true,
            ticks: true
            // margin: 0
        }


        let xPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 6,
            n_columns: 6,
            row_id: 1.5,
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
            row_id: 1.5,
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

        //////////////// 3D Plot ////////////////
        let plot3dProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 1.5,
            n_columns: 1.5,
            row_id: .5,
            col_id: 0,
            // row_id_max:1.5,
            // col_id_max:1.5
        }

        this.plot3d = new plt.Plot(plot3dProps);

        let dataTForm:plt.Tensor2D = this.data.matMul(plt.tensor2d([[1],[2]])).reshape([20,1])

        this.data3d = plt.concat([this.data,dataTForm],1) // plt.zeros([20,1])

        let primitives3d:Array<plt.Dot | plt.Line | plt.Ray> = [];
        for (let i = 0; i<this.data.shape[0]; i++){
            // const rand_rgba = plt.random_rgba();
            primitives3d.push(new plt.Dot({fig:this.figure,fillstyle: colors[i], 
                stroke: "gray", 
                xyz: () => this.data3d.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );
        }
        primitives3d.push(new plt.Line({fig:this.figure, 
            xyz1: () => [-1,-2, 0],
            xyz2: () => [0,0, 0],
            strokeStyle:"green",
            dashed: true
        })
        );

        primitives3d.push(new plt.Ray(
            {
                fig: this.figure,
                strokeStyle: 'green',
                xyz1: ()=>[0,0,0],
                xyz2: ()=>[1,2,0],
            }
        ));
        // let getThetaX = () => -Math.PI/16;
        // let getThetaY = () => Math.PI/8;
        this.thetaX = 0
        this.thetaY = 0
        let axesProps3d: plt.AxesProps = {
            plt: this.plot3d,
            slide:this,
            name:'title',
            primitives: primitives3d,
            // axisEqual: true,
            // axisCenter: true,
            // ticks: true,
            // margin: 0
            thetaX: (()=>this.thetaX).bind(this),
            thetaY: (()=>this.thetaY).bind(this),
            axisEqual: true,
            // axisCenter: true,
            axisAbsolute: true,
            ticks: true
        }

        this.axes3d = new plt.Axes(axesProps3d);
        new plt.Axes(axesProps);

        this.router();
    }

    // draw0(){
        
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         // this.axesRelu.updatePrimitives();
    //         // this.axesRelu.updateAxes();
    //         // this.axesRelu.draw();
    //     }
    //     // repeatedly call plot_func
    //     this.createAnimation(plot_func,' ');
    // }
    

    // draw1(){

    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.ray1.draw();
    //         this.ray1label.draw();
    //         this.ray2.draw();
    //         this.ray2label.draw();
    //         this.line.draw();
    //         this.line2.draw();
    //         this.theta.draw();
    //         this.formula.draw();
    //         this.formulaPart.draw();
            
    //     }
    //     // repeatedly call plot_func
    //     this.createAnimation(plot_func,' ');
    // }

    // draw2(){
    //     this.w.elements = [['1'],['2']];
    //     this.w.shape = [2,1]
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );

    //     const theta = -Math.atan2(2,1);
    //     let tFormW = plt.tensor2d(
    //         [
    //             [Math.cos(theta), Math.sin(theta)],
    //             [-Math.sin(theta), Math.cos(theta)],
    //         ]
    //     );

    //     let tFormS = plt.tensor2d(
    //         [
    //             [Math.sqrt(5)*Math.cos(theta), Math.sin(theta)],
    //             [Math.sqrt(5)*-Math.sin(theta), Math.cos(theta)],
    //         ]
    //     );

    //     let inc = 0;
    //     let step = -199;
    //     let warpStep = 0;

    //     let scale = 0;

    //     let clip = 0;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();
    //         step += inc;
    //         if (step <= -200){
    //             inc = 0;
    //             clip = 0;
    //             scale = 0;
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //             scale = 0
    //         }else if (step>1000 && step <=1500){
    //             // clip += inc
    //             scale += inc
    //         }

    //         if (step > 1600){
    //             inc = 0
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         tForm = tForm.mul((500-scale)/500).add(tFormS.mul((scale)/500));
    //         this.axes['m'].TForm = tForm;

    //         let clipFunc = function(x:plt.Tensor){
    //             x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
    //             return x
    //         }

    //         this.axes['m'].actFunc = clipFunc;

    //         this.axes['m'].updatePrimitives();
    //         // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
    //         tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].TForm = tForm;
    //         this.axes['m'].updateAxes();
    //         // Draw all points using screen coordinates.
    //         this.axes['m'].draw();

    //         // this.figure.draw(this.axes);
    //     }
    //     // repeatedly call plot_func
    //     this.createAnimation(plot_func,' ');
    // }

    // draw3(){
    //     this.w.elements = [['1'],['2']];
    //     this.w.shape = [2,1]
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );

    //     const theta = -Math.atan2(2,1);
    //     let tFormW = plt.tensor2d(
    //         [
    //             [Math.cos(theta), Math.sin(theta)],
    //             [-Math.sin(theta), Math.cos(theta)],
    //         ]
    //     );

    //     let tFormS = plt.tensor2d(
    //         [
    //             [Math.sqrt(5)*Math.cos(theta), Math.sin(theta)],
    //             [Math.sqrt(5)*-Math.sin(theta), Math.cos(theta)],
    //         ]
    //     );

    //     let inc = 2;
    //     let step = -199;
    //     let warpStep = 0;

    //     let scale = 0;

    //     let clip = 0;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();
    //         step += inc;
    //         if (step <= -200){
    //             inc = 2;
    //             clip = 0;
    //             scale = 0;
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //             scale = 0
    //         }else if (step>1000 && step <=1500){
    //             // clip += inc
    //             // scale += inc
    //         }

    //         if (step > 1600){
    //             inc = -32
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         tForm = tForm.mul((500-scale)/500).add(tFormS.mul((scale)/500));
    //         this.axes['m'].TForm = tForm;

    //         let clipFunc = function(x:plt.Tensor){
    //             x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
    //             return x
    //         }

    //         this.axes['m'].actFunc = clipFunc;

    //         this.axes['m'].updatePrimitives();
    //         // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
    //         tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].TForm = tForm;
    //         this.axes['m'].updateAxes();
    //         // Draw all points using screen coordinates.
    //         this.axes['m'].draw();

    //         // this.figure.draw(this.axes);
    //     }
    //     // repeatedly call plot_func
    //     this.createAnimation(plot_func,' ');
    // }

    // draw4(){
    //     this.w.elements = [['1'],['2']];
    //     this.w.shape = [2,1]
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );

    //     const theta = -Math.atan2(2,1);
    //     let tFormW = plt.tensor2d(
    //         [
    //             [Math.cos(theta), Math.sin(theta)],
    //             [-Math.sin(theta), Math.cos(theta)],
    //         ]
    //     );

    //     let tFormS = plt.tensor2d(
    //         [
    //             [Math.sqrt(5)*Math.cos(theta), Math.sin(theta)],
    //             [Math.sqrt(5)*-Math.sin(theta), Math.cos(theta)],
    //         ]
    //     );

    //     let inc = 2;
    //     let step = -199;
    //     let warpStep = 0;

    //     let scale = 0;

    //     let clip = 0;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();
    //         step += inc;
    //         if (step <= -200){
    //             inc = 2;
    //             clip = 0;
    //             scale = 0;
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //             scale = 0
    //         }else if (step>1000 && step <=1500){
    //             // clip += inc
    //             scale += inc
    //         }

    //         if (step > 1600){
    //             inc = -32
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         tForm = tForm.mul((500-scale)/500).add(tFormS.mul((scale)/500));
    //         this.axes['m'].TForm = tForm;

    //         let clipFunc = function(x:plt.Tensor){
    //             x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
    //             return x
    //         }

    //         this.axes['m'].actFunc = clipFunc;

    //         this.axes['m'].updatePrimitives();
    //         // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
    //         tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].TForm = tForm;
    //         this.axes['m'].updateAxes();
    //         // Draw all points using screen coordinates.
    //         this.axes['m'].draw();

    //         // this.figure.draw(this.axes);
    //     }
    //     // repeatedly call plot_func
    //     this.createAnimation(plot_func,' ');
    // }

    draw0(){
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

            ////// 3d //////////
            // let getThetaX = () => -Math.PI/16;
            // let getThetaY = () => Math.PI/8;
            this.thetaX = warpStep*(-Math.PI/16/1000)
            this.thetaY = warpStep*( Math.PI/8/1000)
            this.axes3d.updateTForm();

            this.axes3d.updatePrimitives();

            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            // tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            // this.axes3d.TForm = tForm;
            this.axes3d.updateAxes();
            // Draw all points using screen coordinates.
            this.axes3d.draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ');
    }

    draw7(){
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

            console.log(this.axes3d.dataRaw.arraySync());
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