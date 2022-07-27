import bcrypt from 'bcryptjs';

import { User } from '../models';
import { db } from './';



export const checkUserEmailPassword= async (email: string, password: string) => {
    
    await db.connect();

    const user = await User.findOne({ email }).lean();

    await db.disconnect();

    if ( !user ){
        return null;
    }

    if ( !bcrypt.compareSync(password, user.password!) ){
        return null;
    }

    const { rol, name, _id } = user;

    return {
        _id,
        email: email.toLowerCase(),
        rol,
        name
    }

};


// funcion que crea o verifica el usuario de Oauth
export const oAuthToDBUser = async ( oAuthEmail: string, oAuthName: string) => {

    await db.connect();

    const user = await User.findOne({ email: oAuthEmail }).lean();

    if ( user ) {
        await db.disconnect();

        const { _id, name, email, rol } = user;

        return { _id, name, email, rol };
    }

    const newUser = new User({
        email: oAuthEmail,
        name: oAuthName,
        password: '@',
        rol: 'client'
    });

    await newUser.save();
    await db.disconnect();

    const { _id, name, email, rol } = newUser;
    return { _id, name, email, rol }

}