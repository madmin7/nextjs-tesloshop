import { NextApiRequest, NextApiResponse } from 'next';


type Data = 
  | { message: string }

const handler = ( req: NextApiRequest, res:NextApiResponse <Data> ) => {
    return res.status(400).json({ message: 'Debe espeficicar el query de busqueda' })
}


export default handler;