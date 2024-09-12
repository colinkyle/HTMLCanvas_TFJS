import * as plt from '../plot';



class Intro extends plt.Slide {

    public titlePlot: plt.Plot;
    public title: plt.Text;

    public plot: plt.Plot;
    public ray1: plt.Ray;
    public ray2: plt.Ray;

    public ray1label: plt.Text;
    public ray2label: plt.Text;

    public line: plt.Line;
    public line2: plt.Line;
    public theta: plt.Text;
    public formula: plt.Text;
    public formulaPart: plt.Text;

    public plot2: plt.Plot;
    public data: plt.Tensor2D;

    public xPlot: plt.Plot;
    public wPlot: plt.Plot;
    public x: plt.Matrix;
    public w: plt.Matrix;

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
            text: "Why is matrix multiplication linear transformation?",
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

        }

        this.plot = new plt.Plot(plotProps);

        const rayProps1:plt.RayProps = {
            fig: this.figure,
            xyz1: ()=>[0,0],
            xyz2: ()=>[1,0]
        }

        const rayProps2:plt.RayProps = {
            fig: this.figure,
            xyz1: ()=>[0,0],
            xyz2: ()=>[0.5,0.5]
        }

        this.ray1 = new plt.Ray(rayProps1);
        let screenPos:[Function,Function] = [
            ()=>[this.plot.left.bind(this.plot)(),this.plot.bottom.bind(this.plot)()],
            ()=>[this.plot.right.bind(this.plot)(),this.plot.bottom.bind(this.plot)()],
        ]
        this.ray1.assignScreenPos(screenPos)
        this.ray2 = new plt.Ray(rayProps2);
        let screenPos2:[Function,Function] = [
            ()=>[this.plot.left.bind(this.plot)(),this.plot.bottom.bind(this.plot)()],
            ()=>[this.plot.center.bind(this.plot)()[0],this.plot.center.bind(this.plot)()[1]],
        ]
        this.ray2.assignScreenPos(screenPos2)

        this.ray1label = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "b",
            font: "60px Palatino"
        });

        this.ray1label.assignScreenPos(
            ()=>[this.plot.right.bind(this.plot)()+40,this.plot.bottom.bind(this.plot)()],
        );

        this.ray2label = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "a",
            font: "60px Palatino",
        });

        this.ray2label.assignScreenPos(
            ()=>[this.plot.center.bind(this.plot)()[0]+40,this.plot.center.bind(this.plot)()[1]-40],
        );

        const lineProps:plt.LineProps = {
            fig: this.figure,
            xyz1: ()=>[0,0],
            xyz2: ()=>[0,0],
            dashed: true
        }
        this.line = new plt.Line(lineProps);
        let screenPosLine:[Function,Function] = [
            ()=>[this.plot.center.bind(this.plot)()[0],this.plot.bottom.bind(this.plot)()],
            ()=>[this.plot.center.bind(this.plot)()[0],this.plot.center.bind(this.plot)()[1]],
        ]
        this.line.assignScreenPos(screenPosLine);

        const lineProps2:plt.LineProps = {
            fig: this.figure,
            xyz1: ()=>[0,0],
            xyz2: ()=>[0,0],
            dashed: false,
            strokeStyle: 'green'
        }
        this.line2 = new plt.Line(lineProps2);
        let screenPosLine2:[Function,Function] = [
            ()=>[this.plot.left.bind(this.plot)(),this.plot.bottom.bind(this.plot)()+15],
            ()=>[this.plot.center.bind(this.plot)()[0],this.plot.bottom.bind(this.plot)()+15],
        ]
        this.line2.assignScreenPos(screenPosLine2);

        this.theta = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "θ",
            font: "50px Palatino",
        });

        this.theta.assignScreenPos(
            ()=>[this.plot.left.bind(this.plot)()+100,this.plot.bottom.bind(this.plot)()-20]
        );

        this.formulaPart = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "|a|cos(θ)",
            font: "60px Palatino",
            fillstyle: "Green"
        });

        this.formulaPart.assignScreenPos(
            ()=>[(this.plot.center.bind(this.plot)()[0]+this.plot.left.bind(this.plot)())/2,this.plot.bottom.bind(this.plot)()+70]
        );

        this.formula = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "a•b = |a||b|cos(θ)",
            font: "100px Palatino",
        });

        this.formula.assignScreenPos(
            ()=>[this.plot.center.bind(this.plot)()[0],this.plot.bottom.bind(this.plot)()+200]
        );


        let plotProps2: plt.PlotProps = {
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

        primitives.push(new plt.Dot({fig:this.figure,fillstyle: plt.random_rgba(), 
            stroke: "gray", 
            xyz: () => plt.tensor2d([[1,2]]),
            radiusFraction: .02, animate: false })
        );
        const dot:number = plt.tensor2d([[1,2]]).dot(plt.tensor2d([[1,2]]).transpose()).bufferSync().get(0);

        primitives.push(new plt.Line({fig:this.figure, 
            xyz1: () => [1,2],
            xyz2: () => [Math.cos(theta)*dot/Math.sqrt(5),Math.sin(theta)*dot/Math.sqrt(5)],
            dashed: true})
        );

        for (let i = 0; i<this.data.shape[0]; i++){
            const rand_rgba = plt.random_rgba();
            primitives.push(new plt.Dot({fig:this.figure,fillstyle: rand_rgba, 
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
        new plt.Axes(axesProps)

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
            // this.axesRelu.updatePrimitives();
            // this.axesRelu.updateAxes();
            // this.axesRelu.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ');
    }
    

    draw1(){

        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.ray1.draw();
            this.ray1label.draw();
            this.ray2.draw();
            this.ray2label.draw();
            this.line.draw();
            this.line2.draw();
            this.theta.draw();
            this.formula.draw();
            this.formulaPart.draw();
            
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ');
    }

    draw2(){
        this.w.elements = [['1'],['2']];
        this.w.shape = [2,1]
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );

        const theta = -Math.atan2(2,1);
        let tFormW = plt.tensor2d(
            [
                [Math.cos(theta), Math.sin(theta)],
                [-Math.sin(theta), Math.cos(theta)],
            ]
        );

        let tFormS = plt.tensor2d(
            [
                [Math.sqrt(5)*Math.cos(theta), Math.sin(theta)],
                [Math.sqrt(5)*-Math.sin(theta), Math.cos(theta)],
            ]
        );

        let inc = 0;
        let step = -199;
        let warpStep = 0;

        let scale = 0;

        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 0;
                clip = 0;
                scale = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                scale = 0
            }else if (step>1000 && step <=1500){
                // clip += inc
                scale += inc
            }

            if (step > 1600){
                inc = 0
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            tForm = tForm.mul((500-scale)/500).add(tFormS.mul((scale)/500));
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
        this.createAnimation(plot_func,' ');
    }

    draw3(){
        this.w.elements = [['1'],['2']];
        this.w.shape = [2,1]
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );

        const theta = -Math.atan2(2,1);
        let tFormW = plt.tensor2d(
            [
                [Math.cos(theta), Math.sin(theta)],
                [-Math.sin(theta), Math.cos(theta)],
            ]
        );

        let tFormS = plt.tensor2d(
            [
                [Math.sqrt(5)*Math.cos(theta), Math.sin(theta)],
                [Math.sqrt(5)*-Math.sin(theta), Math.cos(theta)],
            ]
        );

        let inc = 2;
        let step = -50;
        let warpStep = 0;

        let scale = 0;

        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 2;
                clip = 0;
                scale = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                scale = 0
            }else if (step>1000 && step <=1500){
                // clip += inc
                // scale += inc
            }

            if (step > 1600){
                // inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            tForm = tForm.mul((500-scale)/500).add(tFormS.mul((scale)/500));
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
        this.createAnimation(plot_func,' ');
    }

    draw4(){
        this.w.elements = [['1'],['2']];
        this.w.shape = [2,1]
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );

        const theta = -Math.atan2(2,1);
        let tFormW = plt.tensor2d(
            [
                [Math.cos(theta), Math.sin(theta)],
                [-Math.sin(theta), Math.cos(theta)],
            ]
        );

        let tFormS = plt.tensor2d(
            [
                [Math.sqrt(5)*Math.cos(theta), Math.sin(theta)],
                [Math.sqrt(5)*-Math.sin(theta), Math.cos(theta)],
            ]
        );

        let inc = 2;
        let step = 999;
        let warpStep = 999;

        let scale = 0;

        let clip = 0;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            step += inc;
            if (step <= -200){
                inc = 2;
                clip = 0;
                scale = 0;
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                scale = 0
            }else if (step>1000 && step <=1500){
                // clip += inc
                scale += inc
            }

            if (step > 1600){
                // inc = -32
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            tForm = tForm.mul((500-scale)/500).add(tFormS.mul((scale)/500));
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
        this.createAnimation(plot_func,' ');
    }

    draw5(){
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
        this.createAnimation(plot_func,' ');
    }

    // draw5(){
    //     this.w.elements = [['1','0'],['2','1']];
    //     this.w.shape = [2,2]
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );
    //     let tFormW = plt.tensor2d(
    //         [
    //             [1, 0],
    //             [2, 1],
    //         ]
    //     );
    //     let inc = 10;
    //     let step = -199;
    //     let warpStep = 0;
    //     let clip = 0;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();
    //         step += inc;
    //         if (step <= -200){
    //             inc = 10;
    //             clip = 0;
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //         }else if (step>1000 && step <=1500){
    //             clip += inc
    //         }

    //         if (step > 1600){
    //             inc = -32
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].extraTForm = tForm;

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
    //     let animationId = plt.createAnimation(plot_func);
    // }

    // draw6(){
    //     this.w.elements = [['1'],['2']];
    //     this.w.shape = [2,1]
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );
    //     let tFormW = plt.tensor2d(
    //         [
    //             [1, 0],
    //             [2, 0],
    //         ]
    //     );
    //     let inc = 5;
    //     let step = -199;
    //     let warpStep = 0;
    //     let clip = 0;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();
    //         step += inc;
    //         if (step <= -200){
    //             inc = 5;
    //             clip = 0;
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //         }else if (step>1000 && step <=1500){
    //             clip += inc
    //         }

    //         if (step > 1600){
    //             inc = -32
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].extraTForm = tForm;

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
    //     let animationId = plt.createAnimation(plot_func);
    // }

    // draw7(){
    //     // this.axes['m'].draw = () => null;
    //     this.w.elements = [['1','0','1'],['0','1','1']];
    //     this.w.shape = [2,3]

    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0,0], 
    //             [0,1,0], 
    //             [0,0,1]
    //         ]
    //     );
    //     let tFormW = plt.tensor2d(
    //         [
    //             [1, 0, 1],
    //             [0, 1, 1],
    //             [0, 0, 1]
    //         ]
    //     );

    //     let inc = 1;
    //     let step = -199;
    //     let warpStep = 0;
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
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //         }else if (step>1000 && step <=1500){
    //             clip += inc
    //         }

    //         if (step > 1600){
    //             inc = -32
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes3d.extraTForm = tForm;

    //         let clipFunc = function(x:plt.Tensor){
    //             x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
    //             return x
    //         }

    //         this.axes3d.actFunc = clipFunc;
    //         this.axes3d.updateTForm();

    //         this.axes3d.updatePrimitives();

    //         // console.log(this.axes3d.dataRaw.arraySync());
    //         // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
    //         // tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         // this.axes3d.TForm = tForm;
    //         this.axes3d.updateAxes();
    //         // Draw all points using screen coordinates.
    //         this.axes3d.draw();

    //         // this.figure.draw(this.axes);
    //     }
    //     // repeatedly call plot_func
    //     let animationId = plt.createAnimation(plot_func);
    // }

   
}

let app = new Intro();