import * as plt from '../plot';



class Intro extends plt.Slide {

    public titlePlot: plt.Plot;
    public title: plt.Text;

    public data: plt.Text;

    public eqn1: plt.Text;

    public eqn2: plt.Text;

    public eqn3: plt.Text;


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
            text: "Feed Forward Network",
            font: "10% myFontBold",
        });
        
        this.title.assignScreenPos(this.plots['title'].center.bind(this.plots['title']));


        this.data = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'data',
            xyz: () => [0,0,0],
            text: "X\n(input layer)",
            font: "5% myFont",
        });
        this.data.assignScreenPos(()=>this.figure.getPosition.bind(this.figure)(13,50));

        this.eqn1 = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'eqn1',
            xyz: () => [0,0,0],
            text: "FF(X) → X'\n(hidden layer)",
            font: "5% myFont",
        });
        this.eqn1.assignScreenPos(()=>this.figure.getPosition.bind(this.figure)(37,50));

        this.eqn2 = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'eqn2',
            xyz: () => [0,0,0],
            text: "FF(X') → X''\n(output layer)",
            font: "5% myFont",
        });
        this.eqn2.assignScreenPos(()=>this.figure.getPosition.bind(this.figure)(62,50));

        this.eqn3 = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'eqn3',
            xyz: () => [0,0,0],
            text: "X'' = Ŷ",
            font: "5% myFont",
        });
        this.eqn3.assignScreenPos(()=>this.figure.getPosition.bind(this.figure)(87,50));
        
        this.router();
    }

    draw0(){
       // create animation function
       let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.title.draw();
            this.data.draw();
            this.eqn1.draw();
            this.eqn2.draw();
            this.eqn3.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide2/draw0')
    }

}

let app = new Intro();
