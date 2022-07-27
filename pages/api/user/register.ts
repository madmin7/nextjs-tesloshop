import bcrypt from 'bcryptjs'

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

type Data =
| { message: string }
| {
    token: string;
    user:{
        email: string;
        name: string;
        rol: string;
    }
}


export default function handler(req: NextApiRequest, res:NextApiResponse <Data>) {

    switch (req.method) {
        case 'POST':
            return registerUser( req, res )
        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    

    const { email = '', password= '', name= '' } = req.body as { email: string, password: string, name: string }


    if( password.length < 5 ){
        res.status(400).json({
            message: 'La contraseña debe ser de 5 caracteres o mas'
        })
    }

    if( name.length < 2 ){
        res.status(400).json({
            message: 'El nombre debe tener mas de 2 caracteres'
        })
    }

    if( !validations.isValidEmail(email) ){
        res.status(400).json({
            message: 'El correo no es válido'
        })
    }


    await db.connect();

    const user = await User.findOne({ email });


    if ( user ) {
        return res.status(400).json({
            message:'No puede usar ese correo'
        })
    }

    await db.disconnect();

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync( password ),
        rol: 'client',
        name
    })


    try {
        await newUser.save({ validateBeforeSave:true })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:'Revisar logs del servidor'
        })
    }

    const { _id, rol } = newUser;

    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        token, //jwt
        user:{
            email,
            rol,
            name
        }
    })
}
