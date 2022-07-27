import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../database";
import { seedDatabase } from "../../database";
import { Product, User } from "../../models";



interface Data {
  mensaje: string;

}


export default async function handler (req: NextApiRequest, res:NextApiResponse <Data>) {


  if ( process.env.NODE_ENV === 'production'){
    res.status(401).json({ mensaje: 'No tiene acceso a este servicio' })
  }


  await db.connect();

  await User.deleteMany();
  
  await User.insertMany( seedDatabase.initialData.users );

  await Product.deleteMany();

  await Product.insertMany( seedDatabase.initialData.products );  

  await db.disconnect();


  res.status(200).json({ mensaje: 'Proceso Realizado correctamente' })
}
