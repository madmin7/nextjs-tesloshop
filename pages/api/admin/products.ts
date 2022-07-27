import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';


import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '');

type Data =
| { message: string }
| IProduct[]
| IProduct


export default function handler ( req: NextApiRequest, res:NextApiResponse <Data> ) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProduct(req, res);

        case 'POST':
            return createProduct(req, res);
                        
        default:
            res.status(400).json({ message: 'Bad Request' });
    }


    
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const products = await Product.find()
                                  .sort({ title: 'asc' })
                                  .lean();
    await db.disconnect();

    const updatedProducts = products.map( prod => {
        prod.images = prod.images.map( img => {
            return img.includes('http') ? img : `${ process.env.HOST_NAME }products/${ img }`
        })

        return prod;
    })

    return res.status(200).json( updatedProducts );
}




const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body as IProduct;

    if ( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'El id del produto no es válido' });
    }

    if( images.length < 2 ){
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    //todo: tendremos un localhost:3000/products/xxxxxxxxxx.jpg

    try {
        await db.connect();

        const producto = await Product.findById( _id );

        if ( !producto ){
            await db.disconnect();
            return res.status(400).json({ message: 'No se encontro un producto con ese ID' });
        }

        //todo: eliminar fotos cloudinary
        //https://res.cloudinary.com/dewpf1uen/image/upload/v1658952790/wlwgwmkeau2byxsjkuec.webp

        producto.images.forEach( async( image)=> {
            if ( !images.includes( image ) ){
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.');
                console.log({ image, fileId, extension })

                await cloudinary.uploader.destroy(fileId);
            }
        })

        await producto.update( req.body );

        await db.disconnect();


        return res.status(200).json( producto );
        

    } catch (error) {
        console.log(error);
        await db.disconnect();

        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }


}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
   
    const { images = '' } = req.body as IProduct;

    if( images.length < 2 ){
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
    }

    //todo: tendremos un localhost:3000/products/xxxxxxxxxx.jpg


    try {
        await db.connect();

        const productInDB = await Product.findOne({ slug: req.body.slug });

        if( productInDB ){
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe en db un producto con ese slug' });
        }

        const product = new Product( req.body );

        await product.save();

        await db.disconnect();

        return res.status(201).json( product );


    } catch (error) {

        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
        
    }


}

