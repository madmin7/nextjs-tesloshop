import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';


type Data =
| { message: string }
| IUser[]


export default function handler ( req: NextApiRequest, res:NextApiResponse <Data> ) {


    switch (req.method) {
        case 'GET':
            return getUsers(req, res)

        case 'PUT':
            return updateUser(req, res)
    
        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
    
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const users = await User.find().select('-password').lean();

    await db.disconnect();

    return res.status(200).json( users )
}


const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { userId = '', rol = ''} = req.body;

    if( !isValidObjectId(userId) ){
        return res.status(400).json({ message: 'No existe usuario por ese ID' });
    }

    const validRoles = ['admin', 'super-user', 'client'];

    if( !validRoles.includes( rol ) ){
        return res.status(400).json({ message: 'Rol no permitido' + validRoles.join(', ') });
    }

    await db.connect();

    const user = await User.findById( userId );

    if ( !user ){
        await db.disconnect();
        return res.status(404).json({ message: 'Usuario no encontrado' + userId });
    }
        
    user.rol= rol;
    user.save();

    await db.disconnect();


    return res.status(200).json({ message: 'Usuario actualizado'})
}

