import { useContext, useState } from 'react';

import { GetServerSideProps } from 'next';
import { signIn, getSession } from 'next-auth/react';
import NextLink from 'next/link'
import { useRouter } from 'next/router';

import { useForm } from "react-hook-form";

import { Link, Box, Grid, TextField, Typography, Button, Chip } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';
import { AuthLayout } from "../../components/layouts";
import { validations } from '../../utils';
import { AuthContext } from '../../context';



type FormData = {
    email: string;
    password: string;
    name: string;
  };


  
export const RegisterPage = () => {


    const router= useRouter();

    const { registerUser } = useContext( AuthContext );
 
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false);

    const [errorMessage, setErrorMessage ] = useState('');


    const onRgisterForm= async( { email, password, name }: FormData ) => {

        setShowError(false);

        const { hasError, message } = await registerUser( name, email, password );
        
        if( hasError ){

            console.log('Los datos no cumplen con las especificaciones');
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(()=> setShowError(false), 5000);
            return;
        }
        
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
        
        await signIn('credentials', {email, password});

    }
    
    return (

        <AuthLayout title='Ingresar'>

            <form onSubmit={ handleSubmit(onRgisterForm) } noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={ 12 }>
                            <Typography variant='h1' component='h1'>Crear Cuenta</Typography>
                            
                            <Chip 
                                label='El ususario ya esta registrado'
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex': 'none'}}
                            />
                        
                        </Grid>
        
                        <Grid item xs={ 12 }>
                            <TextField 
                                label='Nombre completo' 
                                variant='filled' 
                                fullWidth
                                { ...register('name', {
                                    required:'Este campo es requerido',
                                    minLength: { value:3, message:'El nombre debe tener mas de dos caracteres' }
                                })}
                                error={ !!errors.name }
                                helperText={ errors.name?.message }
                            />
                        </Grid>
                        <Grid item xs={ 12 }>
                            <TextField
                                type='email'
                                label='Correo' 
                                variant='filled' 
                                fullWidth
                                { ...register('email', {
                                    required:'Este campo es requerido',
                                    validate: validations.isEmail
                                })}
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>
                        <Grid item xs={ 12 }>
                            <TextField 
                                label='Contraseña' 
                                variant='filled' 
                                type='password' 
                                fullWidth
                                { ...register('password',{
                                    required: 'Este campo es requerido',
                                    minLength: { value:6, message:'Mínimo 6 caracteres' }
                                })}
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>
                        <Grid item xs={ 12 }>
                            <Button 
                                type='submit'
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                            >
                                Crear cuenta
                            </Button>
                        </Grid>
                        <Grid item xs={ 12 } display='flex' justifyContent='end'>
                            <NextLink 
                            href={router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/register' } 
                            passHref
                            >
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>

        </AuthLayout>
      )
    }


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });

    const { p = '/'} = query;

    if ( session ){
        return {
            redirect:{
                destination: p.toString(),
                permanent: false,
            }
        }
    }

    return {
        props: { }
    }
}


export default RegisterPage;
