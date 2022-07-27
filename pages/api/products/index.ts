
import { NextApiRequest, NextApiResponse } from 'next';
import { db, SHOP_CONSTANTS } from '../../../database';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces/products';

type Data = 
  | { message: string }
  |  IProduct[]


const handler = ( req: NextApiRequest, res:NextApiResponse <Data> ) => {

    switch ( req.method ) {
        case 'GET':
            return getProducts( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad Request' })
    }

}

const getProducts = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { gender = 'all' } = req.query;

    let condition = {}

    if( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes( `${gender}` )){
        condition = { gender }
    }

    await db.connect();

    const products = await Product.find( condition )
                                  .select('title images price inStock slug -_id')
                                  .lean()

    await db.disconnect();


    const updatedProducts = products.map( prod => {
        prod.images = prod.images.map( img => {
            return img.includes('http') ? img : `${ process.env.HOST_NAME }products/${ img }`
        })

        return prod;
    })

    return res.status(200).json( updatedProducts );
}


export default handler;