import NextLink from 'next/link';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IProduct } from '../../interfaces';
import { Box } from '@mui/system';



const columns: GridColDef[] = [

    { 
        field:'img', 
        headerName:'Foto',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={`/product/${ row.slug }`} target='_blank' rel='noreferrer'>
                    <CardMedia 
                        component={'img'}
                        className='fadeIn'
                        image={ row.img }
                        alt={ row.title }
                    />
                </a>
            )
        } 
    },
    { 
        field:'title', 
        headerName:'Nombre Proudcto', 
        width: 250,
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${ row.slug }`} passHref>
                    <Link underline='always'>
                        { row.title }
                    </Link>
                </NextLink>
            )
        }
    },
    { field:'gender', headerName:'Genero'},
    { field:'type', headerName:'Tipo'},
    { field:'inStock', headerName:'Inventario'},
    { field:'price', headerName:'Precio'},
    { field:'sizes', headerName:'Talles', width: 250 },
];




const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if( !data && !error ) return <></>

    const rows = data!.map( product => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
    }))


    return (
        <AdminLayout 
            title={ `Products (${ data?.length })`} 
            subTitle={"Mantenimiento de products"}
            icon={ <CategoryOutlined /> }
        >
            <Box display='flex' justifyContent='end' sx={{ mb:2 }}>
                <Button
                    startIcon={ <AddOutlined /> }
                    color='secondary'
                    href='/admin/products/new' 
                >
                    Crear Producto
                </Button>
            </Box>

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

export default ProductsPage;
