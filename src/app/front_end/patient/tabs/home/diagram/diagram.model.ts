export interface Sensor {
    state?: boolean,
    values?: number[][]
}

export interface GlobalSensor {
    temperature?: Sensor,
    bloodPressure?: Sensor,
    heartbeat?: Sensor,
    glucose?: Sensor,
    steps?: Sensor,
    oxygen?: Sensor,
    dates?: string[][]
}
