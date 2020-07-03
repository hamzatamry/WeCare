import { ChartDataSets } from 'chart.js';

// Temperature and hypertension charts
export class Line_Bar_Charts {

    /*
      tableau contenant les differentes donnees issus des differents capteurs 
      (pour le diagrame global contenant toutes les differentes donnees)
    */ 
    public globalData: ChartDataSets[] = [
      {radius: 5, hoverRadius: 10},
      {radius: 5, hoverRadius: 10},
      {radius: 5, hoverRadius: 10},
      {radius: 5, hoverRadius: 10},
      {radius: 5, hoverRadius: 10},
      {radius: 5, hoverRadius: 10}
    ];
  
    //tableau contenant les donnees du capteur instantié
    public data: ChartDataSets[] = [{radius: 5, hoverRadius: 10}];
  
    //les options qui personnalisent le diagramme
    public options = {
  
      //capacite d'etre responsive en cas d'ajustement de taille de fenetre
      responsive: true,
      legend: {
        position: 'top',
        align: 'center',
        rtl: false,
        labels: {
          padding: 10
        }
      },
      //son titre
      title: { 
        display: true,
        text: "",
        fontSize: 20
      },
      pan: {
        enabled: false,
        mode: "xy"
      },
      zoom: {
        enabled: false,
        mode: "xy"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            }
          }
        ]
      }
    };
  
    constructor(title: string, data: number[]);
    constructor(title: string, data: number[][], labels: string[]);
  
    //contructeur du diagramme global et aussi des differents diagrammes Line ou bar
    constructor(title: string, data: any[] | any[][] , labels?: string[]) {
      this.options.title.text = title;
      if(labels == undefined) { 
          this.data[0].data = data;
          this.data[0].label = title;
          this.data[0].backgroundColor = [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ]
      }
      else {
        let borderColors = [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(200, 192, 192, 1)",
          "rgba(255, 100, 255, 1)",
          "rgba(75, 180, 190, 1)"
        ];
  
        let backgroundColors = [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(200, 192, 192, 0.2)",
          "rgba(255, 100, 255, 0.2)",
          "rgba(75, 180, 190, 0.2)"
        ];
  
        for(let i = 0; i < 6; i++) {
          this.globalData[i].data = data[i];
          this.globalData[i].label = labels[i];
          this.globalData[i].backgroundColor = backgroundColors[i];
          this.globalData[i].borderColor = borderColors[i];
        }
      }
    }
  
    //fonction qui permet de faire la mise a jour des donnees du diagramme instancie
    setData(newData: number[]) {
        this.data[0].data = newData;
      }
    
    //fonction qui met à jour les données du diagramme global
    setGlobalData(newData: number[][]){
      for(let i = 0; i < 6; i++) {
        this.globalData[i].data = newData[i];
      }
    }
}
  
  // steps and heartBeats charts
export class Radar_PolarArea_Chart {
  
    public data: ChartDataSets[] = [
      {
        data: [],
        label: "",
        radius: 5, hoverRadius: 10,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        pointBackgroundColor: "rgba(54, 162, 235, 1)"
      }
    ];
  
    public options = {
      responsive: true,
      title: {
        display: true,
        text: "",
        fontSize: 20
      },
      scale: {
        ticks: {
          beginAtZero: true
        }
      }
    };
  
    constructor(title: string, data: number[]) {
      this.data[0].data = data;
      this.options.title.text = title;
    }
  
    setData(newData: number[]) {
      this.data[0].data = newData;
    }
}