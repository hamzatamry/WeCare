export interface Patient {
    patient: {
        profile: {
            firstName?: string,
            lastName?: string,
            birthday?: string,
            sex?: string,
            phoneNumber?: string,
            country?: string,
            address?: string,
            staticMapImageUrl?: string,
            imagePath?: string
            adress?: string
        },
        _id?: string,
        email?: string
    }
    confirmed?: boolean
}
