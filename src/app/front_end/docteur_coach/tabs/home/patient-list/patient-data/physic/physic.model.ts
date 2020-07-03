export interface Physic {
    physicalData?: {
        height?: number,
        weight?: number,
    }
    medicalData?: {
        illnesses?: string[],
        disabilities?: string[],
        bloodType?: string,
        details?: string
    }
}