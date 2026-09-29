export type YandexGeocodeResponse = {
    response: {
        GeoObjectCollection: {
            metaDataProperty: {
                GeocoderResponseMetaData: {
                    request: string,
                    results: string,
                    found: string
                }
            },
            featureMember: YandexFeatureMember[],
        }
    },
}
export type YandexFeatureMember = {
    GeoObject: YandexGeoObject,
}
export type YandexGeoObject = {
    metaDataProperty: {
        GeocoderMetaData: {
            precision: string,
            text: string,
            kind: string,
            Adress: {
                country_code: string,
                formatted: string,
                Components: YandexAdressComponent[]
            },
            AdressDetails: YandexAdressDetails,
        }
    },
    name: string,
    description: string,
    boundedBy: {
        Envelope: {
            lowerCorner: string,
            upperCorner: string,
        }
    },
    uri: string,
    Point: {
        pos: string
    }

}
export type YandexAdressComponent = {
    kind: string,
    name: string,
}

export type YandexAdressDetails = {
    Country: {
        AddressLine: string,
        CountryNameCode: string,
        CountryName: string,
        AdministrativeArea?: {
            AdministrativeAreaName: string,
            SubAdministrativeArea?: {
                SubAdministrativeAreaName: string,
                Locality?: {
                    LocalityName: string,
                    Premise?: {
                        PremiseName: string,
                    }
                }
            }
        }
    }
}