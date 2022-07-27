import { useEffect, useState } from 'react';
import { PeopleOutline } from '@mui/icons-material';
import { AdminLayout } from '../../components/layouts/AdminLayout';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';



const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');

    const [ users, setUsers ] = useState<IUser[]>([]);


    useEffect(() => {
      if(data){
        setUsers(data);
      }
    }, [data])
    


    if( !data && !error ) return (<></>)


    const onRolUpdated = async ( userId: string, newRol: string ) => {

        const previosUser = users.map( user => ({ ...user }))

        const updatedUsers = users.map( user => ({
            ...user,
            rol: userId === user._id ? newRol : user.rol
        }))

        setUsers(updatedUsers);

        try {
            
            await tesloApi.put('/admin/users', { userId, rol: newRol });

        } catch (error) {
            setUsers(previosUser);
            console.log(error);
            alert('No se pudo actualizar el rol del usuario');
        }

    }


    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 400 },
        { field: 'name', headerName: 'Nombre Completo', width: 400 },
        { 
            field: 'rol', 
            headerName: 'Rol', 
            width: 350,
            renderCell: ({ row }: GridValueGetterParams ) => {
                return (
                    <Select
                        value={ row.rol }
                        label='Rol'
                        onChange={({ target }) => onRolUpdated( row.id, target.value ) }
                        sx={{ width: '400px'}}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>
                        <MenuItem value='super-user'>Super User</MenuItem>
                    </Select>
                )
            }
        },
    ];

    const rows = users.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        rol: user.rol
    }))


    return (
        <AdminLayout 
            title='Usuarios'
            subTitle='Mantenimiento de Usuarios'
            icon={ <PeopleOutline />}
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

export default UsersPage;