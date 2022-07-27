
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IOrder, IUser } from '../../interfaces';



const columns: GridColDef[] = [

    { field:'id', headerName:'Orden Id', width: 250 },
    { field:'email', headerName:'Correo', width: 180 },
    { field:'name', headerName:'Nombre Completo', width: 150 },
    { field:'total', headerName:'Monto Total', width: 80 },
    {
        field:'isPaid',
        headerName: 'Pagada',
        renderCell: ({ row }:GridValueGetterParams) => {
            return row.isPaid
            ? (
                <Chip variant='outlined' label='Pagada' color="success" />
            )
            :(
                <Chip variant='outlined' label='Pendiente' color="error" />
            )
        }
    },
    { field:'noProducts', headerName:'No. Productos', align: 'center' },
    {
        field:'Check',
        headerName: 'Ver Orden',
        renderCell: ({ row }:GridValueGetterParams) => {
            return (
                <a href={`/admin/orders/${ row.id }`} target='_blanck' rel='noreferrer' >
                    Ver Orden
                </a>
            )
        }
    },
    { field:'createdAt', headerName:'Creada en', width: 270 },
]




const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if( !data && !error ) return <></>

    const rows = data!.map( orden => ({
        id: orden._id,
        email: (orden.user as IUser).email,
        name: (orden.user as IUser).name,
        total: orden.total,
        isPaid: orden.isPaid,
        noProducts: orden.numberOfItems,
        createdAt: orden.createdAt,

    }))


    return (
        <AdminLayout 
            title={"Ordenes"} 
            subTitle={"Mantenimiento de Ordenes"}
            icon={ <ConfirmationNumberOutlined /> }
        >

                <Grid container className='fadeIn'>
                    <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
                        <DataGrid 
                            rows={ rows }
                            columns={ columns }
                            pageSize={ 10 }
                            rowsPerPageOptions={ [10] }
                        />
                    </Grid>
                </Grid>

        </AdminLayout>
    )
}

export default OrdersPage
