import * as plt from '../plot';



class Intro extends plt.Slide {

    public titlePlot: plt.Plot;
    public title: plt.Text;

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
            text: "That's a wrap ",
            font: "90px myFont",
        });

        this.title.assignScreenPos(this.plots['title'].center.bind(this.plots['title']));



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
        this.title.text = "That's a wrap \n Please let me know if you have any questions in comments "
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw2(){
        this.title.text = "That's a wrap \n Please let me know if you have any questions in comments \n Like/Subscribe/Share "
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw3(){
        this.title.text = "That's a wrap \n Please let me know if you have any questions in comments \n Like/Subscribe/Share \n Next time: output layers, their activation functions, and loss functions "
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw4(){
        this.title.text = "That's a wrap \n Please let me know if you have any questions in comments \n Like/Subscribe/Share \n Next time: output layers, their activation functions, and loss functions \n After that: backprop"
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    

   
}

let app = new Intro();
