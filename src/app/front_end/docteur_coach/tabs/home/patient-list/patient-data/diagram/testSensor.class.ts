
//classe responsable des differents test de mesures issues des differents type de capteurs
export class TestSensorData {
  
    temperatureTest(temperature: number) {
      if(temperature == null) return 'missing';
      if(temperature >= 36.1 && temperature <= 37.5) return 'Normal';
      if(temperature < 36.1) return 'Low';
      if(temperature > 37.5 && temperature < 37.8) return 'High';
      if(temperature > 37.8) return 'Fever';
      
    }
  
    glycemieTest(glucose: number) {
      if(glucose == null) return 'missing';
      if (glucose < 0.7) return "Hypoglycemia";
      if (glucose <= 1 && glucose >= 0.7) return "Normal";
      if (glucose <= 1.25 && glucose >= 1) return "Moderate hypeglycemia";
      if (glucose >= 1.26) return "Diabetes";
    }
  
    hyperTensionTest(hyperTension: number) {
      if(hyperTension == null) return 'missing';
      if(hyperTension < 107) return 'Low';
      if(107 <= hyperTension && hyperTension <= 120) return 'Optimal';
      if(110 <= hyperTension && hyperTension <= 129) return 'Normal';
      if(130 <= hyperTension && hyperTension <= 139) return 'Normal High';
      if(140 <= hyperTension && hyperTension <= 159) return 'Mild hypertension';
      if(160 <= hyperTension && hyperTension <= 179) return 'Moderate hypertension';
      if(180 <= hyperTension && hyperTension <= 209) return 'Severe hypertension';
      if( 209 < hyperTension) return 'Very severe hypertension';
    }
  
    oxygenationTest(oxygenation: number) {
      if(oxygenation == null) return 'missing';
      if (oxygenation < 95) return "Insufficient saturation";
      if(oxygenation >= 95  && oxygenation <= 100) return "Normal saturation";
    }
  
    heartBeatsTest(heartBeats: number) {
      if(heartBeats == null) return 'missing';
      if(heartBeats < 60) return 'Slow';
      if(heartBeats >= 60 && heartBeats <= 100) return 'Normal';
      if(heartBeats > 100 && heartBeats <= 120) return 'Fast';
      if(heartBeats > 120) return 'Dangerous';
    }
  
    stepsTest(steps: number) {
      if(steps == null) return 'missing';
      if(steps < 5000) return 'Sedentary';
      if(steps >= 5000 && steps <= 7499) return 'Weakly active';
      if(steps > 7499 && steps <= 9999) return 'Moderately active';
      if(steps > 9999 && steps <= 12499) return 'Active';
      if(steps > 12500) return 'Very active';
      if(steps >= 25000) return 'Exhaustion';
    }
  
  }