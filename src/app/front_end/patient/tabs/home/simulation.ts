export class Simulation {

  aleatoire(min, max) {
    var alea = Math.random() * (max - min ) + min
    return (alea.toFixed(1) );
  }

  entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  aleatoire1(min, max) {
    return ((Math.random() * (max - min ))+min ).toFixed(2);
  }

  state() {	
    var state = this.entierAleatoire(0,1);
    return Math.random()*(10+state)<8 ;	
  }


  temperature_norm() {
    var temp = this.aleatoire(36.1,37.5);
    return(temp);
  }

  temperature_anorm() {
    var i = this.entierAleatoire(0,1);
    var temp
    switch (i)
    {
      case 0:
      {
          temp = this.aleatoire(34,36);    
          break;
      };
        case 1:
          temp = this.aleatoire(37.6,42);
    }
    return(temp);
  }
  

  heartbeat_norm() {
  var heart= this.aleatoire(60,100);
  return(heart);
  }

  heartbeat_anorm() {
    var i=this.entierAleatoire(0,1);
    var heart
    switch (i)
    {
      case 0:
        {
        heart=this.aleatoire(30,59);
        
        break;
        };
        case 1:
          heart=this.aleatoire(101,200);
        
    }
    return(heart);
  }

  glucose_norm() {
    var gluc=this.entierAleatoire(0.7,1);
    return(gluc);
  }

  glucose_anorm() {
    var i=this.entierAleatoire(0,1);
    var gluc
    switch (i)
    {
      case 0:
        {
          gluc=this.entierAleatoire(0.4,0.7);
          
          break;
        };
        case 1:
          gluc=this.entierAleatoire(1.01,4);
          
    }
    return(gluc);
  }
    
  steps_norm() {
  var temp = this.entierAleatoire(7500,14000);
  return(temp);
  }

  steps_anorm() {
    var i = this.entierAleatoire(0,1);
    var step
    switch (i)
    {
      case 0:
        {
        step = this.entierAleatoire(0,4999);
        
        break;
        };
        case 1:
          step= this.entierAleatoire(25000,70000);
        
    }
    return(step);
  }
    

  oxygen_norm() {
      var oxy= this.aleatoire(95,100);
      return(oxy);
  }

  oxygen_anorm() {
    var oxy= this.aleatoire(50,95);
    return(oxy);
  }
      
    
  bloodPressure_norm() {
    var press1 = this.entierAleatoire(115,120);
    return(press1);
  }

  bloodPressure_anorm() {
    var i = this.entierAleatoire(0,1);
    var bloodpress;
    switch (i)
    {
      case 0:
        {
          bloodpress = this.entierAleatoire(50,107); 
        
        break;
        };
        case 1:
          bloodpress= this.entierAleatoire(140,220);
        
    }     
    return(bloodpress);
  }

}


      
  
      
