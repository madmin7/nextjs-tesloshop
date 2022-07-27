import { IProduct } from "../interfaces";
import { User, Product } from "../models"
import { db } from "./"


interface ProductSlug {
    slug: string;
}


export const getProductBySlug = async ( slug: string ): Promise <IProduct | null> => {

    await db.connect();

    const product = await Product.findOne({ slug }).lean();

    await db.disconnect();

    if (!product){
        return null
    }

    product.images = product.images.map( img => {
        return img.includes('http') ? img : `${ process.env.HOST_NAME }products/${ img }`
    })

    return JSON.parse( JSON.stringify( product ) );

}



export const getAllProductsSlugs = async (): Promise<ProductSlug[]> => {
    
    await db.connect();

    const slugs = await Product.find().select('slug -_id').lean();

    await db.disconnect();

    return slugs;
}




export const getProductsByTerms = async ( term: string ): Promise<IProduct[]> => {

    term = term.toString().toLowerCase();

    await db.connect();

    const products = await Product.find({
        $text: { $search: term }
    })
    .select('title images price inStock slug -_id')
    .lean();

    await db.disconnect();

    const updatedProducts = products.map( prod => {
        prod.images = prod.images.map( img => {
            return img.includes('http') ? img : `${ process.env.HOST_NAME }products/${ img }`
        })

        return prod;
    })

    return updatedProducts;
}


export const getAllProducts = async (): Promise<IProduct[]> => {
    
        await db.connect();

        const products = await Product.find().select('title images price inStock slug -_id').lean();

        await db.disconnect();

        const updatedProducts = products.map( prod => {
            prod.images = prod.images.map( img => {
                return img.includes('http') ? img : `${ process.env.HOST_NAME }products/${ img }`
            });
    
            return prod;
        })

        return JSON.parse( JSON.stringify( updatedProducts ));
}