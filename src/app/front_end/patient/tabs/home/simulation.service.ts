import { Injectable } from '@angular/core';
import { Simulation } from './simulation';
import { sample } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  public hasTakenSample: boolean;
  private _normal: boolean;
  public simulationObject : Simulation = new Simulation();
  public sampleSensor: SampleSensor = {
    state: undefined,
    value: undefined
  };

  public sampleSensorSent: SampleSensorSent = {}

  get normal() {
    return this._normal;
  }

  temperatureSample() {

    this._normal = true;
    if(this.simulationObject.state()) {
      this.sampleSensor.state = true;
      console.log('working');

      if(this.simulationObject.state()) {
        
        this.sampleSensor.value = this.simulationObject.temperature_norm();
        console.log('normal');
      }
      else {
        this.sampleSensor.value = this.simulationObject.temperature_anorm();
        this._normal = false;
        console.log('anormal');
      }
      
    }
    else { 
      console.log('not working');
      this.sampleSensor.state = false;
      this.sampleSensor.value = null;
    }



    return {
      state: this.sampleSensor.state,
      value: this.sampleSensor.value
    };
  }

  glucoseSample() {

    if(this.simulationObject.state()) {
      this.sampleSensor.state = true;

      if(this.simulationObject.state()) {
        this.sampleSensor.value = this.simulationObject.glucose_norm();
      }
      else {
        this.sampleSensor.value = this.simulationObject.glucose_anorm();
        this._normal = false;
      }
      
    }
    else { 
      this.sampleSensor.state = false;
      this.sampleSensor.value = null;
    }



    return {
      state: this.sampleSensor.state,
      value: this.sampleSensor.value
    };

  }

  oxygenSample() {

    if(this.simulationObject.state()) {
      this.sampleSensor.state = true;

      if(this.simulationObject.state()) {
        this.sampleSensor.value = this.simulationObject.oxygen_norm();
      }
      else {
        this.sampleSensor.value = this.simulationObject.oxygen_anorm();
        this._normal = false;
      }
      
    }
    else { 
      this.sampleSensor.state = false;
      this.sampleSensor.value = null;
    }


    return {
      state: this.sampleSensor.state,
      value: this.sampleSensor.value
    };
  }

  bloodPressureSample() {

    if(this.simulationObject.state()) {
      this.sampleSensor.state = true;

      if(this.simulationObject.state()) {
        this.sampleSensor.value = this.simulationObject.bloodPressure_norm();
      }
      else {
        this.sampleSensor.value = this.simulationObject.bloodPressure_anorm();
        this._normal = false;
      }
    }
    else { 
      this.sampleSensor.state = false;
      this.sampleSensor.value = null;
    }

    return {
      state: this.sampleSensor.state,
      value: this.sampleSensor.value
    };
  }

  stepsSample() {

    if(this.simulationObject.state()) {
      this.sampleSensor.state = true;

      if(this.simulationObject.state()) {
        this.sampleSensor.value = this.simulationObject.steps_norm();
      }
      else {
        this.sampleSensor.value = this.simulationObject.steps_anorm();
        this._normal = false;
      }
      
    }
    else { 
      this.sampleSensor.state = false;
      this.sampleSensor.value = null;
    }



    return {
      state: this.sampleSensor.state,
      value: this.sampleSensor.value
    };

  }

  heartbeatSample() {

    if(this.simulationObject.state()) {
      this.sampleSensor.state = true;

      if(this.simulationObject.state()) {
        this.sampleSensor.value = this.simulationObject.heartbeat_norm();
      }
      else {
        this.sampleSensor.value = this.simulationObject.heartbeat_anorm();
        this._normal = false;
      }
      
    }
    else { 
      this.sampleSensor.state = false;
      this.sampleSensor.value = null;
    }
    return {
      state: this.sampleSensor.state,
      value: this.sampleSensor.value
    };
  }

  sampleSensorSentReturned() {
    this.sampleSensorSent.temperature = this.temperatureSample();
    this.sampleSensorSent.oxygen = this.oxygenSample();
    this.sampleSensorSent.glucose = this.glucoseSample();
    this.sampleSensorSent.steps = this.stepsSample();
    this.sampleSensorSent.heartbeat = this.heartbeatSample();
    this.sampleSensorSent.bloodPressure = this.bloodPressureSample();
    this.sampleSensorSent.date = new Date();
    return this.sampleSensorSent;
  }

  constructor() { }
}

export interface SampleSensor {
  state: boolean,
  value: number
}

export interface SampleSensorSent {
  temperature?: SampleSensor,
  glucose?: SampleSensor,
  oxygen?: SampleSensor,
  bloodPressure?: SampleSensor,
  steps?: SampleSensor,
  heartbeat?: SampleSensor,
  date?: Date
}