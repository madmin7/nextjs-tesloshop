import { useContext } from 'react';
import NextLink from 'next/link';


import { AppBar, Toolbar, Typography, Link, Box, Button } from "@mui/material";
import { CartContext, UIContext } from '../../context';




export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext( UIContext );


    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Testlo |</Typography>
                        <Typography sx={{ ml: 0.5 }} >Shop</Typography>
                    </Link>
                </NextLink>


                <Box flex={1} />
                


                <Button
                    onClick={ toggleSideMenu }
                >
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}
