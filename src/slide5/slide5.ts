import * as plt from '../plot';



class Intro extends plt.Slide {

    public titlePlot: plt.Plot;
    public title: plt.Text;

    public xPlot: plt.Plot;
    public x: plt.Matrix;

    public wPlot: plt.Plot;
    public w: plt.Matrix;

    public rPlot: plt.Plot;
    public r: plt.Matrix;

    public equal: plt.Text;

    public dotPlot: plt.Plot;
    public dot: plt.Text;

    public xdPlot: plt.Plot;
    public xd: plt.Matrix;

    public wdPlot: plt.Plot;
    public wd: plt.Matrix;

    public rdPlot: plt.Plot;
    public rd: plt.Matrix;

    public equald: plt.Text;


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
            text: "Matrix multiplication refresher",
            font: "100px myFont",
        });

        this.title.assignScreenPos(this.plots['title'].center.bind(this.plots['title']));

        let xPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'x',
            n_rows: 6,
            n_columns: 6,
            row_id: 2,
            col_id: 0.7,
        }

        this.xPlot = new plt.Plot(xPlotProps);

        let xProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'x',
            plt: this.xPlot,
            elements: [['x1'],['x2'],['x3']],
            shape: [3,3]
        }

        this.x = new plt.Matrix(xProps)

        let wPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'w',
            n_rows: 6,
            n_columns: 6,
            row_id: 2,
            col_id: 2,
        }

        this.wPlot = new plt.Plot(wPlotProps);

        let wProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'w',
            plt: this.wPlot,
            elements: [['w1','w2']],
            shape: [3,2]
        }

        this.w = new plt.Matrix(wProps)
        //
        let rPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'w',
            n_rows: 6,
            n_columns: 6,
            row_id: 2,
            col_id: 3.5,
        }

        this.rPlot = new plt.Plot(rPlotProps);

        let rProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'r',
            plt: this.rPlot,
            elements: [['x1⋅w1','x1⋅w2'],['x2⋅w1','x2⋅w2'],['x3⋅w1','x3⋅w2']],
            shape: [3,2]
        }

        this.r = new plt.Matrix(rProps)

        this.equal = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'=',
            xyz: ()=>[0,0,0],
            text: '=',
            font: "100px myFont",
        })
        this.equal.assignScreenPos(()=>[(this.wPlot.right()+this.rPlot.left())/2, this.rPlot.center()[1]]);

        let dotPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'dot',
            n_rows: 6,
            n_columns: 6,
            row_id: 1.8,
            col_id: 4.8,
        }

        this.dotPlot = new plt.Plot(dotPlotProps);

        this.dot = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'dot',
            xyz: ()=> [0,0],
            text: 'dot product\n𝚺 xᵢ·wᵢ',
            font: "90px myFont",
        })
        this.dot.assignScreenPos(this.dotPlot.center.bind(this.dotPlot));



        // /////////////////////////////////////////////
        let xdPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'xd',
            n_rows: 12,
            n_columns: 6,
            row_id: 7,
            col_id: 0.7,
        }

        this.xdPlot = new plt.Plot(xdPlotProps);

        let xdProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'xd',
            plt: this.xdPlot,
            elements: [["3","d"]],
            // shape: [3,3]
        }

        this.xd = new plt.Matrix(xdProps)

        let wdPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'wd',
            n_rows: 12,
            n_columns: 6,
            row_id: 7,
            col_id: 2,
        }

        this.wdPlot = new plt.Plot(wdPlotProps);

        let wdProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'wd',
            plt: this.wdPlot,
            elements:  [["d","2"]],
        }

        this.wd = new plt.Matrix(wdProps)
        //
        let rdPlotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'rd',
            n_rows: 12,
            n_columns: 6,
            row_id: 7,
            col_id: 3.5,
        }

        this.rdPlot = new plt.Plot(rdPlotProps);

        let rdProps: plt.MatrixProps = {
            fig: this.figure,
            slide:this,
            name:'rd',
            plt: this.rdPlot,
            elements:  [["3","2"]],
        }

        this.rd = new plt.Matrix(rdProps)

        this.equald = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'=d',
            xyz: ()=>[0,0,0],
            text: '=',
            font: "100px myFont",
        })
        this.equald.assignScreenPos(()=>[(this.wdPlot.right()+this.rdPlot.left())/2, this.rdPlot.center()[1]]);

        this.router();
    }
    router(){
        // call different draw function based on currDraw
        switch(this.currDraw){
            case 0:
                this.draw0();
                break;
            case 1:
                this.draw1();
                break;
        }
    }

    draw0(){
        
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            this.equal.draw();
            this.r.draw();
            this.dot.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ');
    }

    draw1(){
        
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.x.draw();
            this.w.draw();
            this.equal.draw();
            this.r.draw();
            this.dot.draw();

            this.xd.draw();
            this.wd.draw();
            this.equald.draw();
            this.rd.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ');
    }
    
    

   
}

let app = new Intro();
