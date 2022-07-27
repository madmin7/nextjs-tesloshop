
import { NextApiRequest, NextApiResponse } from 'next';
import { db, SHOP_CONSTANTS } from '../../../database';
import { Product, User } from '../../../models';
import { IProduct } from '../../../interfaces/products';

type Data = 
  | { message: string }
  |  IProduct


const handler = ( req: NextApiRequest, res:NextApiResponse <Data> ) => {

    switch ( req.method ) {
        case 'GET':
            return getProductsBySlug( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad Request' })
    }

}

const getProductsBySlug = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { slug } = req.query;

    await db.connect();

    const product = await Product.findOne({ slug }).lean()

    await db.disconnect();

    if( !product ){
        return res.status(404).json({ message: 'No se encontro ningun producto'})
    }

    product.images = product.images.map( img => {
        return img.includes('http') ? img : `${ process.env.HOST_NAME }products/${ img }`
    })

    return res.status(200).json( product );
}


export default handler;