import * as plt from '../plot';



class Intro extends plt.Slide {
    
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

        new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "The basic concept of Machine Learning",
            font: "100px myFont",
        });
        
        this.texts['title'].assignScreenPos(this.plots['title'].center.bind(this.plots['title']));

        // neuron image
        let plotTopLeftProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'tl',
            n_rows: 3,
            n_columns: 3,
            row_id: 1,
            col_id: 0,
        }
        new plt.Plot(plotTopLeftProps)
        const img = new Image();
        img.src = '../radio.png';
        new plt.Image({
            fig: this.figure,
            slide:this,
            name:'neuron',
            plt: this.plots['tl'],
            image: img,
            margin: .05,
        });
        img.onload = () => {
            new plt.Image({
                fig: this.figure,
                slide:this,
                name:'neuron',
                plt: this.plots['tl'],
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
            n_rows: 3,
            n_columns: 3,
            row_id: 1,
            col_id: 1
        }
        new plt.Plot(plotTopRightProps);
        const imgBrain = new Image();
        imgBrain.src = '../stereo.png';
        new plt.Image({
            fig: this.figure,
            slide:this,
            name:'brain',
            plt: this.plots['tr'],
            image: imgBrain,
            margin: .5,
        });
        imgBrain.onload = () => {
            new plt.Image({
                fig: this.figure,
                slide:this,
                name:'brain',
                plt: this.plots['tr'],
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
            n_rows: 3,
            n_columns: 3,
            row_id: 1,
            col_id: 2,
        }
        new plt.Plot(plotBottomCenterProps);
        const img2 = new Image();
        img2.src = '../ear.png';
        new plt.Image({
            fig: this.figure,
            slide:this,
            name:'ear',
            plt: this.plots['bc'],
            image: img2,
            margin: .1,
        });
        img2.onload = () => {
            new plt.Image({
                fig: this.figure,
                slide:this,
                name:'title',
                plt: this.plots['bc'],
                image: img2,
                margin: .1,
            });
            // this.router();
        };

        

        this.router();
    }

    draw0(){
       // create animation function
       let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.texts['title'].draw();
            this.images['neuron'].draw();
            this.images['brain'].draw();
            this.images['ear'].draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide1/draw0')
    }

}

let app = new Intro();
