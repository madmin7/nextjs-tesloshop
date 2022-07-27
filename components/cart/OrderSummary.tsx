import { Grid, Typography } from "@mui/material"
import { FC, useContext } from "react";
import { CartContext } from "../../context";
import { currency } from "../../utils";
import { IOrder } from '../../interfaces/order';


interface Props {
    orderValues?: {
        numberOfItems:number;
        subTotal     :number;
        impuesto     :number;
        total        :number;
    }

}


export const OrderSummary: FC <Props> = ({ orderValues }) => {

    const { numberOfItems, subTotal, impuesto, total } =useContext( CartContext );

    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, impuesto, total }

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ summaryValues.numberOfItems } { summaryValues.numberOfItems > 1 ? 'items' : 'item' }</Typography>
            </Grid>


            <Grid item xs={ 6 }>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end'>
                <Typography>{ currency.format( summaryValues.subTotal ) }</Typography>
            </Grid>


            <Grid item xs={ 6 }>
                <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end'>
                <Typography>{ currency.format( summaryValues.impuesto ) }</Typography>
            </Grid>


            <Grid item xs={ 6 } sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>
            <Grid item xs={ 6 } sx={{ mt: 2 }} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>{ currency.format( summaryValues.total ) }</Typography>
            </Grid>


        </Grid>    
    )
}
