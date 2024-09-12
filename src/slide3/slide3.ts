import * as plt from '../plot';



class Intro extends plt.Slide {


    public titlePlot: plt.Plot;
    public title: plt.Text;

    public plotTopLeft: plt.Plot;
    public neuronImage: plt.Image;

    public plotTopRight: plt.Plot;
    public brainImage: plt.Image;

    public plotBottomCenter: plt.Plot;
    public mlpImage: plt.Image;

    public plotCenter: plt.Plot;
    public cancelImage: plt.Image;


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
            text: "How does a brain work?",
            font: "100px myFont",
        });
        this.title.assignScreenPos(this.plots['title'].center.bind(this.plots['title']));


        // neuron image
        let plotTopLeftProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'tl',
            n_rows: 2,
            n_columns: 3,
            row_id: 0.3,
            row_id_max: .3,
            col_id: 0.65,
        }
        this.plotTopLeft = new plt.Plot(plotTopLeftProps)
        const img = new Image();
        img.src = '../neurons.jpg';
        this.neuronImage = new plt.Image({
            fig: this.figure,
            slide:this,
            name:'neuron',
            plt: this.plotTopLeft,
            image: img,
            margin: .05,
        });
        img.onload = () => {
            this.neuronImage = new plt.Image({
                fig: this.figure,
                slide:this,
                name:'neuron',
                plt: this.plotTopLeft,
                image: img,
                margin: .05,
            });
            // this.router();
        };

        // Brain Img
        let plotTopRightProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'tr',
            n_rows: 2,
            n_columns: 3,
            row_id: 0.3,
            col_id: 1.65,
            row_id_max: .3,
            col_id_max: 1.35
        }
        this.plotTopRight = new plt.Plot(plotTopRightProps);
        const imgBrain = new Image();
        imgBrain.src = '../brain.png';
        this.brainImage = new plt.Image({
            fig: this.figure,
            slide:this,
            name:'brain',
            plt: this.plotTopRight,
            image: imgBrain,
            margin: .5,
        });
        imgBrain.onload = () => {
            this.brainImage = new plt.Image({
                fig: this.figure,
                slide:this,
                name:'brain',
                plt: this.plotTopRight,
                image: imgBrain,
                margin: .05,
            });
            // this.router();
        };

        // MLP image
        let plotBottomCenterProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'bc',
            n_rows: 2,
            n_columns: 6,
            row_id: 1,
            col_id: 2.1,
            col_id_max: 2.6,
            row_id_max: 1,
        }
        this.plotBottomCenter = new plt.Plot(plotBottomCenterProps);
        const img2 = new Image();
        img2.src = '../MLP.jpg';
        this.mlpImage = new plt.Image({
            fig: this.figure,
            slide:this,
            name:'mpl',
            plt: this.plotBottomCenter,
            image: img2,
            margin: .1,
        });
        img2.onload = () => {
            this.mlpImage = new plt.Image({
                fig: this.figure,
                slide:this,
                name:'mlp',
                plt: this.plotBottomCenter,
                image: img2,
                margin: .1,
            });
        }
        // cancel image
        let plotCenterProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'c',
            n_rows: 1,
            n_columns: 1,
            row_id: 0,
            col_id: 0,
        }
        this.plotCenter = new plt.Plot(plotCenterProps);
        const img3 = new Image();
        img3.src = '../cancel.png';
        this.cancelImage = new plt.Image({
            fig: this.figure,
            slide:this,
            name:'cancel',
            plt: this.plotCenter,
            image: img2,
            margin: .1,
        });
        img3.onload = () => {
            this.cancelImage = new plt.Image({
                fig: this.figure,
                slide:this,
                name:'cancel',
                plt: this.plotCenter,
                image: img3,
                margin: 0,
            });
            
        };
        
        this.router();
    }

    draw0(){
       // create animation function
       let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.neuronImage.draw();
            this.brainImage.draw();
            this.mlpImage.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw1(){
        // create animation function
        let plot_func = () =>{
             this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
             this.title.draw();
             this.neuronImage.draw();
             this.brainImage.draw();
             this.mlpImage.draw();
             this.cancelImage.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

}

let app = new Intro();
