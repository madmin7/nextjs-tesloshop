import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Product, User } from '../../../models';
import Order from '../../../models/Order';

interface Data {
    numberOfOrders: number;
    paidOrders: number; // isPaid true
    notPaidOrders: number;
    numberOfClients: number; // rol: cliente
    numberOfProducts: number;
    productsWithNoInventory: number; // 0
    lowInventory: number; // productos con 10 o menos stock
}


export default async function handler ( req: NextApiRequest, res:NextApiResponse <Data> ) {


    await db.connect();

    // const numberOfOrders  = await Order.count();
    // const paidOrders = await Order.find({ isPaid: true }).count();
    // const numberOfClients = await User.find({ rol: 'client' }).count();
    // const numberOfProducts = await Product.count();
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        ] = await Promise.all([
            Order.count(),
            Order.find({ isPaid: true }).count(),
            User.find({ rol: 'client' }).count(),
            Product.count(),
            Product.find({ inStock: 0 }).count(),
            Product.find({ inStock: { $lte: 10 } }).count()
        ])



    await db.disconnect();

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders: numberOfOrders - paidOrders
    })
}