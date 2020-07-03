export interface DoctorCoach {
    dc: {
        profile: {
            firstName?: string,
            lastName?: string,
            birthday?: string,
            sex?: string,
            specialty?: string,
            phoneNumber?: string,
            country?: string,
            imagePath?: string
        },
        _id?: string,
        email?: string,
        role?: string,
        geolocation: {
            address?: string,
            staticMapImageUrl?: string,
        }
    }
    confirmed?: boolean
}