import * as plt from '../plot';



class Intro extends plt.Slide {

    public plotTopLeft: plt.Plot;
    public neuronImage: plt.Image;

    public plotTopCenter: plt.Plot;
    public topRay: plt.Ray;

    public plotTopRight: plt.Plot;
    public topEqn: plt.Text;

    public plotBottomLeft: plt.Plot;
    public mlpImage: plt.Image;

    public plotBottomCenter: plt.Plot;
    public bottomRay: plt.Ray;

    public plotBottomRight: plt.Plot;
    public bottomEqn: plt.Text;


    constructor(){
        super()
        // Create Plots:

        // neuron image
        let plotTopLeftProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 2,
            n_columns: 3,
            row_id: 0,
            col_id: 0,
        }
        this.plotTopLeft = new plt.Plot(plotTopLeftProps)
        const img = new Image();
        img.src = '../neurons.jpg';
        this.neuronImage = new plt.Image({
            fig: this.figure,
            slide:this,
            name:'title',
            plt: this.plotTopLeft,
            image: img,
            margin: .05,
        });
        img.onload = () => {
            this.neuronImage = new plt.Image({
                fig: this.figure,
                slide:this,
            name:'title',
                plt: this.plotTopLeft,
                image: img,
                margin: .05,
            });
            // this.router();
        };

        // top arrow
        let plotTopCenterProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 2,
            n_columns: 6,
            row_id: 0,
            col_id: 2.2,
            row_id_max:0,
            col_id_max:2.5
        }
        this.plotTopCenter = new plt.Plot(plotTopCenterProps);
        this.topRay = new plt.Ray({
            fig:this.figure,
            xyz1:()=>[0,0],
            xyz2:()=>[0,1]
        });
        const screen1 = ()=>[
            this.plotTopCenter.left(),
            (this.plotTopCenter.top() + this.plotTopCenter.bottom())/2
        ];
        const screen2 = ()=>[
            this.plotTopCenter.right(),
            (this.plotTopCenter.top() + this.plotTopCenter.bottom())/2
        ];
        this.topRay.assignScreenPos([screen1,screen2]);

        // Top Eqn
        let plotTopRightProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 2,
            n_columns: 6,
            row_id: 0,
            col_id: 1,
            row_id_max: 0,
            col_id_max: 7
        }
        this.plotTopRight = new plt.Plot(plotTopRightProps);
        this.topEqn = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "aˡ⁺¹ = 𝑓([𝚺 wᵢ·aˡᵢ] + b)",
            font: "100px myFont",
        });
        const screenPosEqn = ()=>[
            (this.plotTopRight.left()+this.plotTopRight.right())/2, 
            (this.plotTopRight.top()+this.plotTopRight.bottom())/2
        ]
        this.topEqn.assignScreenPos(screenPosEqn);

        // MLP image
        let plotBottomLeftProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 2,
            n_columns: 3,
            row_id: 1,
            col_id: 0,
        }
        this.plotBottomLeft = new plt.Plot(plotBottomLeftProps)
        const img2 = new Image();
        img2.src = '../MLP.jpg';
        this.mlpImage = new plt.Image({
            fig: this.figure,
            slide:this,
            name:'title',
            plt: this.plotBottomLeft,
            image: img2,
            margin: .1,
        });
        img2.onload = () => {
            this.mlpImage = new plt.Image({
                fig: this.figure,
                slide:this,
            name:'title',
                plt: this.plotBottomLeft,
                image: img2,
                margin: .1,
            });
            // this.router();
        };

        // bottom arrow
        let plotBottomCenterProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 2,
            n_columns: 6,
            row_id: 1,
            col_id: 2.2,
            col_id_max: 2.5,
        }
        this.plotBottomCenter = new plt.Plot(plotBottomCenterProps);
        this.bottomRay = new plt.Ray({
            fig:this.figure,
            xyz1:()=>[0,0],
            xyz2:()=>[0,1]
        });
        const screen1a = ()=>[
            this.plotBottomCenter.left(),
            (this.plotBottomCenter.top() + this.plotBottomCenter.bottom())/2
        ];
        const screen2a = ()=>[
            this.plotBottomCenter.right(),
            (this.plotBottomCenter.top() + this.plotBottomCenter.bottom())/2
        ];
        this.bottomRay.assignScreenPos([screen1a,screen2a]);

        // Bottom Eqn
        let plotBottomRightProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 2,
            n_columns: 6,
            row_id: 1,
            col_id: 1,
            col_id_max: 7
        }
        this.plotBottomRight = new plt.Plot(plotBottomRightProps);
        this.bottomEqn = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "Aˡ⁺¹ = 𝑓(WAˡ + b)",
            font: "100px myFont",
        });
        const screenPosEqna = ()=>[
            (this.plotBottomRight.left()+this.plotBottomRight.right())/2, 
            (this.plotBottomRight.top()+this.plotBottomRight.bottom())/2
        ]
        this.bottomEqn.assignScreenPos(screenPosEqna);

        this.router();
    }

    draw0(){
       // create animation function
       let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.neuronImage.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw1(){
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.topRay.draw();
            this.neuronImage.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw2(){
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.topRay.draw();
            this.neuronImage.draw();
            this.topEqn.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }
 
    draw3(){
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.topRay.draw();
            this.neuronImage.draw();
            this.topEqn.draw();
            this.mlpImage.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw4(){
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.topRay.draw();
            this.neuronImage.draw();
            this.topEqn.draw();
            this.mlpImage.draw();
            this.bottomRay.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw5(){
        this.bottomEqn.text= "Aˡ⁺¹ = 𝑓(WAˡ + b)"
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.topRay.draw();
            this.neuronImage.draw();
            this.topEqn.draw();
            this.mlpImage.draw();
            this.bottomRay.draw();
            this.bottomEqn.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw6(){
        this.bottomEqn.text= "Xᵀ' = 𝑓(WXᵀ + b)"
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.topRay.draw();
            this.neuronImage.draw();
            this.topEqn.draw();
            this.mlpImage.draw();
            this.bottomRay.draw();
            this.bottomEqn.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw7(){
        this.bottomEqn.text= "X' = 𝑓(XWᵀ + b)"
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.topRay.draw();
            this.neuronImage.draw();
            this.topEqn.draw();
            this.mlpImage.draw();
            this.bottomRay.draw();
            this.bottomEqn.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }

    draw8(){
        this.bottomEqn.text= "X' = 𝑓(XW + b)\n(FF)"
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.topRay.draw();
            this.neuronImage.draw();
            this.topEqn.draw();
            this.mlpImage.draw();
            this.bottomRay.draw();
            this.bottomEqn.draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,' ')
    }
}

let app = new Intro();

