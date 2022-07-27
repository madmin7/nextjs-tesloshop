
// pongo ? (opcional) porque es informacion que yo no voy
// a tener en el frontEnd

export interface IUser {
    _id      : string;
    name     : string;
    email    : string;
    password?: string;
    rol      : string;

    createdAt?: string;
    updatedAt?: string;
}