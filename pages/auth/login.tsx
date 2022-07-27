import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, getSession, getProviders } from 'next-auth/react';
import { GetServerSideProps } from 'next';

import NextLink from 'next/link'
import { useForm } from "react-hook-form";


import { Link, Box, Grid, TextField, Typography, Button, Chip, Divider } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from "../../components/layouts";
import { validations } from '../../utils';
// import { AuthContext } from '../../context';


type FormData = {
    email: string,
    password: string,
  };



const LoginPage= () => {

    const router= useRouter()

    // const { loginUser } = useContext(AuthContext);
    
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false);

    const [providers, setProviders] = useState<any>({});


    useEffect(() => {
        getProviders().then( prov => {

            setProviders( prov);
        })
    }, [])
    

    

    const onLoginUser= async ( { email, password }: FormData )=> {
        setShowError(false);

        // const isValidLogin= await loginUser( email, password );
        // if (!isValidLogin){
        //     console.log('Error en las credenciales');
        //     setShowError(true);
        //     setTimeout(()=> setShowError(false), 5000);
        //     return ;
        // };
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials', { email, password });
    }
 


    return (
        <AuthLayout title='Ingresar'>

            <form onSubmit={ handleSubmit(onLoginUser) } noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={ 12 }>
                            <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                                                       
                            
                            <Chip 
                                label='El ususario o password son incorrectos'
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex': 'none'}}
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
                                type='password' 
                                label='Contraseña' 
                                variant='filled' 
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
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                                type='submit'
                            >
                                Ingresar
                            </Button>
                        </Grid>
                        <Grid item xs={ 12 } display='flex' justifyContent='end'>

                            <NextLink 
                                href={ router.query.p ? `/auth/register?p=${ router.query.p }` : '/auth/register' } 
                                passHref
                            >
                                <Link underline='always'>
                                    ¿No tienes cuenta?
                                </Link>
                            </NextLink>

                        </Grid>

                        <Grid item xs={ 12 } display='flex' justifyContent='end' flexDirection={'column'}>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                                {
                                    Object.values( providers ).map( ( prov: any ) => {

                                        if ( prov.id === 'credentials' ){
                                            return (
                                                <div key="credentials"></div>
                                            )
                                        }

                                        return (
                                            <Button
                                                key={ prov.id }
                                                variant='outlined'
                                                fullWidth
                                                color='primary'
                                                sx={{ mb:1 }}
                                                onClick={ ()=> signIn( prov.id ) }
                                            >
                                                { prov.name }
                                            </Button>
                                        )
                                    })
                                }
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



export default LoginPage;

